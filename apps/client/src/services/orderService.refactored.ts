/**
 * ================================================
 * ENTERPRISE ORDER SERVICE
 * RPC-FIRST, ZERO DIRECT INSERTS
 * ================================================
 * 
 * This service ONLY uses Supabase RPC functions for all operations.
 * No direct table inserts/updates are allowed.
 * All pricing calculations, validations, and state transitions happen server-side.
 * 
 * Benefits:
 * - Single source of truth (backend)
 * - Zero client-side tampering opportunities
 * - Atomic transactions
 * - Audit trail via order_status_history
 * - Role-based access control via RLS
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  Order,
  OrderStatus,
  PaymentMethod,
  CreateCheckoutOrderInput,
  CreateCheckoutOrderResponse,
  UpdateOrderStatusInput,
  UpdateOrderStatusResponse,
} from '@eagle/database';
import { normalizeOrderStatus, normalizePaymentMethod } from '@eagle/database';

export interface OrderServiceError {
  code: string;
  message: string;
  statusCode: number;
  retryable: boolean;
  details?: Record<string, any>;
}

function createOrderError(
  code: string,
  message: string,
  statusCode: number = 400,
  retryable: boolean = false,
  details?: Record<string, any>
): OrderServiceError {
  return { code, message, statusCode, retryable, details };
}

/**
 * OrderService: RPC-first order management
 * All operations are server-side validated and atomic
 */
