export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          code: string
          name_fr: string
          name_ar: string
          sort_order: number
          is_active: boolean
        }
        Insert: {
          id?: string
          code: string
          name_fr: string
          name_ar: string
          sort_order?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          code?: string
          name_fr?: string
          name_ar?: string
          sort_order?: number
          is_active?: boolean
        }
      }
      menu_items: {
        Row: {
          id: string
          partner_id: string
          category_id: string
          name: string
          description: string | null
          price: number
          img: string | null
          is_available: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          partner_id: string
          category_id: string
          name: string
          description?: string | null
          price: number
          img?: string | null
          is_available?: boolean
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          partner_id?: string
          category_id?: string
          name?: string
          description?: string | null
          price?: number
          img?: string | null
          is_available?: boolean
          display_order?: number
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          partner_id: string
          client_id: string
          driver_id: string | null
          status: string
          subtotal: number
          delivery_fee: number
          total_amount: number
          address: string
          delivery_address: Json
          delivery_latitude: number | null
          delivery_longitude: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          partner_id: string
          client_id: string
          driver_id?: string | null
          status?: string
          subtotal: number
          delivery_fee: number
          total_amount: number
          address: string
          delivery_address: Json
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          partner_id?: string
          client_id?: string
          driver_id?: string | null
          status?: string
          subtotal?: number
          delivery_fee?: number
          total_amount?: number
          address?: string
          delivery_address?: Json
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      partners: {
        Row: {
          id: string
          name: string
          logo: string | null
          type: string | null
          cover: string | null
          phone: string | null
          address: string | null
          rating: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          logo?: string | null
          type?: string | null
          cover?: string | null
          phone?: string | null
          address?: string | null
          rating?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo?: string | null
          type?: string | null
          cover?: string | null
          phone?: string | null
          address?: string | null
          rating?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Partner = Database['public']['Tables']['partners']['Row'];
export type MenuItem = Database['public']['Tables']['menu_items']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];

export type Restaurant = Partner;
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED';

export interface CartItem {
  menu_item: MenuItem;
  quantity: number;
  customizations?: Record<string, any>;
}

export interface DeliveryAddress {
  description: string;
  street?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}
