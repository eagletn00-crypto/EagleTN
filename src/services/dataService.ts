import { supabase } from './supabaseClient';

// دالة جلب موحدة لأي جدول في سوبابيس
export const fetchTableData = async (tableName: string, filterField?: string, filterValue?: any) => {
  let query = supabase.from(tableName).select('*');
  
  if (filterField && filterValue) {
    query = query.eq(filterField, filterValue);
  }

  const { data, error } = await query;
  if (error) {
    console.error(`Error fetching ${tableName}:`, error);
    return [];
  }
  return data;
};
