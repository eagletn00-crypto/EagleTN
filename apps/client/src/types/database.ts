/**
 * ================================================
 * ENTERPRISE TYPE-SAFE DATABASE SCHEMA
 * Supabase Table & RPC Contracts
 * ================================================
 * IMPORTS FROM: @eagle/database/types
 * This file re-exports canonical types with local documentation
 */

// ============ IMPORT CANONICAL ENUMS ============
export type {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  UserRole,
  DeliveryStatus,
} from '@eagle/database';

export { normalizeOrderStatus, normalizePaymentMethod, normalizeUserRole } from '@eagle/database';

// ============ DATABASE TABLES ============

/**
 * Table: orders
 * Primary business entity for customer orders
 * Row-Level Security: Customers see only their own orders
 */
export interface DatabaseOrder {
  id: string;                          // UUID primary key
  client_id: string | null;            // Foreign key to auth.users (nullable for guest checkout)
  partner_id: string;                  // Foreign key to partners (restaurant)
  status: OrderStatus;                 // Current order status
  
  // Customer Information (immutable once created)
  client_name: string;                 // Full name or "Guest"
  client_phone: string;                // Phone number for delivery coordination
  delivery_address: string;            // Full delivery address
  
  // Location Data (for tracking & mapping)
  delivery_latitude: number | null;
  delivery_longitude: number | null;
  
  // Order Totals (calculated & verified server-side in RPC)
  subtotal: number;                    // Sum of item prices × quantity
  delivery_fee: number;                // Partner-specific delivery cost
  platform_fee: number;                // Eagle TN commission
  driver_tip: number;                  // Tip for delivery driver
  promo_discount: number;              // Discount applied from promo code
  total_amount: number;                // Final payment amount (verified in RPC)
  
  // Payment Information
  payment_method: PaymentMethod;
  payment_status: 'pending' | 'success' | 'failed';
  change_amount: number | null;        // For COD payment
  
  // Special Instructions
  kitchen_note: string;                // Instructions for kitchen
  driver_note: string;                 // Instructions for delivery driver
  
  // Legal Compliance
  indpd_accepted: boolean;             // INDPD (Tunisia Data Protection)
  cgu_accepted: boolean;               // CGU (Terms of Service)
  
  // Timestamps
  created_at: string;                  // ISO 8601 timestamp
  updated_at: string;                  // ISO 8601 timestamp
  accepted_at: string | null;
  prepared_at: string | null;
  dispatched_at: string | null;
  delivered_at: string | null;
}

/**
 * Table: order_items
 * Line items for each order (immutable)
 * Denormalized for performance (item price locked at order time)
 */
export interface DatabaseOrderItem {
  id: string;                          // UUID primary key
  order_id: string;                    // Foreign key to orders
  item_id: string;                     // Reference to menu items (may be deleted)
  
  // Denormalized item data (locked at order time)
  item_name_fr: string;                // French item name
  item_name_ar: string | null;         // Arabic item name (i18n)
  
  // Pricing (server-verified in RPC)
  quantity: number;                    // Quantity ordered (1-999)
  unit_price: number;                  // Price per unit at order time (prevents price tampering)
  line_total: number;                  // quantity × unit_price (calculated in RPC)
  
  // Customizations (JSON for extensibility)
  customizations: CustomizationChoice[];  // Selected options (e.g., size, ingredients)
  
  created_at: string;
}

/**
 * Customization Choice
 * Represents a customer's choice for a menu item option
 */
export interface CustomizationChoice {
  option_id: string;                   // ID of the customization option
  option_name_fr: string;              // French option name
  option_name_ar?: string;             // Arabic option name
  selected_value: string;              // Selected choice (e.g., "Medium", "No Piment")
  price_adjustment: number;            // Additional cost for this choice (e.g., +0.5 DT)
}

/**
 * Table: order_status_history
 * Audit trail for order state transitions
 * Used for realtime tracking & order history
 */
export interface DatabaseOrderStatusHistory {
  id: string;                          // UUID primary key
  order_id: string;                    // Foreign key to orders
  status: OrderStatus;                 // New status
  changed_by: string | null;           // User who changed status (admin/driver)
  note: string | null;                 // Reason for status change (e.g., "Out for delivery")
  created_at: string;                  // When status was changed
}

// ============ RPC FUNCTION CONTRACTS ============

