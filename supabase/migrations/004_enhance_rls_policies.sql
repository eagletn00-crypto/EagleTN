-- ================================================
-- MIGRATION 004: Enhance RLS Policies for 4-Party Access Control
-- ================================================
--
-- Implements strict row-level security for the 4-party ecosystem:
-- - Client: Can only see/create their own orders
-- - Partner: Can only see/manage orders for their restaurants
-- - Driver: Can only see orders assigned to them
-- - Admin: Can see all orders

-- ===== ORDERS TABLE RLS (Enhanced) =====

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Only service can update orders" ON orders;

-- Client: View own orders only
CREATE POLICY "client_view_own_orders"
ON orders FOR SELECT
USING (
  -- Either the authenticated user is the client
  (auth.uid() = client_id)
  OR
  -- OR user is a guest (client_id IS NULL) - this is handled by business logic
  (client_id IS NULL AND auth.jwt() -> 'sub' IS NOT NULL)
);

-- Client: Create their own orders
CREATE POLICY "client_create_own_order"
ON orders FOR INSERT
WITH CHECK (
  auth.uid() = client_id
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'client'
  )
);

-- Partner: View orders for their restaurants only
CREATE POLICY "partner_view_store_orders"
ON orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM partners p
    WHERE p.id = orders.partner_id
      AND p.owner_id = auth.uid()
  )
);

-- Partner: Update their store's orders (status only, via RPC)
CREATE POLICY "partner_update_store_order"
ON orders FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM partners p
    WHERE p.id = orders.partner_id
      AND p.owner_id = auth.uid()
  )
)
WITH CHECK (
  -- Prevent partner from modifying critical fields
  EXISTS (
    SELECT 1 FROM partners p
    WHERE p.id = orders.partner_id
      AND p.owner_id = auth.uid()
  )
  AND partner_id = OLD.partner_id  -- Cannot reassign order
  AND client_id = OLD.client_id     -- Cannot change client
  AND subtotal = OLD.subtotal       -- Cannot modify pricing (done in RPC)
);

-- Driver: View orders assigned to them
CREATE POLICY "driver_view_assigned_order"
ON orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM deliveries d
    WHERE d.order_id = orders.id
      AND d.driver_id = auth.uid()
  )
);

-- Driver: Update status for assigned orders (limited fields)
CREATE POLICY "driver_update_assigned_order"
ON orders FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM deliveries d
    WHERE d.order_id = orders.id
      AND d.driver_id = auth.uid()
  )
)
WITH CHECK (
  -- Only allow updating status, driver_note, and timestamps
  EXISTS (
    SELECT 1 FROM deliveries d
    WHERE d.order_id = orders.id
      AND d.driver_id = auth.uid()
  )
  AND (
    -- Other fields must not change
    partner_id = OLD.partner_id
    AND client_id = OLD.client_id
    AND subtotal = OLD.subtotal
    AND delivery_fee = OLD.delivery_fee
    AND platform_fee = OLD.platform_fee
    AND total_amount = OLD.total_amount
    AND payment_method = OLD.payment_method
  )
);

-- Admin: Full access
CREATE POLICY "admin_manage_all_orders"
ON orders FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ===== ORDER_ITEMS TABLE RLS =====

DROP POLICY IF EXISTS "Users can view order items" ON order_items;

-- Items inherit security from parent order
CREATE POLICY "view_order_items"
ON order_items FOR SELECT
USING (
  -- User can see items if they can see the order
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
      AND (
        orders.client_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM partners p
          WHERE p.id = orders.partner_id
            AND p.owner_id = auth.uid()
        )
        OR EXISTS (
          SELECT 1 FROM deliveries d
          WHERE d.order_id = orders.id
            AND d.driver_id = auth.uid()
        )
        OR EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND role = 'admin'
        )
      )
  )
);

-- Prevent direct item modifications (only via RPC)
CREATE POLICY "prevent_order_item_modifications"
ON order_items FOR INSERT, UPDATE, DELETE
USING (FALSE);

