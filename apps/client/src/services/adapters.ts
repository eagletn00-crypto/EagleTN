import { Partner as PartnerDB } from '../types/schema';

export interface PartnerUI {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount: number;
  deliveryTime: string;
  deliveryFee: string;
  isOpen: boolean;
  isVerified: boolean;
  badge?: string;
  image: string;
}

export const adaptPartnerToUI = (partner: PartnerDB): PartnerUI => {
  return {
    id: partner.id,
    name: partner.name,
    category: partner.type || 'Restauration',
    rating: partner.rating || 5.0,
    reviewsCount: 120, // يمكن ربطها بجدول التقييمات مستقبلاً
    deliveryTime: '20-30 min', // تجسير ديناميكي حسب الموقع الميداني
    deliveryFee: '2.500 DT',
    isOpen: Boolean(partner.is_active),
    isVerified: true,
    badge: partner.is_active ? 'DISPONIBLE' : undefined,
    image: partner.cover || partner.logo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
  };
};
