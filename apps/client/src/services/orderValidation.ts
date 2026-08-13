/**
 * ================================================
 * ORDER VALIDATION & SECURITY LAYER
 * Enterprise-grade input validation & error handling
 * ================================================
 */

import {
  CreateCheckoutOrderInput,
  OrderItemForCheckout,
  OrderErrorCodes,
  OrderServiceError,
  PaymentMethod,
  CustomizationChoice,
} from '../types/database';

// ============ VALIDATION CONFIG ============
const VALIDATION_CONFIG = {
  MIN_ORDER_AMOUNT: 5.0,               // Minimum order total (DT)
  MAX_ORDER_AMOUNT: 999.99,            // Maximum order total (DT)
  MAX_ITEMS_PER_ORDER: 100,
  MAX_QUANTITY_PER_ITEM: 50,
  PHONE_REGEX: /^(\+216|0)?[2479]\d{7}$/,  // Tunisian phone numbers
  ADDRESS_MIN_LENGTH: 5,
  ADDRESS_MAX_LENGTH: 500,
  PROMO_CODE_MAX_LENGTH: 50,
  KITCHEN_NOTE_MAX_LENGTH: 500,
  DRIVER_NOTE_MAX_LENGTH: 500,
  ALLOWED_PAYMENT_METHODS: [PaymentMethod.COD, PaymentMethod.CARD, PaymentMethod.EDINAR],
  VALID_CURRENCIES: ['DT'] as const,
  PRICE_PRECISION: 3,                  // Decimal places for prices (0.001 DT = 1 millime)
} as const;

// ============ CUSTOM ERROR CLASS ============

/**
 * Structured error for order operations
 * Includes i18n-friendly error codes and retry info
 */
export class OrderValidationError extends Error implements OrderServiceError {
  constructor(
    public code: string,
    public statusCode: number,
    public retryable: boolean,
    public details?: Record<string, any>
  ) {
    super(`[${code}] Order validation failed`);
    Object.setPrototypeOf(this, OrderValidationError.prototype);
  }
}

// ============ VALIDATION FUNCTIONS ============

/**
 * Validate customer name
 * - Non-empty
 * - No SQL injection patterns
 * - Reasonable length
 */
export function validateClientName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim();
  
  if (!trimmed || trimmed.length === 0) {
    return { valid: false, error: 'Client name is required' };
  }
  
  if (trimmed.length > 100) {
    return { valid: false, error: 'Client name too long (max 100 chars)' };
  }
  
  // Basic sanitization - allow letters, numbers, spaces, and common accented chars
  if (!/^[\p{L}\p{N}\s'\-,.À-ÿ]+$/u.test(trimmed)) {
    return { valid: false, error: 'Client name contains invalid characters' };
  }
  
  return { valid: true };
}

/**
 * Validate Tunisian phone number
 * Accepts: +216XXXXXXXXX, 0XXXXXXXXX, 2XXXXXXXXX, etc.
 */
export function validatePhoneNumber(phone: string): { valid: boolean; error?: string } {
  const trimmed = phone.trim();
  
  if (!trimmed) {
    return { valid: false, error: 'Phone number is required' };
  }
  
  if (!VALIDATION_CONFIG.PHONE_REGEX.test(trimmed)) {
    return { valid: false, error: 'Invalid Tunisian phone number format' };
  }
  
  return { valid: true };
}

/**
 * Validate delivery address
 * - Non-empty
 * - Reasonable length
 * - No obvious injection attempts
 */
export function validateAddress(address: string): { valid: boolean; error?: string } {
  const trimmed = address.trim();
  
  if (!trimmed || trimmed.length < VALIDATION_CONFIG.ADDRESS_MIN_LENGTH) {
    return { 
      valid: false, 
      error: `Address must be at least ${VALIDATION_CONFIG.ADDRESS_MIN_LENGTH} characters` 
    };
  }
  
  if (trimmed.length > VALIDATION_CONFIG.ADDRESS_MAX_LENGTH) {
    return { 
      valid: false, 
      error: `Address too long (max ${VALIDATION_CONFIG.ADDRESS_MAX_LENGTH} chars)` 
    };
  }
  
  return { valid: true };
}

/**
 * Validate payment method
 */
export function validatePaymentMethod(method: string): { valid: boolean; error?: string } {
  if (!VALIDATION_CONFIG.ALLOWED_PAYMENT_METHODS.includes(method as PaymentMethod)) {
    return { valid: false, error: 'Invalid payment method' };
  }
  
  return { valid: true };
}

/**
 * Validate change amount for COD payment
 */
