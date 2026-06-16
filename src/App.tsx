import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. واجهات الزبائن (B2C) والمحرك الأساسي
import SplashScreen from './screens/SplashScreen';
import { CustomerHome } from './screens/customer/CustomerHome';
import ClientHome from './screens/ClientHome';
import ShopListing from '@/screens/customer/restaurant';
import MenuPage from './screens/MenuPage';
import CheckoutFlow from '@/components/features/checkout/CheckoutFlow';

// 2. واجهات الشركاء ولوحات التحكم (B2B)
import PartnerDashboard from './screens/partner/partner';

// نظام الحماية الجداري الذكي لرصد أخطاء التشغيل ومنع الصفحة البيضاء
class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4">
          <div className="bg-rose-950/20 border border-rose-500/30 p-6 rounded-xl max-w-md w-full">
            <h1 className="text-2xl font-black text-rose-500 mb-2">تعذر تشغيل الواجهة داخلياً</h1>
            <code className="text-sm text-rose-300 block bg-black/40 p-3 rounded mb-4 overflow-x-auto">
              {(this.state.error as any)?.message}
            </code>
            <p className="text-xs text-slate-400">تحقق من المتغيرات البرمجية للهواتف المتبقية في الملف.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-[#F4F6F8]">
          <Routes>
            {/* التوجيهات الأساسية للتطبيق */}
            <Route path="/" element={<SplashScreen />} />
            <Route path="/home" element={<CustomerHome />} />
            <Route path="/accueil" element={<CustomerHome />} />
            <Route path="/client" element={<ClientHome />} />
            
            {/* محرك التصنيفات والاشتراكات والمطاعم */}
            <Route path="/restaurant" element={<ShopListing />} />
            <Route path="/restaurant/:id" element={<ShopListing />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/menu/:id" element={<MenuPage />} />
            
            {/* الشركاء والدفع */}
            <Route path="/checkout" element={<CheckoutFlow />} />
            <Route path="/partner" element={<PartnerDashboard />} />
            
            {/* حارس المسارات الافتراضي */}
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
