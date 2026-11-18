export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: { id: string; partner_id: string; status: string; items: Json; created_at?: string; driver_id?: string; order_code?: string; short_code?: string; restaurant_name?: string; restaurant_phone?: string; customer_name?: string; customer_phone?: string; customer_address?: string; delivery_fee?: number; order_value?: number; total_amount?: number; lat?: number; lng?: number; };
        Insert: { id?: string; partner_id: string; status?: string; items: Json; created_at?: string; driver_id?: string; order_code?: string; short_code?: string; restaurant_name?: string; restaurant_phone?: string; customer_name?: string; customer_phone?: string; customer_address?: string; delivery_fee?: number; order_value?: number; total_amount?: number; lat?: number; lng?: number; };
        Update: { id?: string; partner_id?: string; status?: string; items?: Json; created_at?: string; driver_id?: string; order_code?: string; short_code?: string; restaurant_name?: string; restaurant_phone?: string; customer_name?: string; customer_phone?: string; customer_address?: string; delivery_fee?: number; order_value?: number; total_amount?: number; lat?: number; lng?: number; };
        Relationships: [];
      };
      order_items: { Row: any; Insert: any; Update: any; Relationships: []; };
      profiles: { Row: any; Insert: any; Update: any; Relationships: []; };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// الواجهات الإضافية السيادية
export interface MenuItem { id: string; partner_id: string; name_fr: string; name_ar?: string; description?: string; price: number; image_url?: string; is_popular?: boolean; is_spicy?: boolean; category?: string; }
export interface Restaurant { id: string; slug?: string; name: string; name_fr?: string; name_ar?: string; category?: string; cover_image_url?: string; cover_url?: string; image_url?: string; rating?: number; delivery_time?: string; is_open?: boolean; delivery_fee?: number; is_featured?: boolean; }
export interface Category { id: string; name: string; localLabel?: string; coverImageUrl?: string; merchantCount?: number; }
export interface InvoiceLineItem { id: string; designation: string; quantity: number; unitPriceHT: number; tvaRate?: number; totalHT: number; }
export interface InvoiceData { invoiceNumber: string; orderReference: string; issuedDate: string; dueDate?: string; paymentStatus: string; paymentMethod: string; deliveryMode: string; issuer: any; client: any; items: InvoiceLineItem[]; subtotalHT: number; tvaAmount: number; deliveryFeeTTC: number; driverCommissionShare?: number; grandTotalTTC: number; }
export interface CartItemPayload { id?: string; partner_id: string; name: string; price: number; quantity: number; image_url?: string; }

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
