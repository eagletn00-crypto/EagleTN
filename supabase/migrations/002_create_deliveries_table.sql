-- ================================================
-- MIGRATION 002: Create Deliveries Table
-- ================================================
--
-- Tracks delivery assignments and driver progress.
-- Bridges orders to delivery drivers.
-- Supports real-time tracking of delivery status.

CREATE TYPE delivery_status AS ENUM (
  'assigned',   -- Driver assigned to delivery
  'accepted',   -- Driver accepted delivery
  'picked_up',  -- Food picked up from restaurant
  'in_transit', -- On the way to customer
  'arrived',    -- Arrived at destination
  'completed',  -- Successfully delivered
  'cancelled',  -- Delivery cancelled
  'failed'      -- Delivery failed
);

CREATE TABLE IF NOT EXISTS deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  driver_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Status and tracking
  status delivery_status NOT NULL DEFAULT 'assigned',
  
  -- Location tracking (start point: restaurant)
  pickup_latitude double precision,
  pickup_longitude double precision,
  
  -- Location tracking (end point: customer)
  delivery_latitude double precision,
  delivery_longitude double precision,
  
  -- Timing milestones
  assigned_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz,
  picked_up_at timestamptz,
  delivered_at timestamptz,
  
  -- Delivery notes
  driver_note text,
  cancellation_reason text,
  
  -- Audit
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT status_progression CHECK (
    (status = 'assigned' AND accepted_at IS NULL) OR
    (status = 'accepted' AND accepted_at IS NOT NULL) OR
    (status = 'picked_up' AND picked_up_at IS NOT NULL) OR
    (status IN ('in_transit', 'arrived', 'completed') AND picked_up_at IS NOT NULL) OR
    (status IN ('cancelled', 'failed'))
  )
);

-- Indexes for quick lookups
CREATE INDEX idx_deliveries_order_id ON deliveries(order_id);
CREATE INDEX idx_deliveries_driver_id ON deliveries(driver_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_deliveries_created_at ON deliveries(created_at DESC);
CREATE INDEX idx_deliveries_driver_status ON deliveries(driver_id, status);

-- Enable Row Level Security
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

-- Client can view deliveries for their orders
CREATE POLICY "Client views own delivery"
ON deliveries FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders o
    WHERE o.id = deliveries.order_id
      AND o.client_id = auth.uid()
  )
);

-- Partner can view deliveries for their orders
CREATE POLICY "Partner views store delivery"
ON deliveries FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders o
    WHERE o.id = deliveries.order_id
      AND EXISTS (
        SELECT 1 FROM partners p
        WHERE p.id = o.partner_id
          AND p.owner_id = auth.uid()
      )
  )
);

-- Driver can view assigned deliveries
CREATE POLICY "Driver views assigned delivery"
ON deliveries FOR SELECT
USING (
  driver_id = auth.uid()
);

-- Driver can update their own delivery
CREATE POLICY "Driver updates own delivery"
ON deliveries FOR UPDATE
USING (driver_id = auth.uid())
WITH CHECK (driver_id = auth.uid());

-- Admin can view all deliveries
CREATE POLICY "Admin views all deliveries"
ON deliveries FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND role = 'admin'
  )
);

-- Partner can update delivery status (when driver not assigned)
CREATE POLICY "Partner can mark as picked up"
ON deliveries FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM orders o
    WHERE o.id = deliveries.order_id
      AND EXISTS (
        SELECT 1 FROM partners p
        WHERE p.id = o.partner_id
          AND p.owner_id = auth.uid()
      )
  )
  AND status IN ('assigned', 'accepted', 'picked_up')
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders o
    WHERE o.id = deliveries.order_id
      AND EXISTS (
        SELECT 1 FROM partners p
        WHERE p.id = o.partner_id
          AND p.owner_id = auth.uid()
      )
  )
);

-- Trigger to update updated_at on delivery changes
CREATE OR REPLACE FUNCTION update_deliveries_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER deliveries_update_timestamp
BEFORE UPDATE ON deliveries
FOR EACH ROW
EXECUTE FUNCTION update_deliveries_timestamp();

-- Trigger to sync delivery status to order status
CREATE OR REPLACE FUNCTION sync_delivery_to_order_status()
RETURNS TRIGGER AS $$
DECLARE
  v_order_status order_status;
BEGIN
  -- Map delivery status to order status
  SELECT CASE
    WHEN NEW.status = 'assigned' THEN 'pending'::order_status
    WHEN NEW.status = 'accepted' THEN 'accepted'::order_status
    WHEN NEW.status = 'picked_up' THEN 'preparing'::order_status
    WHEN NEW.status IN ('in_transit', 'arrived') THEN 'on_the_way'::order_status
    WHEN NEW.status = 'completed' THEN 'delivered'::order_status
    WHEN NEW.status = 'cancelled' THEN 'cancelled'::order_status
    WHEN NEW.status = 'failed' THEN 'failed'::order_status
  END INTO v_order_status;

  -- Update order status
  UPDATE orders
  SET status = v_order_status,
      updated_at = now()
  WHERE id = NEW.order_id;

  -- Log to status history
  INSERT INTO order_status_history (order_id, status, changed_by, note)
  VALUES (
    NEW.order_id,
    v_order_status,
    NEW.driver_id,
    'Delivery status: ' || NEW.status
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER delivery_sync_order_status
AFTER UPDATE ON deliveries
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION sync_delivery_to_order_status();

-- ================================================
-- NOTES
-- ================================================
--
-- DEPLOYMENT:
-- 1. Run this migration in Supabase SQL Editor
-- 2. Verify deliveries table is created: SELECT * FROM deliveries LIMIT 1;
-- 3. Test RLS policies
--
-- WORKFLOW:
-- 1. Order is created (status = pending)
-- 2. Partner assigns a driver: INSERT INTO deliveries(order_id, driver_id, status = 'assigned')
-- 3. Driver accepts: UPDATE deliveries SET status = 'accepted', accepted_at = NOW()
-- 4. Partner marks picked up: UPDATE deliveries SET status = 'picked_up', picked_up_at = NOW()
-- 5. Driver goes in transit: UPDATE deliveries SET status = 'in_transit'
-- 6. Driver completes: UPDATE deliveries SET status = 'completed', delivered_at = NOW()
--    (This automatically updates order status to 'delivered')
--
-- GEOLOCATION:
-- The pickup/delivery lat/lng fields are used for:
-- - Google Maps integration
-- - Real-time driver tracking
-- - Delivery area validation
