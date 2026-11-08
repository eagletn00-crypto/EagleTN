-- دالة ذرية لإنشاء الطلب وعناصره في حزمة واحدة (Atomic Transaction)
CREATE OR REPLACE FUNCTION create_order_with_items(
    p_partner_id UUID,
    p_customer_name TEXT,
    p_delivery_address TEXT,
    p_total_amount NUMERIC,
    p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order_id UUID;
    v_item JSONB;
BEGIN
    -- 1. إدراج الطلب في جدول orders
    INSERT INTO public.orders (
        partner_id,
        customer_name,
        delivery_address,
        status,
        total_amount
    )
    VALUES (
        p_partner_id,
        p_customer_name,
        p_delivery_address,
        'pending',
        p_total_amount
    )
    RETURNING id INTO v_order_id;

    -- 2. إدراج كافة الأطباق والعناصر في جدول order_items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        INSERT INTO public.order_items (
            order_id,
            item_name,
            quantity,
            unit_price
        )
        VALUES (
            v_order_id,
            v_item->>'item_name',
            (v_item->>'quantity')::INT,
            (v_item->>'unit_price')::NUMERIC
        );
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id
    );

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'فشلت عملية إنشاء الطلب: %', SQLERRM;
END;
$$;