/**
 * RPC: create_checkout_order
 * Enterprise checkout function that:
 * 1. Validates all input data
 * 2. Verifies promo codes server-side
 * 3. Recalculates totals to prevent client-side tampering
 * 4. Applies RLS policies
 * 5. Creates atomic order + order_items transaction
 * 
 * SECURITY:
 * - All price calculations MUST be verified server-side
 * - Promo discounts applied by RPC, not client
 * - RLS ensures user can only create their own orders
 * - Rate-limiting should be applied to prevent abuse
 */
export interface CreateCheckoutOrderInput {
  // Authentication & Authorization
  p_client_id: string | null;          // Auth user ID (null for guest)
  p_partner_id: string;                // Restaurant ID (required)
  
  // Customer Information
  p_client_name: string;               // Full name
  p_client_phone: string;              // Phone number
  p_delivery_address: string;          // Full delivery address
  p_delivery_latitude?: number | null;
  p_delivery_longitude?: number | null;
  
  // Order Items
  p_items: OrderItemForCheckout[];      // Cart items with validated prices
  
  // Totals (client-provided for display, but server recalculates & verifies)
  p_subtotal: number;                  // Sum of items (verified)
  p_delivery_fee: number;              // Delivery cost
  p_platform_fee: number;              // Platform commission
  p_driver_tip?: number;               // Driver tip
  p_promo_code?: string;               // Promo code (validated server-side)
  
  // Payment Information
  p_payment_method: PaymentMethod;
  p_change_amount?: number | null;     // For COD payment
  
  // Special Instructions
  p_kitchen_note?: string;
  p_driver_note?: string;
  
  // Legal Compliance
  p_indpd_accepted: boolean;           // Data protection consent
  p_cgu_accepted: boolean;             // Terms of service consent
}

/**
 * Order item payload for RPC
 * SECURITY: Unit price is sent by client but verified server-side
 */
export interface OrderItemForCheckout {
  item_id: string;                     // Menu item ID
  quantity: number;                    // Ordered quantity
  unit_price: number;                  // Price from frontend (verify against DB)
  item_name_fr: string;                // Display name
  item_name_ar?: string;               // Arabic name
  customizations?: CustomizationChoice[];
}

/**
 * RPC Response: create_checkout_order
 */
export interface CreateCheckoutOrderResponse {
  success: boolean;
  order_id: string;                    // Created order UUID
  total_amount: number;                // Final verified amount
  status: OrderStatus;
  message?: string;                    // Error message if failed
  validation_errors?: ValidationError[];  // Field-level errors
}

/**
 * Validation Error Detail
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// ============ FRONTEND STATE TYPES ============

/**
 * Cart Item (Frontend State)
 * Slightly different from DatabaseOrderItem
 * Includes menu item display info
 */
export interface CartItemState {
  id: string;                          // Unique ID (item_id-timestamp)
  item_id: string;                     // Reference to menu item
  name: string;                        // Item name for display
  price: number;                       // Current price (will be verified)
  quantity: number;                    // Quantity in cart
  customizations?: CustomizationChoice[];
  subtotal: number;                    // quantity × price
}

/**
 * Order Details (Frontend Display)
 * Combines multiple database tables for UI display
 */
export interface OrderDetailUI extends DatabaseOrder {
  items: (DatabaseOrderItem & {
    item_name: string;
    item_image_url?: string;
  })[];
  partner?: {
    name: string;
    phone?: string;
    image_url?: string;
  };
}

/**
 * Promo Code Validation Response
 */
export interface PromoCodeValidation {
  valid: boolean;
  code: string;
  discount_type: 'fixed' | 'percentage';
  discount_value: number;              // Fixed amount or percentage
  max_uses?: number;
  remaining_uses?: number;
  min_order_amount?: number;
  message?: string;
}

// ============ ERROR HANDLING ============

/**
 * Structured error response from RPC
 */
export interface OrderServiceError extends Error {
  code: string;                        // Error code for i18n
  statusCode: number;                  // HTTP status
  details?: Record<string, any>;       // Additional context
  retryable: boolean;                  // Can user retry?
}

export const OrderErrorCodes = {
  INVALID_PARTNER: 'INVALID_PARTNER',
  INVALID_ITEM: 'INVALID_ITEM',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  PRICE_MISMATCH: 'PRICE_MISMATCH',
  INVALID_PROMO: 'INVALID_PROMO',
  MINIMUM_ORDER_NOT_MET: 'MINIMUM_ORDER_NOT_MET',
  DELIVERY_AREA_NOT_COVERED: 'DELIVERY_AREA_NOT_COVERED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INVALID_ADDRESS: 'INVALID_ADDRESS',
  CONSENT_REQUIRED: 'CONSENT_REQUIRED',
  UNKNOWN: 'UNKNOWN',
} as const;
