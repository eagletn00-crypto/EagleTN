import { Category, MenuItemWithCategory } from '../types';

export const menuService = {
  async getCategories(): Promise<Category[]> {
    return [
      { id: '1', name: 'Plats Principal' },
      { id: '2', name: 'Boissons' }
    ];
  },
  async getMenuItems(): Promise<MenuItemWithCategory[]> {
    return [];
  }
};
