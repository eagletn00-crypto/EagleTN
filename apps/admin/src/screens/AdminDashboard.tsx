import React from 'react';
import { Shield, Users, Activity, Layers, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard() {
  const systemMetrics = [
    { label: "إجمالي إيرادات الأسطول", value: "3,450 DT", change: "+12.4%", icon: Activity },
    { label: "الكباتن النشطين الآن", value: "42 سائق", change: "مستقر", icon: Users },
    { label: "المتاجر المفعّلة", value: "18 مطعم", change: "+2 هذا الأسبوع", icon: Layers }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-950 font-sans p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center bg-gray-950 text-white p-5 rounded-2xl shadow-sm">
        <div className="space-y-0.5">
          <h1 className="text-sm font-black tracking-tight">بوابة المراقبة المركزية</h1>
          <p className="text-[10px] text-gray-400 font-medium">Eagle.tn System Supervisor v2.0</p>
        </div>
        <Shield className="w-5 h-5 text-white opacity-80" />
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider">مؤشرات الأداء الكلية</h2>
        {systemMetrics.map((metric, idx) => (
          <div key={idx} className="bg-white border border-gray-100 p-4 rounded-2xl shadow-3xs flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                <metric.icon className="w-4 h-4 text-gray-950" />
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold">{metric.label}</p>
                <h3 className="text-xs font-black text-gray-950 mt-0.5">{metric.value}</h3>
              </div>
            </div>
            <span className="text-[10px] font-black text-gray-950 flex items-center bg-gray-50 px-2 py-0.5 rounded-md">
              {metric.change} <ArrowUpRight className="w-3 h-3 text-gray-950" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
