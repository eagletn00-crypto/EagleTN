import fs from 'fs';
import path from 'path';

const filePath = path.resolve('apps/partner/src/screens/PartnerDashboard.tsx');

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. إضافة استيراد Supabase
  if (!content.includes("import { supabase }")) {
    content = `import { supabase } from '../lib/supabaseClient';\n` + content;
  }

  // 2. تحديث التبويب الافتراضي ليصبح 'orders' بدلاً من 'menu'
  content = content.replace(
    "useState<'orders' | 'wallet' | 'menu' | 'store' | 'settings'>('menu')",
    "useState<'orders' | 'wallet' | 'menu' | 'store' | 'settings'>('orders')"
  );

  // 3. إضافة useEffect للربط المباشر مع Supabase
  const realtimeEffect = `
  const [orders, setOrders] = useState<any[]>([]);

  React.useEffect(() => {
    // جلب الطلبات الأولية للشريك (Chez Am Ali)
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setOrders(data);
    };

    fetchOrders();

    // الاستماع الفوري والحي لأي طلب جديد أو تغيير في الحالة
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  `;

  // استبدال تعريف const [orders] = useState بـ Effect الجديد
  content = content.replace(/const \[orders\] = useState<OrderFacture\[\]>\(INITIAL_ORDERS\);/, realtimeEffect);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ تم ربط تطبيق الشريك بنجاح بـ Supabase Realtime!');
} else {
  console.error('❌ تعذر العثور على ملف PartnerDashboard.tsx');
}
