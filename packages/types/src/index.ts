export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      menu_items: {
        Row: {
          id: string
          restaurant_id: string
          name_fr: string
          name_ar: string
          desc_fr: string
          desc_ar: string
          price: number
          category: string
          image_url: string
          is_available: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['menu_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['menu_items']['Insert']>
      }
      users_consent_logs: {
        Row: {
          id: string
          user_id: string
          inpdp_consent_given: boolean
          ip_address: string
          consent_date: string
        }
      }
    }
  }
}