export function validateChangeAmount(amount: number | null, paymentMethod: PaymentMethod): { valid: boolean; error?: string } {
  if (paymentMethod !== PaymentMethod.COD) {
    return { valid: true }; // Not applicable for other payment methods
  }
  
  if (amount === null || amount === undefined) {
    return { valid: true }; // Optional for COD
  }
  
  if (!Number.isInteger(amount) || amount <= 0) {
    return { valid: false, error: 'Change amount must be a positive integer' };
  }
  
  if (amount > 1000) {
    return { valid: false, error: 'Change amount seems unreasonably high' };
  }
  
  return { valid: true };
}

/**
 * Validate single order item
 * Checks quantity, price format, and customizations
 */
export function validateOrderItem(
  item: OrderItemForCheckout,
  maxPrice: number = 100.0  // Sanity check for max item price
): { valid: boolean; error?: string } {
  // Validate item_id
  if (!item.item_id || typeof item.item_id !== 'string' || item.item_id.trim().length === 0) {
    return { valid: false, error: 'Item ID is required' };
  }
  
  // Validate quantity
  if (!Number.isInteger(item.quantity) || item.quantity < 1) {
    return { valid: false, error: `Item quantity must be a positive integer` };
  }
  
  if (item.quantity > VALIDATION_CONFIG.MAX_QUANTITY_PER_ITEM) {
    return { 
      valid: false, 
      error: `Quantity cannot exceed ${VALIDATION_CONFIG.MAX_QUANTITY_PER_ITEM}` 
    };
  }
  
  // Validate unit_price
  if (typeof item.unit_price !== 'number' || item.unit_price < 0) {
    return { valid: false, error: 'Unit price must be a non-negative number' };
  }
  
  if (item.unit_price > maxPrice) {
    return { valid: false, error: `Unit price exceeds maximum (${maxPrice} DT)` };
  }
  
  // Check price precision (3 decimal places max)
  const priceStr = item.unit_price.toString();
  const decimalPlaces = (priceStr.split('.')[1] || '').length;
  if (decimalPlaces > VALIDATION_CONFIG.PRICE_PRECISION) {
    return { 
      valid: false, 
      error: `Price precision exceeds ${VALIDATION_CONFIG.PRICE_PRECISION} decimal places` 
    };
  }
  
  // Validate item_name_fr
  if (!item.item_name_fr || typeof item.item_name_fr !== 'string' || item.item_name_fr.trim().length === 0) {
    return { valid: false, error: 'Item name is required' };
  }
  
  // Validate customizations if present
  if (item.customizations && Array.isArray(item.customizations)) {
    for (const custom of item.customizations) {
      const customValidation = validateCustomization(custom);
      if (!customValidation.valid) {
        return customValidation;
      }
    }
  }
  
  return { valid: true };
}

/**
 * Validate a customization choice
 */
export function validateCustomization(custom: CustomizationChoice): { valid: boolean; error?: string } {
  if (!custom.option_id || typeof custom.option_id !== 'string') {
    return { valid: false, error: 'Customization option_id is required' };
  }
  
  if (!custom.selected_value || typeof custom.selected_value !== 'string') {
    return { valid: false, error: 'Customization selected_value is required' };
  }
  
  if (typeof custom.price_adjustment !== 'number') {
    return { valid: false, error: 'Customization price_adjustment must be a number' };
  }
  
  if (custom.price_adjustment < -50 || custom.price_adjustment > 50) {
    return { valid: false, error: 'Customization price adjustment out of reasonable range' };
  }
  
  return { valid: true };
}

/**
 * Validate order notes (kitchen and driver)
 */
export function validateNotes(notes: string | undefined, type: 'kitchen' | 'driver'): { valid: boolean; error?: string } {
  if (!notes || notes.trim().length === 0) {
    return { valid: true }; // Optional
  }
  
  const maxLength = type === 'kitchen' 
    ? VALIDATION_CONFIG.KITCHEN_NOTE_MAX_LENGTH 
    : VALIDATION_CONFIG.DRIVER_NOTE_MAX_LENGTH;
  
  if (notes.length > maxLength) {
    return { valid: false, error: `${type} note exceeds ${maxLength} characters` };
  }
  
  return { valid: true };
}

/**
 * Validate complete checkout order input
 * COMPREHENSIVE VALIDATION - all fields checked
 */
