/**
 * ================================================
 * LIVREUR (DRIVER) APP TYPES
 * Uses canonical OrderStatus from @eagle/database
 * ================================================
 */

import type { OrderStatus } from '@eagle/database';
import { normalizeOrderStatus } from '@eagle/database';

/**
 * DeliveryOrder: Driver-specific order view
 * Maps from canonical database order to driver UI
 */
export interface DeliveryOrder {
  id: string;
  order_code: string;
  short_code: string;
  restaurant_name: string;
  restaurant_phone: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  lat: number;
  lng: number;
  order_value: number; // Customer payment total
  delivery_fee: number; // Driver earnings
  status: OrderStatus; // Normalized canonical status
}

/**
 * Delivery Status Issues
 */
export type IssueReason = 
  | 'RESTAURANT_CLOSED' 
  | 'CLIENT_UNREACHABLE' 
  | 'WRONG_ADDRESS' 
  | 'VEHICLE_BREAKDOWN' 
  | 'OTHER';

/**
 * Map old driver statuses to canonical order statuses
 * For backward compatibility during migration
 */
export function mapDriverStatusToOrderStatus(driverStatus: string): OrderStatus {
  const statusMap: Record<string, OrderStatus> = {
    'PREPARATION': 'preparing',
    'EN_ROUTE': 'on_the_way',
    'IN_TRANSIT': 'on_the_way',
    'DELIVERED': 'delivered',
    'CANCELLED': 'cancelled',
    'FAILED': 'failed',
  };
  
  return normalizeOrderStatus(statusMap[driverStatus] || driverStatus);
}

/**
 * Map canonical order status to driver-friendly label
 */
export function getDriverStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    'pending': 'En attente',
    'accepted': 'Acceptée',
    'preparing': 'Préparation',
    'on_the_way': 'En route',
    'delivered': 'Livrée',
    'cancelled': 'Annulée',
    'failed': 'Échouée',
  };
  
  return labels[status] || 'Inconnu';
}

export type { OrderStatus } from '@eagle/database';
