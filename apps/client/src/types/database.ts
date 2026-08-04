export interface Partner {
  id: string;
  name: string;
  billing_type: string;
  is_active: boolean;
  rating: number;
  review_count: number;
  prep_time_min: number;
  tags: string[];
  lat: number;
  lng: number;
  location?: any; // Colonne PostGIS point
  image_url?: string;
  category_id?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  display_order: number;
}

export interface EnhancedPartner extends Partner {
  calculated_distance_km: number;
  calculated_delivery_fee_millimes: number;
}
