export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      partners: {
        Row: {
          id: string;
          slug: string;
          name: string;
          type: string;
          phone: string | null;
          address: string;
          latitude: number;
          longitude: number;
          rating: number;
          category: string;
          status: string;
          delivery_time: string;
          delivery_fee: number;
          min_order: number;
          opening_time: string;
          closing_time: string;
          commission_rate: number;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['partners']['Row']>;
        Update: Partial<Database['public']['Tables']['partners']['Row']>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          partner_id: string;
          client_id: string;
          courier_id: string | null;
          driver_id: string | null;
          status: string;
          subtotal_ht: number;
          tva_amount: number;
          timbre_fiscal: number;
          delivery_fee: number;
          total_amount: number;
          grand_total: number;
          delivery_address: string;
          payment_method: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['orders']['Row']>;
        Update: Partial<Database['public']['Tables']['orders']['Row']>;
        Relationships: [];
      };
      incidents: {
        Row: {
          id: string;
          order_id: string | null;
          status: string;
          type: string;
          description: string | null;
          amount_disputed: number | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['incidents']['Row']>;
        Update: Partial<Database['public']['Tables']['incidents']['Row']>;
        Relationships: [];
      };
      drivers: {
        Row: {
          id: string;
          name: string | null;
          phone: string | null;
          status: string;
          is_online: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['drivers']['Row']>;
        Update: Partial<Database['public']['Tables']['drivers']['Row']>;
        Relationships: [];
      };
      menu_items: {
        Row: { id: string; partner_id: string; name: string; price: number; created_at: string } & Record<string, Json>;
        Insert: Partial<Database['public']['Tables']['menu_items']['Row']>;
        Update: Partial<Database['public']['Tables']['menu_items']['Row']>;
        Relationships: [];
      };
      users_consent_logs: {
        Row: { id: string; user_id: string; consent_given: boolean; created_at: string } & Record<string, Json>;
        Insert: Partial<Database['public']['Tables']['users_consent_logs']['Row']>;
        Update: Partial<Database['public']['Tables']['users_consent_logs']['Row']>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