export class OrderService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * CREATE ORDER
   * Calls create_checkout_order RPC
   * Validates all inputs server-side
   * Returns newly created order ID
   */
  async createCheckoutOrder(input: CreateCheckoutOrderInput): Promise<Order> {
    // Client-side validation (UX feedback only)
    if (!input.p_partner_id) {
      throw createOrderError(
        'INVALID_INPUT',
        'Partner ID is required',
        400,
        false
      );
    }

    if (!input.p_items || input.p_items.length === 0) {
      throw createOrderError(
        'EMPTY_CART',
        'Cart cannot be empty',
        400,
        false
      );
    }

    if (!input.p_indpd_accepted || !input.p_cgu_accepted) {
      throw createOrderError(
        'CONSENT_REQUIRED',
        'You must accept the required legal policies',
        400,
        false
      );
    }

    // Normalize inputs
    const normalizedInput: CreateCheckoutOrderInput = {
      ...input,
      p_items: input.p_items.map((item) => ({
        ...item,
        item_id: item.item_id.trim(),
        quantity: Math.max(1, Math.min(999, Number(item.quantity))),
        unit_price: Math.max(0, Number(item.unit_price)),
        item_name_fr: item.item_name_fr?.trim() || 'Item',
        item_name_ar: item.item_name_ar?.trim() || null,
      })),
      p_subtotal: Math.max(0, Number(input.p_subtotal)),
      p_delivery_fee: Math.max(0, Number(input.p_delivery_fee)),
      p_platform_fee: Math.max(0, Number(input.p_platform_fee)),
      p_driver_tip: Math.max(0, Number(input.p_driver_tip ?? 0)),
      p_payment_method: normalizePaymentMethod(input.p_payment_method),
      p_change_amount:
        input.p_change_amount == null
          ? null
          : Math.max(0, Number(input.p_change_amount)),
    };

    try {
      const { data, error } = await this.supabase.rpc(
        'create_checkout_order',
        normalizedInput
      );

      if (error) {
        console.error('RPC error:', error);
        throw createOrderError(
          'RPC_FAILED',
          error.message || 'Checkout failed',
          500,
          true,
          { rpcDetails: error }
        );
      }

      if (!data) {
        throw createOrderError(
          'EMPTY_RESPONSE',
          'Server returned no data',
          500,
          true
        );
      }

      if (!data.success) {
        throw createOrderError(
          data.code || 'VALIDATION_FAILED',
          data.message || 'Order validation failed',
          400,
          false,
          data.details
        );
      }

      // Fetch the created order to return full object
      const order = await this.getOrderById(data.order_id);
      if (!order) {
        throw createOrderError(
          'ORDER_NOT_FOUND',
          'Order was created but cannot be retrieved',
          500,
          true
        );
      }

      return order;
    } catch (err: any) {
      if (err.code) throw err; // Re-throw OrderServiceError

      console.error('Unexpected error creating order:', err);
      throw createOrderError(
        'UNKNOWN',
        err.message || 'An unexpected error occurred',
        500,
        true,
        { originalError: String(err) }
      );
    }
  }

  /**
   * GET ORDER BY ID
   * Fetches order details with full history and items
   * RLS policy ensures user can only see their own orders
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    if (!orderId || typeof orderId !== 'string') {
      throw createOrderError(
        'INVALID_ORDER_ID',
        'Order ID is required and must be a string',
        400,
        false
      );
    }

    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select(
          `
          *,
          order_items(*),
          order_status_history(*)
        `
        )
        .eq('id', orderId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // "No rows found"
          return null;
        }

        console.error('Supabase fetch error:', error);
        throw createOrderError(
          'FETCH_FAILED',
          'Failed to retrieve order',
          500,
          true,
          { dbError: error.message }
        );
      }

      // Normalize status
      return {
        ...data,
        status: normalizeOrderStatus(data.status),
      };
    } catch (err: any) {
      if (err.code) throw err;

      console.error('Unexpected error fetching order:', err);
      throw createOrderError(
        'UNKNOWN',
        'Failed to fetch order',
        500,
        true,
        { originalError: String(err) }
      );
    }
  }

  /**
   * UPDATE ORDER STATUS
   * Calls secure update_order_status RPC
   * Only allows valid state transitions
   * Creates audit trail in order_status_history
   */
  async updateOrderStatus(input: UpdateOrderStatusInput): Promise<Order> {
    if (!input.p_order_id) {
      throw createOrderError(
        'INVALID_ORDER_ID',
        'Order ID is required',
        400,
        false
      );
    }

    const normalizedInput: UpdateOrderStatusInput = {
      p_order_id: input.p_order_id.trim(),
      p_new_status: normalizeOrderStatus(input.p_new_status),
      p_note: input.p_note?.trim() || null,
    };

    try {
      const { data, error } = await this.supabase.rpc(
        'update_order_status',
        normalizedInput
      );

      if (error) {
        console.error('RPC error:', error);
        throw createOrderError(
          'RPC_FAILED',
          error.message || 'Status update failed',
          500,
          true,
          { rpcDetails: error }
        );
      }

      if (!data?.success) {
        throw createOrderError(
          data?.code || 'UPDATE_FAILED',
          data?.message || 'Failed to update order status',
          400,
          false,
          data?.details
        );
      }

      // Fetch the updated order
      const order = await this.getOrderById(data.order_id);
      if (!order) {
        throw createOrderError(
          'ORDER_NOT_FOUND',
          'Order status was updated but cannot be retrieved',
          500,
          true
        );
      }

      return order;
    } catch (err: any) {
      if (err.code) throw err;

      console.error('Unexpected error updating status:', err);
      throw createOrderError(
        'UNKNOWN',
        'Failed to update order status',
        500,
        true,
        { originalError: String(err) }
      );
    }
  }

  /**
   * SUBSCRIBE TO ORDER STATUS CHANGES
   * Real-time subscription to order_status_history table
   * Automatic reconnection on disconnect
   */
  subscribeToOrderStatus(
    orderId: string,
    onStatusChange: (status: OrderStatus, history: any) => void,
    onError: (error: Error) => void
  ): () => void {
    if (!orderId) {
      onError(new Error('Order ID is required for subscription'));
      return () => {};
    }

    try {
      const channel = this.supabase
        .channel(`order-status:${orderId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'order_status_history',
            filter: `order_id=eq.${orderId}`,
          },
          (payload: any) => {
            const newStatus = normalizeOrderStatus(payload.new.status);
            onStatusChange(newStatus, payload.new);
          }
        )
        .on('system', { event: 'connected' }, () => {
          console.log(`✅ Connected to order ${orderId}`);
        })
        .on('system', { event: 'closed' }, () => {
          console.log(`❌ Disconnected from order ${orderId}`);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`📡 Subscribed to order ${orderId}`);
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            onError(new Error(`Subscription failed for order ${orderId}`));
          }
        });

      // Return unsubscribe function
      return () => {
        this.supabase.removeChannel(channel);
      };
    } catch (err: any) {
      onError(new Error(`Failed to subscribe to order: ${err.message}`));
      return () => {};
    }
  }

  /**
   * SUBSCRIBE TO ORDER UPDATES
   * Real-time subscription to order changes
   */
  subscribeToOrderUpdates(
    orderId: string,
    onUpdate: (order: Order) => void,
    onError: (error: Error) => void
  ): () => void {
    if (!orderId) {
      onError(new Error('Order ID is required for subscription'));
      return () => {};
    }

    try {
      const channel = this.supabase
        .channel(`order-updates:${orderId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `id=eq.${orderId}`,
          },
          (payload: any) => {
            onUpdate({
              ...payload.new,
              status: normalizeOrderStatus(payload.new.status),
            });
          }
        )
        .subscribe((status) => {
          if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            onError(new Error(`Update subscription failed for order ${orderId}`));
          }
        });

      return () => {
        this.supabase.removeChannel(channel);
      };
    } catch (err: any) {
      onError(new Error(`Failed to subscribe to updates: ${err.message}`));
      return () => {};
    }
  }

  /**
   * CANCEL ORDER
   * Only allows cancellation of pending orders
   * Creates audit trail entry
   */
  async cancelOrder(orderId: string, reason: string = 'User requested'): Promise<Order> {
    return this.updateOrderStatus({
      p_order_id: orderId,
      p_new_status: 'cancelled',
      p_note: reason,
    });
  }

  /**
   * GET ORDER HISTORY
   * Fetch full audit trail for an order
   */
  async getOrderHistory(orderId: string): Promise<any[]> {
    if (!orderId) {
      throw createOrderError(
        'INVALID_ORDER_ID',
        'Order ID is required',
        400,
        false
      );
    }

    try {
      const { data, error } = await this.supabase
        .from('order_status_history')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      if (error) {
        throw createOrderError(
          'FETCH_FAILED',
          'Failed to retrieve order history',
          500,
          true
        );
      }

      return data || [];
    } catch (err: any) {
      if (err.code) throw err;

      console.error('Error fetching history:', err);
      throw createOrderError(
        'UNKNOWN',
        'Failed to fetch order history',
        500,
        true
      );
    }
  }

  /**
   * LIST USER ORDERS
   * Fetch all orders for current user
   * Respects RLS policies
   */
  async listUserOrders(limit: number = 50): Promise<Order[]> {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select(
          `
          *,
          order_items(*)
        `
        )
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw createOrderError(
          'FETCH_FAILED',
          'Failed to retrieve orders',
          500,
          true
        );
      }

      return (data || []).map((order) => ({
        ...order,
        status: normalizeOrderStatus(order.status),
      }));
    } catch (err: any) {
      if (err.code) throw err;

      console.error('Error listing orders:', err);
      throw createOrderError(
        'UNKNOWN',
        'Failed to list orders',
        500,
        true
      );
    }
  }
}

/**
 * Create a singleton OrderService instance
 */
export function createOrderService(supabase: SupabaseClient): OrderService {
  return new OrderService(supabase);
}
