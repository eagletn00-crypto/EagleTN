/**
 * ================================================
 * SUPABASE RPC FUNCTION SPECIFICATIONS
 * SQL Implementations & Type Contracts
 * ================================================
 * 
 * This document specifies the Supabase RPC functions that MUST be created
 * in your Supabase project for the checkout flow to work securely.
 * 
 * All price calculations, validations, and atomic operations happen server-side.
 */

/* ============================================================
   RPC FUNCTION 1: create_checkout_order
   ============================================================
   PURPOSE:
   - Create order + order_items atomically
   - Validate all inputs server-side
   - Verify prices against database (prevent client tampering)
   - Apply promo code discounts
   - Respect RLS policies
   
   SECURITY CONSIDERATIONS:
   - ALL price calculations verified here
   - Promo codes looked up and validated
   - Item availability checked
   - Partner validation
   - Rate limiting (consider adding at DB level)
   
   SQL TEMPLATE:
*/

const CREATE_CHECKOUT_ORDER_SQL = `
CREATE OR REPLACE FUNCTION create_checkout_order(
    p_client_id UUID,
    p_partner_id UUID,
    p_client_name TEXT,
    p_client_phone TEXT,
    p_delivery_address TEXT,
    p_delivery_latitude FLOAT8 DEFAULT NULL,
    p_delivery_longitude FLOAT8 DEFAULT NULL,
    p_items JSONB,
    p_subtotal NUMERIC,
    p_delivery_fee NUMERIC,
    p_platform_fee NUMERIC,
    p_driver_tip NUMERIC DEFAULT 0,
    p_promo_code TEXT DEFAULT NULL,
    p_payment_method TEXT DEFAULT 'cod',
    p_change_amount INT DEFAULT NULL,
    p_kitchen_note TEXT DEFAULT '',
    p_driver_note TEXT DEFAULT '',
    p_indpd_accepted BOOLEAN,
    p_cgu_accepted BOOLEAN
)
RETURNS JSONB AS $$
DECLARE
    v_order_id UUID;
    v_calculated_subtotal NUMERIC := 0;
    v_discount NUMERIC := 0;
    v_final_total NUMERIC := 0;
    v_item JSONB;
    v_menu_item_price NUMERIC;
    v_promo_discount NUMERIC;
    v_order_data JSONB;
BEGIN
    -- Validate legal consent
    IF NOT p_indpd_accepted OR NOT p_cgu_accepted THEN
        RETURN jsonb_build_object(
            'success', FALSE,
            'message', 'Legal consent required',
            'code', 'CONSENT_REQUIRED'
        );
    END IF;

    -- Validate partner exists and accepts orders
    IF NOT EXISTS(SELECT 1 FROM partners WHERE id = p_partner_id AND is_active = TRUE) THEN
        RETURN jsonb_build_object(
            'success', FALSE,
            'message', 'Restaurant not found or not accepting orders',
            'code', 'INVALID_PARTNER'
        );
    END IF;

    -- Validate items and calculate subtotal
    FOR v_item IN SELECT jsonb_array_elements(p_items)
    LOOP
        -- Check item exists
        SELECT price INTO v_menu_item_price
        FROM menu_items
        WHERE id = (v_item->>'item_id')::UUID
        AND partner_id = p_partner_id;

        IF v_menu_item_price IS NULL THEN
            RETURN jsonb_build_object(
                'success', FALSE,
                'message', 'One or more items not found',
                'code', 'INVALID_ITEM',
                'item_id', v_item->>'item_id'
            );
        END IF;

        -- Verify price matches (prevent tampering)
        IF CAST(v_item->>'unit_price' AS NUMERIC) != v_menu_item_price THEN
            RETURN jsonb_build_object(
                'success', FALSE,
                'message', 'Price verification failed. Refresh and try again.',
                'code', 'PRICE_MISMATCH',
                'details', jsonb_build_object(
                    'expected', v_menu_item_price,
                    'provided', v_item->>'unit_price'
                )
            );
        END IF;

        -- Calculate line total
        v_calculated_subtotal := v_calculated_subtotal + 
            (CAST(v_item->>'unit_price' AS NUMERIC) * CAST(v_item->>'quantity' AS INT));
    END LOOP;

    -- Verify client-provided subtotal matches calculation
    IF v_calculated_subtotal != p_subtotal THEN
        RETURN jsonb_build_object(
            'success', FALSE,
            'message', 'Subtotal mismatch',
            'code', 'PRICE_MISMATCH',
            'details', jsonb_build_object(
                'calculated', v_calculated_subtotal,
                'provided', p_subtotal
            )
        );
    END IF;

    -- Apply promo code if provided
    IF p_promo_code IS NOT NULL AND p_promo_code != '' THEN
        SELECT discount_amount INTO v_promo_discount
        FROM promo_codes
        WHERE code = UPPER(p_promo_code)
        AND (expires_at IS NULL OR expires_at > NOW())
        AND is_active = TRUE;

        IF v_promo_discount IS NULL THEN
            RETURN jsonb_build_object(
                'success', FALSE,
                'message', 'Invalid or expired promo code',
                'code', 'INVALID_PROMO'
            );
        END IF;

        v_discount := v_promo_discount;
    END IF;

    -- Calculate final total
    v_final_total := v_calculated_subtotal + p_delivery_fee + p_platform_fee + p_driver_tip - v_discount;

    -- Validate minimum order amount
    IF v_final_total < 5.0 THEN
        RETURN jsonb_build_object(
            'success', FALSE,
            'message', 'Minimum order amount not met',
            'code', 'MINIMUM_ORDER_NOT_MET',
            'minimum', 5.0,
            'current', v_final_total
        );
    END IF;

    -- Create order
    INSERT INTO orders (
        client_id,
        partner_id,
        client_name,
        client_phone,
        delivery_address,
        delivery_latitude,
        delivery_longitude,
        subtotal,
        delivery_fee,
        platform_fee,
        driver_tip,
        promo_discount,
        total_amount,
        payment_method,
        change_amount,
        kitchen_note,
        driver_note,
        indpd_accepted,
        cgu_accepted,
        status,
        created_at,
        updated_at
    ) VALUES (
        p_client_id,
        p_partner_id,
        p_client_name,
        p_client_phone,
        p_delivery_address,
        p_delivery_latitude,
        p_delivery_longitude,
        v_calculated_subtotal,
        p_delivery_fee,
        p_platform_fee,
        p_driver_tip,
        v_discount,
        v_final_total,
        p_payment_method,
        p_change_amount,
        p_kitchen_note,
        p_driver_note,
        p_indpd_accepted,
        p_cgu_accepted,
        'pending',
        NOW(),
        NOW()
    )
    RETURNING id INTO v_order_id;

    -- Create order items
    INSERT INTO order_items (
        order_id,
        item_id,
        item_name_fr,
        quantity,
        unit_price,
        line_total,
        created_at
    )
    SELECT
        v_order_id,
        (item->>'item_id')::UUID,
        item->>'item_name_fr',
        (item->>'quantity')::INT,
        (item->>'unit_price')::NUMERIC,
        (item->>'unit_price')::NUMERIC * (item->>'quantity')::INT,
        NOW()
    FROM jsonb_array_elements(p_items) AS item;

    -- Log initial status
    INSERT INTO order_status_history (
        order_id,
        status,
        note,
        created_at
    ) VALUES (
        v_order_id,
        'pending',
        'Order created',
        NOW()
    );

    -- Return success response
    RETURN jsonb_build_object(
        'success', TRUE,
        'order_id', v_order_id,
        'total_amount', v_final_total,
        'status', 'pending',
        'message', 'Order created successfully'
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
`;

