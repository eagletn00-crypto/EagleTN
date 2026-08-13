-- ================================================
-- MIGRATION 003: Create Update Order Status RPC
-- ================================================
--
-- Secure RPC function for status transitions.
-- Only allows valid state transitions.
-- Creates audit trail in order_status_history.
-- Can only be called by order owner, assigned driver, partner, or admin.

CREATE OR REPLACE FUNCTION update_order_status(
  p_order_id uuid,
  p_new_status order_status,
  p_note text DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_order_id uuid;
  v_current_status order_status;
  v_client_id uuid;
  v_partner_id uuid;
  v_caller_id uuid;
  v_caller_role user_role;
  v_can_update boolean := FALSE;
  v_valid_transition boolean := FALSE;
BEGIN
  v_caller_id := auth.uid();
  
  -- Get caller's role
  SELECT role INTO v_caller_role
  FROM profiles
  WHERE id = v_caller_id;

  IF v_caller_role IS NULL THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'message', 'User profile not found',
      'code', 'INVALID_USER'
    );
  END IF;

  -- Fetch current order
  SELECT id, status, client_id, partner_id
  INTO v_order_id, v_current_status, v_client_id, v_partner_id
  FROM orders
  WHERE id = p_order_id;

  IF v_order_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'message', 'Order not found',
      'code', 'ORDER_NOT_FOUND'
    );
  END IF;

  -- ===== AUTHORIZATION CHECK =====
  -- Only these roles can update order status:
  
  -- 1. Client can cancel pending orders
  IF v_caller_role = 'client' THEN
    IF v_client_id = v_caller_id AND v_current_status = 'pending' AND p_new_status = 'cancelled' THEN
      v_can_update := TRUE;
    END IF;
  END IF;

  -- 2. Partner can accept/reject pending orders
  IF v_caller_role = 'partner' THEN
    SELECT owner_id INTO v_caller_id
    FROM partners
    WHERE id = v_partner_id;

    IF auth.uid() = v_caller_id THEN
      IF v_current_status = 'pending' AND p_new_status IN ('accepted', 'cancelled') THEN
        v_can_update := TRUE;
      END IF;
      
      -- Partner can update to 'preparing' after accepting
      IF v_current_status = 'accepted' AND p_new_status = 'preparing' THEN
        v_can_update := TRUE;
      END IF;
    END IF;
  END IF;

  -- 3. Driver can update status for assigned deliveries
  IF v_caller_role = 'driver' THEN
    IF EXISTS (
      SELECT 1 FROM deliveries
      WHERE order_id = v_order_id
        AND driver_id = v_caller_id
        AND status NOT IN ('completed', 'cancelled', 'failed')
    ) THEN
      -- Allowed transitions for driver
      IF (v_current_status = 'preparing' AND p_new_status = 'on_the_way') OR
         (v_current_status = 'on_the_way' AND p_new_status = 'delivered') OR
         (v_current_status NOT IN ('delivered', 'cancelled', 'failed') AND p_new_status = 'cancelled') THEN
        v_can_update := TRUE;
      END IF;
    END IF;
  END IF;

  -- 4. Admin can force any valid status transition
  IF v_caller_role = 'admin' THEN
    v_can_update := TRUE;
  END IF;

  IF NOT v_can_update THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'message', 'Unauthorized to update order status',
      'code', 'FORBIDDEN',
      'current_status', v_current_status,
      'requested_status', p_new_status,
      'caller_role', v_caller_role
    );
  END IF;

  -- ===== VALIDATE STATE TRANSITION =====
  -- Define valid transitions
  v_valid_transition := (
    -- From pending
    (v_current_status = 'pending' AND p_new_status IN ('accepted', 'cancelled', 'failed')) OR
    -- From accepted
    (v_current_status = 'accepted' AND p_new_status IN ('preparing', 'cancelled', 'failed')) OR
    -- From preparing
    (v_current_status = 'preparing' AND p_new_status IN ('on_the_way', 'cancelled', 'failed')) OR
    -- From on_the_way
    (v_current_status = 'on_the_way' AND p_new_status IN ('delivered', 'cancelled', 'failed')) OR
    -- From delivered (no further transitions)
    -- From cancelled (no further transitions)
    -- From failed (no further transitions)
    -- Allow idempotent requests
    (v_current_status = p_new_status)
  );

  IF NOT v_valid_transition THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'message', 'Invalid status transition',
      'code', 'INVALID_TRANSITION',
      'current_status', v_current_status,
      'requested_status', p_new_status
    );
  END IF;

  -- ===== UPDATE ORDER STATUS =====
  UPDATE orders
  SET status = p_new_status,
      updated_at = now(),
      accepted_at = CASE
        WHEN p_new_status = 'accepted' THEN now()
        ELSE accepted_at
      END,
      prepared_at = CASE
        WHEN p_new_status = 'preparing' THEN now()
        ELSE prepared_at
      END,
      dispatched_at = CASE
        WHEN p_new_status = 'on_the_way' THEN now()
        ELSE dispatched_at
      END,
      delivered_at = CASE
        WHEN p_new_status = 'delivered' THEN now()
        ELSE delivered_at
      END
  WHERE id = v_order_id;

  -- ===== AUDIT LOG =====
  INSERT INTO order_status_history (
    order_id,
    status,
    changed_by,
    note
  ) VALUES (
    v_order_id,
    p_new_status,
    v_caller_id,
    p_note
  );

  RETURN jsonb_build_object(
    'success', TRUE,
    'order_id', v_order_id,
    'status', p_new_status,
    'message', 'Order status updated successfully'
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', FALSE,
    'message', 'Database error: ' || SQLERRM,
    'code', 'UNKNOWN',
    'error_detail', SQLSTATE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- GRANT EXECUTE ON RPC TO AUTHENTICATED USERS
-- ================================================

GRANT EXECUTE ON FUNCTION update_order_status(uuid, order_status, text) TO authenticated;

-- ================================================
-- NOTES
-- ================================================
--
-- DEPLOYMENT:
-- 1. Run this migration in Supabase SQL Editor
-- 2. Test RPC with valid transitions
-- 3. Test RPC with invalid transitions (should return error)
-- 4. Verify order_status_history is populated
--
-- USAGE FROM FRONTEND:
-- const { data, error } = await supabase.rpc('update_order_status', {
--   p_order_id: '123e4567-e89b-12d3-a456-426614174000',
--   p_new_status: 'accepted',
--   p_note: 'Restaurant accepted the order'
-- });
--
-- VALID TRANSITIONS:
-- pending     -> accepted, cancelled, failed
-- accepted    -> preparing, cancelled, failed
-- preparing   -> on_the_way, cancelled, failed
-- on_the_way  -> delivered, cancelled, failed
-- delivered   -> (terminal)
-- cancelled   -> (terminal)
-- failed      -> (terminal)
--
-- ROLE PERMISSIONS:
-- client  -> Can only cancel 'pending' orders
-- partner -> Can accept/reject 'pending' and manage status flow
-- driver  -> Can update 'preparing' to 'delivered' flow
-- admin   -> Can force any transition
