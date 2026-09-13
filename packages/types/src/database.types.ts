export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

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
          has_rating: boolean | null
          has_description: boolean | null
          icon_url: string | null
          display_order: number | null
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
          display_order: number | null
          created_at: string | null
          name_fr: string
          name_ar: string | null
          description_fr: string | null
          description_ar: string | null
          badge: string | null
          is_popular: boolean | null
          is_spicy: boolean | null
          current_price: number
          pending_price: number | null
          price_status: 'active' | 'pending' | 'rejected'
          current_photo_url: string | null
        }
        Insert: Omit<Database['public']['Tables']['menu_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['menu_items']['Insert']>
      }
      driver_wallets: {
        Row: {
          driver_id: string
          cash_in_hand: number
          commission_debt: number
          max_cash_limit: number
          is_locked: boolean
          updated_at: string
        }
      }
      users_consent_logs: {
        Row: {
          id: string
          user_id: string
          inpdp_consent_given: boolean
          consent_version: string
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
      }
    }
  }
}
