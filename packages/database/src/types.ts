/**
 * ================================================
 * CANONICAL ENTERPRISE TYPES
 * Single source of truth for the entire 4-party ecosystem
 * ================================================
 * 
 * This file MUST be imported by all 4 apps (Client, Livreur, Partner, Admin)
 * to ensure zero schema drift and unified domain language.
 * 
 * Import with:
 *   import type { OrderStatus, PaymentMethod, ... } from '@eagle/database';
 */

// ============ ORDER STATUS ENUM ============
/**
 * CANONICAL order status flow
 * Enforced across Client, Partner, Livreur, and Admin apps
 * 
 * Flow: pending → accepted → preparing → on_the_way → delivered
 */
export type OrderStatus =
  | 'pending'        // ⏳ Order created, awaiting partner acceptance
  | 'accepted'       // ✅ Partner accepted the order
  | 'preparing'      // 🍳 Food is being prepared in kitchen
  | 'on_the_way'     // 🛵 Order is out for delivery
  | 'delivered'      // 🎉 Successfully delivered
  | 'cancelled'      // ❌ Order was cancelled
  | 'failed';        // ⚠️ Payment or delivery failure

export const OrderStatusValues = [
  'pending',
  'accepted',
  'preparing',
  'on_the_way',
  'delivered',
  'cancelled',
  'failed',
] as const;

// ============ PAYMENT METHOD ENUM ============
export type PaymentMethod = 'cod' | 'card' | 'edinar';

export const PaymentMethodValues = ['cod', 'card', 'edinar'] as const;

// ============ PAYMENT STATUS ENUM ============
export type PaymentStatus = 'pending' | 'success' | 'failed';

export const PaymentStatusValues = ['pending', 'success', 'failed'] as const;

// ============ USER ROLE ENUM ============
export type UserRole = 'client' | 'partner' | 'driver' | 'admin';

export const UserRoleValues = ['client', 'partner', 'driver', 'admin'] as const;

// ============ DELIVERY STATUS ENUM ============
/**
 * Delivery-specific status for driver operations
 * Aligned with order status but from driver perspective
 */
export type DeliveryStatus =
  | 'assigned'       // Driver assigned to order
  | 'accepted'       // Driver accepted delivery
  | 'picked_up'      // Food picked up from restaurant
  | 'in_transit'     // On the way to customer
  | 'arrived'        // Arrived at destination
  | 'completed'      // Successfully delivered
  | 'cancelled'      // Delivery cancelled
  | 'failed';        // Delivery failed

export const DeliveryStatusValues = [
  'assigned',
  'accepted',
  'picked_up',
  'in_transit',
  'arrived',
  'completed',
  'cancelled',
  'failed',
] as const;

// ============ STATUS MAPPER ============
/**
 * Map delivery status to order status
 * Used when driver updates status to propagate to order
 */
export const DeliveryToOrderStatusMap: Record<DeliveryStatus, OrderStatus> = {
  assigned: 'pending',
  accepted: 'accepted',
  picked_up: 'preparing',
  in_transit: 'on_the_way',
  arrived: 'on_the_way',
  completed: 'delivered',
  cancelled: 'cancelled',
  failed: 'failed',
};

// ============ STATUS NORMALIZER ============
/**
 * Normalize any variant of status string to canonical lowercase
 * Handles uppercase, snake_case variants, etc.
 */
export function normalizeOrderStatus(value: string | null | undefined): OrderStatus {
  const normalized = String(value ?? '').toLowerCase().trim();

  const statusMap: Record<string, OrderStatus> = {
    // Canonical lowercase
    pending: 'pending',
    accepted: 'accepted',
    preparing: 'preparing',
    on_the_way: 'on_the_way',
    delivered: 'delivered',
    cancelled: 'cancelled',
    failed: 'failed',
    // Uppercase variants
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    PREPARING: 'preparing',
    ON_THE_WAY: 'on_the_way',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    FAILED: 'failed',
    // Alternate driver spellings
    EN_ROUTE: 'on_the_way',
    IN_TRANSIT: 'on_the_way',
    // Payment status (should not appear here, but just in case)
    PAID: 'delivered',
    SUCCESS: 'delivered',
  };

  return statusMap[normalized] ?? 'pending';
}

