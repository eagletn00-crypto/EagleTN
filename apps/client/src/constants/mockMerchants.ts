export interface Merchant {
  id: string;
  name: string;
  cuisine: string;
  badge?: 'TOP 🔥' | 'NOUVEAU' | 'EXCLUSIF';
  image: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number; // 0 means Gratuit
  isActive: boolean;
}

export const MOCK_MERCHANTS: Merchant[] = [
  {
    id: 'm-001',
    name: 'Kafteji Chez Am Ali',
    cuisine: 'Street Food Tunisien',
    badge: 'TOP 🔥',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 1250,
    deliveryTime: '20-30 min',
    deliveryFee: 2.500,
    isActive: true,
  },
  {
    id: 'm-002',
    name: 'Pâtisserie Masmoudi',
    cuisine: 'Douceurs & Tradition',
    badge: 'EXCLUSIF',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 342,
    deliveryTime: '40-50 min',
    deliveryFee: 0,
    isActive: true,
  },
  {
    id: 'm-003',
    name: 'Le Zink',
    cuisine: 'Burgers Gourmet',
    badge: 'TOP 🔥',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 890,
    deliveryTime: '25-35 min',
    deliveryFee: 3.000,
    isActive: true,
  },
  {
    id: 'm-004',
    name: 'Bambalouni Sidi Bou',
    cuisine: 'Desserts Rapides',
    badge: 'NOUVEAU',
    image: 'https://images.unsplash.com/photo-1626073841199-a1b73bc30f6a?q=80&w=1000&auto=format&fit=crop',
    rating: 4.5,
    reviewCount: 84,
    deliveryTime: '15-25 min',
    deliveryFee: 1.500,
    isActive: true,
  }
];