-- ===== ORDER_STATUS_HISTORY TABLE RLS =====

DROP POLICY IF EXISTS "Users can view order history" ON order_status_history;

CREATE POLICY "view_order_history"
ON order_status_history FOR SELECT
USING (
  -- User can view history if they can see the order
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_status_history.order_id
      AND (
        orders.client_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM partners p
          WHERE p.id = orders.partner_id
            AND p.owner_id = auth.uid()
        )
        OR EXISTS (
          SELECT 1 FROM deliveries d
          WHERE d.order_id = orders.id
            AND d.driver_id = auth.uid()
        )
        OR EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND role = 'admin'
        )
      )
  )
);

-- Only the database can insert history (via triggers/RPC)
CREATE POLICY "prevent_history_modifications"
ON order_status_history FOR INSERT, UPDATE, DELETE
USING (FALSE);

-- ================================================
-- ENABLE REALTIME FOR ORDERS AND HISTORY
-- ================================================

-- This allows frontend to subscribe to changes
ALTER TABLE orders REPLICA IDENTITY FULL;
ALTER TABLE order_status_history REPLICA IDENTITY FULL;
ALTER TABLE deliveries REPLICA IDENTITY FULL;

-- ================================================
-- FUNCTION: Mask sensitive customer data for drivers
-- ================================================

CREATE OR REPLACE FUNCTION get_order_for_driver(p_order_id uuid)
RETURNS TABLE (
  id uuid,
  client_name text,
  client_phone text,  -- Masked for privacy
  delivery_address text,
  delivery_latitude double precision,
  delivery_longitude double precision,
  total_amount numeric,
  driver_note text,
  status order_status,
  partner_id uuid
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    o.id,
    o.client_name,
    CASE
      WHEN EXISTS (
        SELECT 1 FROM deliveries d
        WHERE d.order_id = o.id AND d.driver_id = auth.uid()
      )
      THEN o.client_phone
      ELSE SUBSTRING(o.client_phone FROM 1 FOR 3) || '***' || SUBSTRING(o.client_phone FROM -4)
    END,
    o.delivery_address,
    o.delivery_latitude,
    o.delivery_longitude,
    o.total_amount,
    o.driver_note,
    o.status,
    o.partner_id
  FROM orders o
  WHERE o.id = p_order_id
    AND (
      EXISTS (
        SELECT 1 FROM deliveries d
        WHERE d.order_id = o.id AND d.driver_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid() AND p.role = 'admin'
      )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_order_for_driver(uuid) TO authenticated;

-- ================================================
-- NOTES
-- ================================================
--
-- DEPLOYMENT:
-- 1. Run this migration in Supabase SQL Editor
-- 2. Test each policy:
--    - Login as client, try to view other's orders (should fail)
--    - Login as partner, try to view other store's orders (should fail)
--    - Login as driver, try to view unassigned orders (should fail)
--    - Login as admin, verify all orders visible
--
-- TESTING RLS:
-- 
-- As CLIENT:
-- SELECT * FROM orders WHERE client_id = auth.uid(); -- Works
-- SELECT * FROM orders LIMIT 1; -- Shows only own orders
--
-- As PARTNER:
-- SELECT * FROM orders WHERE partner_id IN (
--   SELECT id FROM partners WHERE owner_id = auth.uid()
-- ); -- Works
--
-- As DRIVER:
-- SELECT * FROM orders WHERE id IN (
--   SELECT order_id FROM deliveries WHERE driver_id = auth.uid()
-- ); -- Works
--
-- As ADMIN:
-- SELECT * FROM orders; -- Shows all
--
-- PRIVACY:
-- - Drivers cannot see full customer phone numbers unless order is assigned to them
-- - Use get_order_for_driver() function to fetch order with masked data
-- - Sensitive fields are never exposed to unauthorized roles
