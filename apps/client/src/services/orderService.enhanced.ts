/**
 * ================================================
 * ENTERPRISE ORDER SERVICE
 * Type-safe, zero-compromise checkout & order management
 * ================================================
 * - Server-side price verification
 * - RLS policy compliance
 * - Comprehensive error handling
 * - Realtime subscription support
 */

import { SupabaseClient } from '@supabase/supabase-js';
import {
  DatabaseOrder,
  DatabaseOrderItem,
  DatabaseOrderStatusHistory,
  OrderStatus,
  CreateCheckoutOrderInput,
  CreateCheckoutOrderResponse,
  OrderDetailUI,
  PromoCodeValidation,
  PaymentMethod,
  OrderErrorCodes,
  OrderServiceError,
  OrderItemForCheckout,
  CartItemState,
} from '../types/database';
import {
  validateCheckoutOrder,
  OrderValidationError,
  createValidationError,
  calculateLineTotal,
  comparePrices,
  VALIDATION_CONFIG,
} from './orderValidation';

// ============ ORDER SERVICE CLASS ============

export class OrderService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * ENTERPRISE CHECKOUT
   * Creates order with full validation & server-side verification
   * 
   * SECURITY GUARANTEES:
   * 1. All prices recalculated & verified server-side in RPC
   * 2. Promo codes applied only via RPC
   * 3. RLS prevents order tampering
   * 4. Atomic transaction (order + items created together)
   * 5. Legal consent verification
   */
  async createCheckoutOrder(
    input: CreateCheckoutOrderInput
  ): Promise<{ data: CreateCheckoutOrderResponse; error: null } | { data: null; error: OrderServiceError }> {
    try {
      // ===== STEP 1: COMPREHENSIVE CLIENT-SIDE VALIDATION =====
      const validation = validateCheckoutOrder(input);
      if (!validation.valid) {
        const error = createValidationError(
          'Checkout validation failed',
          OrderErrorCodes.UNKNOWN,
          422,
          { errors: validation.errors }
        );
        return { data: null, error };
      }

      // ===== STEP 2: GET AUTHENTICATED USER (if applicable) =====
      const { data: { user }, error: authError } = await this.supabase.auth.getUser();
      if (authError && input.p_client_id) {
        // If they tried to provide client_id but we can't verify
        console.warn('Auth error but client_id provided:', authError);
      }

      // ===== STEP 3: CALL SERVER-SIDE RPC FUNCTION =====
      // This RPC handles:
      // - Final price verification (prevents tampering)
      // - Promo code validation & discount application
      // - Partner validation (exists & accepts orders)
      // - Item existence & availability check
      // - Atomic order + order_items creation
      // - RLS enforcement
      const { data: rpcResponse, error: rpcError } = await this.supabase.rpc(
        'create_checkout_order',
        {
          p_client_id: user?.id || input.p_client_id || null,
          p_partner_id: input.p_partner_id,
          p_client_name: input.p_client_name.trim(),
          p_client_phone: input.p_client_phone.trim(),
          p_delivery_address: input.p_delivery_address.trim(),
          p_delivery_latitude: input.p_delivery_latitude || null,
          p_delivery_longitude: input.p_delivery_longitude || null,
          p_items: input.p_items,
          p_subtotal: input.p_subtotal,
          p_delivery_fee: input.p_delivery_fee,
          p_platform_fee: input.p_platform_fee,
          p_driver_tip: input.p_driver_tip || 0,
          p_promo_code: input.p_promo_code?.trim() || null,
          p_payment_method: input.p_payment_method,
          p_change_amount: input.p_change_amount || null,
          p_kitchen_note: input.p_kitchen_note?.trim() || '',
          p_driver_note: input.p_driver_note?.trim() || '',
          p_indpd_accepted: input.p_indpd_accepted,
          p_cgu_accepted: input.p_cgu_accepted,
        } as any
      );

      // ===== STEP 4: HANDLE RPC ERRORS =====
      if (rpcError) {
        console.error('Checkout RPC error:', rpcError);
        
        // Map common RPC errors to business logic errors
        const error = this.mapRpcErrorToServiceError(rpcError);
        return { data: null, error };
      }

      // ===== STEP 5: VALIDATE RPC RESPONSE =====
      if (!rpcResponse || typeof rpcResponse !== 'object') {
        const error = createValidationError(
          'Invalid RPC response',
          OrderErrorCodes.UNKNOWN,
          500
        );
        return { data: null, error };
      }

      // Cast to expected response type
      const response: CreateCheckoutOrderResponse = rpcResponse as CreateCheckoutOrderResponse;

      if (!response.success) {
        const error = createValidationError(
          response.message || 'Order creation failed',
          OrderErrorCodes.UNKNOWN,
          400,
          { validation_errors: response.validation_errors }
        );
        return { data: null, error };
      }

      if (!response.order_id) {
        const error = createValidationError(
          'No order ID returned',
          OrderErrorCodes.UNKNOWN,
          500
        );
        return { data: null, error };
      }

      return { data: response, error: null };

    } catch (err: any) {
      console.error('Unexpected error in createCheckoutOrder:', err);
      const error = createValidationError(
        err?.message || 'Unexpected error during checkout',
        OrderErrorCodes.UNKNOWN,
        500,
        { raw_error: err?.toString?.() }
      );
      return { data: null, error };
    }
  }

  /**
   * Fetch order details with all related items
   * Respects RLS: users can only see their own orders
   */
  async getOrderDetails(orderId: string): Promise<{
    data: OrderDetailUI | null;
    error: OrderServiceError | null;
  }> {
    try {
      // Fetch order
      const { data: order, error: orderError } = await this.supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .maybeSingle();

      if (orderError) {
        const error = createValidationError(
          orderError.message,
          OrderErrorCodes.UNKNOWN,
          400
        );
        return { data: null, error };
      }

      if (!order) {
        const error = createValidationError(
          'Order not found',
          OrderErrorCodes.UNKNOWN,
          404
        );
        return { data: null, error };
      }

      // Fetch order items
      const { data: items, error: itemsError } = await this.supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (itemsError) {
        console.warn('Error fetching order items:', itemsError);
        // Don't fail - return order without items
      }

      return {
        data: {
          ...order,
          items: items || [],
        } as OrderDetailUI,
        error: null,
      };

    } catch (err: any) {
      const error = createValidationError(
        err?.message || 'Error fetching order details',
        OrderErrorCodes.UNKNOWN,
        500
      );
      return { data: null, error };
    }
  }

  /**
   * Stream order status changes in real-time
   * Returns unsubscribe function
   * 
   * STATUS FLOW: pending → accepted → preparing → on_the_way → delivered
   */
  subscribeToOrderStatus(
    orderId: string,
    onStatusChange: (status: OrderStatus, history: DatabaseOrderStatusHistory) => void,
    onError?: (error: Error) => void
  ): () => void {
    const subscription = this.supabase
      .channel(`order:${orderId}:status`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_status_history',
          filter: `order_id=eq.${orderId}`,
        },
        (payload: any) => {
          try {
            const history: DatabaseOrderStatusHistory = payload.new;
            onStatusChange(history.status, history);
          } catch (err: any) {
            console.error('Error processing status update:', err);
            onError?.(err);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIPTION_FAILED') {
          onError?.(new Error('Failed to subscribe to order updates'));
        }
      });

    // Return unsubscribe function
    return () => {
      this.supabase.removeChannel(subscription);
    };
  }

  /**
   * Stream order details changes (for live address updates, etc)
   */
  subscribeToOrderUpdates(
    orderId: string,
    onUpdate: (order: DatabaseOrder) => void,
    onError?: (error: Error) => void
  ): () => void {
    const subscription = this.supabase
      .channel(`order:${orderId}:updates`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload: any) => {
          try {
            const order: DatabaseOrder = payload.new;
            onUpdate(order);
          } catch (err: any) {
            console.error('Error processing order update:', err);
            onError?.(err);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIPTION_FAILED') {
          onError?.(new Error('Failed to subscribe to order updates'));
        }
      });

    return () => {
      this.supabase.removeChannel(subscription);
    };
  }

  /**
   * Validate promo code and calculate discount
   * SECURITY: Must be done server-side for real promo codes
   * This is just a preview function
   */
  async validatePromoCode(code: string): Promise<{
    data: PromoCodeValidation | null;
    error: OrderServiceError | null;
  }> {
    try {
      if (!code || code.trim().length === 0) {
        return { data: null, error: null }; // No code provided is OK
      }

      // Call RPC to validate promo code server-side
      const { data: validation, error } = await this.supabase.rpc(
        'validate_promo_code',
        { p_code: code.trim().toUpperCase() }
      );

      if (error) {
        return { data: null, error: createValidationError(error.message, OrderErrorCodes.UNKNOWN) };
      }

      return { data: validation as PromoCodeValidation, error: null };

    } catch (err: any) {
      const error = createValidationError(
        err?.message || 'Error validating promo code',
        OrderErrorCodes.UNKNOWN
      );
      return { data: null, error };
    }
  }

  /**
   * Cancel order (only valid for pending status)
   * Authorization handled by RLS
   */
  async cancelOrder(orderId: string, reason?: string): Promise<{
    data: DatabaseOrder | null;
    error: OrderServiceError | null;
  }> {
    try {
      const { data: order, error } = await this.supabase
        .from('orders')
        .update({
          status: OrderStatus.CANCELLED,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .eq('status', OrderStatus.PENDING)
        .select()
        .maybeSingle();

      if (error) {
        return { data: null, error: createValidationError(error.message, OrderErrorCodes.UNKNOWN) };
      }

      if (!order) {
        const error = createValidationError(
          'Order not found or cannot be cancelled',
          OrderErrorCodes.UNKNOWN,
          404
        );
        return { data: null, error };
      }

      return { data: order, error: null };

    } catch (err: any) {
      const error = createValidationError(
        err?.message || 'Error cancelling order',
        OrderErrorCodes.UNKNOWN
      );
      return { data: null, error };
    }
  }

  /**
   * Get user's order history
   * Respects RLS: each user only sees their own orders
   */
  async getUserOrders(limit: number = 20, offset: number = 0): Promise<{
    data: DatabaseOrder[] | null;
    error: OrderServiceError | null;
  }> {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        return { data: null, error: createValidationError(error.message, OrderErrorCodes.UNKNOWN) };
      }

      return { data: data || [], error: null };

    } catch (err: any) {
      const error = createValidationError(
        err?.message || 'Error fetching order history',
        OrderErrorCodes.UNKNOWN
      );
      return { data: null, error };
    }
  }

  // ===== PRIVATE HELPER METHODS =====

  /**
   * Map Supabase/RPC errors to business logic errors
   * Provides better error messages for users
   */
  private mapRpcErrorToServiceError(rpcError: any): OrderServiceError {
    const message = rpcError?.message || 'Server error';

    if (message.includes('partner') || message.includes('restaurant')) {
      return createValidationError(
        'Restaurant not found or not accepting orders',
        OrderErrorCodes.INVALID_PARTNER,
        400
      );
    }

    if (message.includes('item') || message.includes('menu')) {
      return createValidationError(
        'One or more items are no longer available',
        OrderErrorCodes.INVALID_ITEM,
        400
      );
    }

    if (message.includes('stock') || message.includes('available')) {
      return createValidationError(
        'One or more items are out of stock',
        OrderErrorCodes.OUT_OF_STOCK,
        400
      );
    }

    if (message.includes('price') || message.includes('mismatch')) {
      return createValidationError(
        'Price verification failed. Please refresh and try again.',
        OrderErrorCodes.PRICE_MISMATCH,
        400
      );
    }

    if (message.includes('promo') || message.includes('discount')) {
      return createValidationError(
        'Invalid or expired promo code',
        OrderErrorCodes.INVALID_PROMO,
        400
      );
    }

    if (message.includes('minimum')) {
      return createValidationError(
        `Minimum order amount not met`,
        OrderErrorCodes.MINIMUM_ORDER_NOT_MET,
        400
      );
    }

    if (message.includes('delivery') || message.includes('area')) {
      return createValidationError(
        'Delivery not available for this address',
        OrderErrorCodes.DELIVERY_AREA_NOT_COVERED,
        400
      );
    }

    if (message.includes('rate') || message.includes('limit')) {
      return createValidationError(
        'Too many requests. Please wait a moment and try again.',
        OrderErrorCodes.RATE_LIMIT_EXCEEDED,
        429,
        { retryAfter: 60 }
      );
    }

    if (message.includes('auth') || message.includes('permission')) {
      return createValidationError(
        'Authentication required',
        OrderErrorCodes.AUTHENTICATION_REQUIRED,
        401
      );
    }

    return createValidationError(
      message,
      OrderErrorCodes.UNKNOWN,
      500
    );
  }
}

/**
 * Factory function to create service instance
 */
export function createOrderService(supabaseClient: SupabaseClient): OrderService {
  return new OrderService(supabaseClient);
}
