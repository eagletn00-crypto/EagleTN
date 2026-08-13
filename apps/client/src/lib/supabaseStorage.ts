const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';

export const getStoragePublicUrl = (bucket: 'products' | 'uploads' | 'assets', path?: string | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  
  const cleanPath = path.replace(/^\/+/, '');
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${cleanPath}`;
};
