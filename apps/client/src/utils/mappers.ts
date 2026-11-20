// تم إزالة الاستيراد الصارم لتجنب خطأ TS2724

export const normalizePartner = (row: any): any => {
  return {
    id: row.id,
    slug: row.slug,
    name_fr: row.name_fr || row.name || 'Eagle Partner', 
    name_ar: row.name_ar,
    category: row.category,
    cover_url: row.cover_url || row.image_url || row.img,
    logo_url: row.logo_url,
    is_open: row.is_open ?? true,
    is_featured: row.is_featured ?? false,
    status: row.status || 'active',
    rating: row.rating ? Number(row.rating) : 0,
    review_count: row.review_count ? Number(row.review_count) : 0,
    delivery_time: row.delivery_time || '20-30 min',
    delivery_fee: row.delivery_fee ? Number(row.delivery_fee) : 2.500,
  };
};

export const normalizeMenuItem = (row: any): any => {
  let parsedNameFr = row.name;
  let parsedNameAr = '';
  
  if (row.name) {
    const match = String(row.name).match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    if (match) {
       parsedNameFr = match[1].trim();
       parsedNameAr = match[2].trim();
    }
  }

  return {
    id: row.id,
    partner_id: row.partner_id,
    name_fr: parsedNameFr || row.name_fr || 'Item', 
    name_ar: parsedNameAr || row.name_ar,
    description: row.description || row.description_fr,
    price: row.price ? Number(row.price) : 0,
    image_url: row.img || row.image_url || row.current_photo_url, 
    category: row.category_name_fr || row.category_id || 'Général',
    is_available: row.is_available ?? true,
    is_popular: row.is_popular ?? false,
    is_spicy: row.is_spicy ?? false,
  };
};
