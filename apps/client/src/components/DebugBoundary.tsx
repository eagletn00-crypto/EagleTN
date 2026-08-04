import React from 'react';

interface DebugProps {
  categories: any[];
  menuItems: any[];
  selectedCategory: string;
}

export default function DebugBoundary({ categories, menuItems, selectedCategory }: DebugProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '12px', right: '12px', zIndex: 99999 }}>
      <button 
        onClick={() => setOpen(!open)} 
        style={{ backgroundColor: '#EF4444', color: '#FFFFFF', padding: '8px 14px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
      >
        {open ? 'إخفاء كاشف البيانات ✖' : '🔍 كاشف البيانات والربط'}
      </button>

      {open && (
        <div style={{ backgroundColor: '#0F172A', color: '#38BDF8', padding: '16px', borderRadius: '14px', marginTop: '8px', maxWidth: '340px', maxHeight: '380px', overflowY: 'auto', fontSize: '11px', boxShadow: '0 10px 25px rgba(0,0,0,0.4)', border: '1px solid #334155' }}>
          <h4 style={{ color: '#F8FAFC', margin: '0 0 8px 0' }}>📊 التشخيص المباشر:</h4>
          
          <p style={{ color: '#F59E0B', margin: '4px 0' }}><strong>التصنيف المضلل حالياً:</strong> {selectedCategory}</p>

          <hr style={{ borderColor: '#334155', margin: '8px 0' }} />

          <h5 style={{ color: '#E2E8F0', margin: '4px 0' }}>🏷️ التصنيفات من الداتابيز ({categories.length}):</h5>
          {categories.map(c => (
            <div key={c.id} style={{ marginBottom: '4px', background: '#1E293B', padding: '6px', borderRadius: '6px' }}>
              <div>• الاسم: <strong>{c.name}</strong></div>
              <div style={{ color: '#94A3B8', fontSize: '9px' }}>ID: {c.id}</div>
            </div>
          ))}

          <hr style={{ borderColor: '#334155', margin: '8px 0' }} />

          <h5 style={{ color: '#E2E8F0', margin: '4px 0' }}>🍕 أسطر من menu_items:</h5>
          {menuItems.slice(0, 5).map(m => (
            <div key={m.id} style={{ marginBottom: '4px', background: '#1E293B', padding: '6px', borderRadius: '6px' }}>
              <div>• {m.name}</div>
              <div style={{ color: '#F43F5E', fontSize: '9px' }}>category_id: {m.category_id || 'NULL'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