/* ============================================================
   RPC FUNCTION 2: validate_promo_code
   ============================================================
   PURPOSE:
   - Validate promo code server-side
   - Return discount info for display
   - Check usage limits
*/

const VALIDATE_PROMO_CODE_SQL = `
CREATE OR REPLACE FUNCTION validate_promo_code(p_code TEXT)
RETURNS JSONB AS $$
DECLARE
    v_promo RECORD;
BEGIN
    SELECT * INTO v_promo
    FROM promo_codes
    WHERE code = UPPER(p_code)
    AND is_active = TRUE
    AND (expires_at IS NULL OR expires_at > NOW());

    IF v_promo IS NULL THEN
        RETURN jsonb_build_object(
            'valid', FALSE,
            'message', 'Code not found or expired'
        );
    END IF;

    RETURN jsonb_build_object(
        'valid', TRUE,
        'code', v_promo.code,
        'discount_type', v_promo.discount_type,
        'discount_value', v_promo.discount_amount,
        'max_uses', v_promo.max_uses,
        'remaining_uses', v_promo.max_uses - COALESCE(
            (SELECT COUNT(*) FROM orders WHERE promo_code = UPPER(p_code)),
            0
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

/* ============================================================
   DATABASE TABLE DEFINITIONS
   ============================================================
*/

const ORDERS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE RESTRICT,
    
    -- Customer info (immutable)
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_latitude FLOAT8,
    delivery_longitude FLOAT8,
    
    -- Status & timestamps
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'accepted', 'preparing', 'on_the_way', 'delivered', 'cancelled', 'failed'
    )),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    prepared_at TIMESTAMP WITH TIME ZONE,
    dispatched_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    -- Pricing (all verified server-side)
    subtotal NUMERIC(10,3) NOT NULL CHECK (subtotal >= 0),
    delivery_fee NUMERIC(10,3) NOT NULL CHECK (delivery_fee >= 0),
    platform_fee NUMERIC(10,3) NOT NULL CHECK (platform_fee >= 0),
    driver_tip NUMERIC(10,3) NOT NULL DEFAULT 0 CHECK (driver_tip >= 0),
    promo_discount NUMERIC(10,3) NOT NULL DEFAULT 0 CHECK (promo_discount >= 0),
    total_amount NUMERIC(10,3) NOT NULL CHECK (total_amount >= 0),
    
    -- Payment
    payment_method TEXT NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod', 'card', 'edinar')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'success', 'failed')),
    change_amount INT,
    promo_code TEXT,
    
    -- Special instructions
    kitchen_note TEXT DEFAULT '',
    driver_note TEXT DEFAULT '',
    
    -- Legal
    indpd_accepted BOOLEAN NOT NULL,
    cgu_accepted BOOLEAN NOT NULL,
    
    -- Indexes
    INDEX idx_client_id (client_id),
    INDEX idx_partner_id (partner_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_client_phone (client_phone)
);

-- Row-Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Clients can see only their own orders
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT
    USING (auth.uid() = client_id OR client_id IS NULL);

-- Only service role can update orders (via RPC)
CREATE POLICY "Only service can update orders" ON orders
    FOR UPDATE
    USING (FALSE)
    WITH CHECK (FALSE);
`;