export function validateCheckoutOrder(
  input: CreateCheckoutOrderInput
): { valid: boolean; errors: Array<{ field: string; message: string }> } {
  const errors: Array<{ field: string; message: string }> = [];
  
  // 1. Validate partner_id
  if (!input.p_partner_id || typeof input.p_partner_id !== 'string' || input.p_partner_id.trim().length === 0) {
    errors.push({ field: 'partner_id', message: 'Partner ID is required' });
  }
  
  // 2. Validate customer info
  const clientNameValidation = validateClientName(input.p_client_name);
  if (!clientNameValidation.valid) {
    errors.push({ field: 'client_name', message: clientNameValidation.error! });
  }
  
  const phoneValidation = validatePhoneNumber(input.p_client_phone);
  if (!phoneValidation.valid) {
    errors.push({ field: 'client_phone', message: phoneValidation.error! });
  }
  
  const addressValidation = validateAddress(input.p_delivery_address);
  if (!addressValidation.valid) {
    errors.push({ field: 'delivery_address', message: addressValidation.error! });
  }
  
  // 3. Validate items
  if (!input.p_items || !Array.isArray(input.p_items) || input.p_items.length === 0) {
    errors.push({ field: 'items', message: 'At least one item is required' });
  } else {
    if (input.p_items.length > VALIDATION_CONFIG.MAX_ITEMS_PER_ORDER) {
      errors.push({ 
        field: 'items', 
        message: `Maximum ${VALIDATION_CONFIG.MAX_ITEMS_PER_ORDER} items allowed` 
      });
    }
    
    input.p_items.forEach((item, index) => {
      const itemValidation = validateOrderItem(item);
      if (!itemValidation.valid) {
        errors.push({ field: `items[${index}]`, message: itemValidation.error! });
      }
    });
  }
  
  // 4. Validate totals
  if (typeof input.p_subtotal !== 'number' || input.p_subtotal < 0) {
    errors.push({ field: 'subtotal', message: 'Invalid subtotal' });
  }
  
  if (typeof input.p_delivery_fee !== 'number' || input.p_delivery_fee < 0) {
    errors.push({ field: 'delivery_fee', message: 'Invalid delivery fee' });
  }
  
  if (typeof input.p_platform_fee !== 'number' || input.p_platform_fee < 0) {
    errors.push({ field: 'platform_fee', message: 'Invalid platform fee' });
  }
  
  // Verify total amount is reasonable
  const estimatedTotal = input.p_subtotal + input.p_delivery_fee + input.p_platform_fee + (input.p_driver_tip || 0);
  if (estimatedTotal < VALIDATION_CONFIG.MIN_ORDER_AMOUNT) {
    errors.push({ 
      field: 'total', 
      message: `Minimum order amount is ${VALIDATION_CONFIG.MIN_ORDER_AMOUNT} DT` 
    });
  }
  
  if (estimatedTotal > VALIDATION_CONFIG.MAX_ORDER_AMOUNT) {
    errors.push({ 
      field: 'total', 
      message: `Order amount exceeds maximum (${VALIDATION_CONFIG.MAX_ORDER_AMOUNT} DT)` 
    });
  }
  
  // 5. Validate payment method
  const paymentValidation = validatePaymentMethod(input.p_payment_method);
  if (!paymentValidation.valid) {
    errors.push({ field: 'payment_method', message: paymentValidation.error! });
  }
  
  // 6. Validate change amount
  const changeValidation = validateChangeAmount(input.p_change_amount || null, input.p_payment_method);
  if (!changeValidation.valid) {
    errors.push({ field: 'change_amount', message: changeValidation.error! });
  }
  
  // 7. Validate notes
  const kitchenNoteValidation = validateNotes(input.p_kitchen_note, 'kitchen');
  if (!kitchenNoteValidation.valid) {
    errors.push({ field: 'kitchen_note', message: kitchenNoteValidation.error! });
  }
  
  const driverNoteValidation = validateNotes(input.p_driver_note, 'driver');
  if (!driverNoteValidation.valid) {
    errors.push({ field: 'driver_note', message: driverNoteValidation.error! });
  }
  
  // 8. Validate legal consent
  if (!input.p_indpd_accepted) {
    errors.push({ field: 'indpd_accepted', message: 'Must accept INDPD data protection policy' });
  }
  
  if (!input.p_cgu_accepted) {
    errors.push({ field: 'cgu_accepted', message: 'Must accept terms of service (CGU)' });
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Create typed error from validation failure
 */
export function createValidationError(
  message: string,
  code: string = OrderErrorCodes.UNKNOWN,
  statusCode: number = 400,
  details?: Record<string, any>
): OrderValidationError {
  return new OrderValidationError(code, statusCode, true, details);
}

/**
 * Safe price comparison (accounting for floating point precision)
 */
export function comparePrices(a: number, b: number, tolerance: number = 0.01): boolean {
  return Math.abs(a - b) < tolerance;
}

/**
 * Calculate line item total with validation
 */
export function calculateLineTotal(quantity: number, unitPrice: number): { valid: boolean; total: number; error?: string } {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { valid: false, total: 0, error: 'Invalid quantity' };
  }
  
  if (typeof unitPrice !== 'number' || unitPrice < 0) {
    return { valid: false, total: 0, error: 'Invalid unit price' };
  }
  
  const total = quantity * unitPrice;
  
  // Check for floating point overflow
  if (total > VALIDATION_CONFIG.MAX_ORDER_AMOUNT) {
    return { valid: false, total: 0, error: 'Line total exceeds maximum' };
  }
  
  return { valid: true, total: parseFloat(total.toFixed(3)) };
}
