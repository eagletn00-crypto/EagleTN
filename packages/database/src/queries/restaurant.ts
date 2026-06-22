import { supabase } from '../supabase';

export type RestaurantOpenStatus = 'open' | 'closed' | 'busy';

export type Restaurant = {
  id: number;
  name: string;
  description: string;
  address: string;
  rating: number;
  image_url: string;
  open_status?: RestaurantOpenStatus;
};

export type MenuItemModifier = {
  id: number;
  name: string;
  price_tnd: number;
  description?: string;
  active: boolean;
};

export type MenuItem = {
  id: number;
  restaurant_id: number;
  name: string;
  description: string;
  price_tnd: number;
  category: string;
  available: boolean;
  modifiers?: MenuItemModifier[];
};

export async function getRestaurants(): Promise<Restaurant[]> {
  const { data, error } = await supabase.from<Restaurant>('restaurants').select('*');
  if (error) {
    throw new Error(`Failed to fetch restaurants: ${error.message}`);
  }
  return data ?? [];
}

export async function getRestaurantById(restaurantId: number): Promise<Restaurant> {
  const { data, error } = await supabase
    .from<Restaurant>('restaurants')
    .select('*')
    .eq('id', restaurantId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch restaurant ${restaurantId}: ${error.message}`);
  }

  return data;
}

export async function getRestaurantMenu(restaurantId: number): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from<MenuItem>('menu_items')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('category')
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch menu for restaurant ${restaurantId}: ${error.message}`);
  }
  return data ?? [];
}

export async function updateMenuItemAvailability(menuItemId: number, available: boolean): Promise<MenuItem> {
  const { data, error } = await supabase
    .from<MenuItem>('menu_items')
    .update({ available })
    .eq('id', menuItemId)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to update availability for menu item ${menuItemId}: ${error.message}`);
  }

  return data;
}

export async function updateMenuItemModifiers(menuItemId: number, modifiers: MenuItemModifier[]): Promise<MenuItem> {
  const { data, error } = await supabase
    .from<MenuItem>('menu_items')
    .update({ modifiers })
    .eq('id', menuItemId)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to update modifiers for menu item ${menuItemId}: ${error.message}`);
  }

  return data;
}

export async function getRestaurantStatus(restaurantId: number): Promise<RestaurantOpenStatus> {
  const { data, error } = await supabase
    .from<Restaurant>('restaurants')
    .select('open_status')
    .eq('id', restaurantId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch restaurant status for ${restaurantId}: ${error.message}`);
  }

  return data.open_status ?? 'closed';
}

export async function updateRestaurantStatus(
  restaurantId: number,
  open_status: RestaurantOpenStatus
): Promise<Restaurant> {
  const { data, error } = await supabase
    .from<Restaurant>('restaurants')
    .update({ open_status })
    .eq('id', restaurantId)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to update restaurant status for ${restaurantId}: ${error.message}`);
  }

  return data;
}

export async function getPilotRestaurant(): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from<Restaurant>('restaurants')
    .select('*')
    .eq('name', 'Chez Am Ali')
    .limit(1)
    .single();

  if (error) {
    throw new Error(`Failed to fetch pilot restaurant: ${error.message}`);
  }
  return data ?? null;
}