export function normalizePaymentMethod(value: string | null | undefined): PaymentMethod {
  const normalized = String(value ?? '').toLowerCase().trim();

  const methodMap: Record<string, PaymentMethod> = {
    cod: 'cod',
    card: 'card',
    edinar: 'edinar',
    COD: 'cod',
    CARD: 'card',
    EDINAR: 'edinar',
    'cash_on_delivery': 'cod',
    'payment_card': 'card',
  };

  return methodMap[normalized] ?? 'cod';
}

export function normalizeUserRole(value: string | null | undefined): UserRole {
  const normalized = String(value ?? '').toLowerCase().trim();

  const roleMap: Record<string, UserRole> = {
    client: 'client',
    partner: 'partner',
    driver: 'driver',
    admin: 'admin',
    livreur: 'driver',
    merchant: 'partner',
    restaurant: 'partner',
  };

  return roleMap[normalized] ?? 'client';
}

// ============ DATABASE INTERFACES ============

/**
 * Order: Primary business entity
 */
export interface Order {
  id: string;
  client_id: string | null;
  partner_id: string;
  status: OrderStatus;
  
  // Customer info
  client_name: string;
  client_phone: string;
  delivery_address: string;
  delivery_latitude: number | null;
  delivery_longitude: number | null;
  
  // Pricing (verified server-side)
  subtotal: number;
  delivery_fee: number;
  platform_fee: number;
  driver_tip: number;
  promo_discount: number;
  total_amount: number;
  
  // Payment
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  change_amount: number | null;
  
  // Instructions
  kitchen_note: string;
  driver_note: string;
  
  // Legal
  indpd_accepted: boolean;
  cgu_accepted: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  accepted_at: string | null;
  prepared_at: string | null;
  dispatched_at: string | null;
  delivered_at: string | null;
}

/**
 * OrderItem: Line items for an order
 */
export interface OrderItem {
  id: string;
  order_id: string;
  item_id: string;
  item_name_fr: string;
  item_name_ar: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
  customizations: Array<{
    option_id: string;
    option_name_fr?: string;
    option_name_ar?: string;
    selected_value: string;
    price_adjustment?: number;
  }>;
  created_at: string;
}

/**
 * OrderStatusHistory: Audit trail for order transitions
 */
export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  changed_by: string | null;
  note: string | null;
  created_at: string;
}

/**
 * Profile: User identity and role
 */
export interface Profile {
  id: string;
  email: string;
  phone: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Delivery: Driver assignment and delivery tracking
 */
export interface Delivery {
  id: string;
  order_id: string;
  driver_id: string | null;
  status: DeliveryStatus;
  
  // Location tracking
  pickup_latitude: number | null;
  pickup_longitude: number | null;
  delivery_latitude: number | null;
  delivery_longitude: number | null;
  
  // Timing
  assigned_at: string | null;
  accepted_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  
  // Notes
  driver_note: string | null;
  cancellation_reason: string | null;
  
  created_at: string;
  updated_at: string;
}

// ============ RPC CONTRACTS ============

export interface CreateCheckoutOrderInput {
  p_client_id: string | null;
  p_partner_id: string;
  p_client_name: string;
  p_client_phone: string;
  p_delivery_address: string;
  p_delivery_latitude?: number | null;
  p_delivery_longitude?: number | null;
  p_items: Array<{
    item_id: string;
    quantity: number;
    unit_price: number;
    item_name_fr: string;
    item_name_ar?: string | null;
  }>;
  p_subtotal: number;
  p_delivery_fee: number;
  p_platform_fee: number;
  p_driver_tip: number;
  p_promo_code?: string | null;
  p_payment_method: PaymentMethod;
  p_change_amount?: number | null;
  p_kitchen_note?: string | null;
  p_driver_note?: string | null;
  p_indpd_accepted: boolean;
  p_cgu_accepted: boolean;
}

export interface CreateCheckoutOrderResponse {
  success: boolean;
  order_id?: string;
  total_amount?: number;
  status?: OrderStatus;
  message?: string;
  code?: string;
}

export interface UpdateOrderStatusInput {
  p_order_id: string;
  p_new_status: OrderStatus;
  p_note?: string | null;
}

export interface UpdateOrderStatusResponse {
  success: boolean;
  order_id: string;
  status: OrderStatus;
  message?: string;
}

// ============ FRONTEND STATE TYPES ============

export interface CartItem {
  id: string;
  item_id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderSummary {
  order_id: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  restaurant_name: string;
}

// ============ EXPORTS ============
export type { OrderStatus, PaymentMethod, PaymentStatus, UserRole, DeliveryStatus };