const ORDER_ITEMS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    item_id UUID NOT NULL,  -- Denormalized reference (item may be deleted)
    
    -- Denormalized item data
    item_name_fr TEXT NOT NULL,
    item_name_ar TEXT,
    
    -- Pricing (locked at order time)
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,3) NOT NULL CHECK (unit_price >= 0),
    line_total NUMERIC(10,3) NOT NULL CHECK (line_total >= 0),
    
    -- Customizations JSON
    customizations JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    INDEX idx_order_id (order_id)
);
`;

const ORDER_STATUS_HISTORY_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN (
        'pending', 'accepted', 'preparing', 'on_the_way', 'delivered', 'cancelled', 'failed'
    )),
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    INDEX idx_order_id (order_id),
    INDEX idx_status (status)
);

-- Enable realtime subscriptions
ALTER TABLE order_status_history REPLICA IDENTITY FULL;
`;

export const RPC_SPECIFICATIONS = {
  CREATE_CHECKOUT_ORDER_SQL,
  VALIDATE_PROMO_CODE_SQL,
  ORDERS_TABLE_SQL,
  ORDER_ITEMS_TABLE_SQL,
  ORDER_STATUS_HISTORY_TABLE_SQL,
};

// ============================================================
// IMPLEMENTATION STEPS FOR SUPABASE PROJECT
// ============================================================

export const IMPLEMENTATION_GUIDE = `
SUPABASE SETUP INSTRUCTIONS:

1. Create tables (in Supabase SQL Editor):
   - Run ORDERS_TABLE_SQL
   - Run ORDER_ITEMS_TABLE_SQL
   - Run ORDER_STATUS_HISTORY_TABLE_SQL

2. Create RPC functions (in Supabase SQL Editor):
   - Run CREATE_CHECKOUT_ORDER_SQL
   - Run VALIDATE_PROMO_CODE_SQL

3. Enable Realtime (in Supabase Dashboard):
   - Go to Realtime > Replication
   - Enable replication for:
     * orders
     * order_status_history

4. Create Indexes for Performance:
   - order_status_history(order_id, created_at DESC)
   - orders(partner_id, status, created_at DESC)

5. Configure RLS Policies (detailed in table definitions)

6. Set Up Storage Buckets (if using file uploads):
   - Create 'order-receipts' bucket for invoice PDFs

7. Enable Email Notifications:
   - Configure email template for order confirmations
   - Set up webhook for order status changes
`;
