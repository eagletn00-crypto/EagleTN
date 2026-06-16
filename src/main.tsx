// 1. مستشعرات الانهيار الجذرية (يجب أن تكون أول سطور في الملف)
window.onerror = function(message, source, lineno, colno, error) {
  document.body.innerHTML = `
    <div style="background-color: #4c0519; color: white; padding: 2rem; font-family: monospace; min-height: 100vh; position: absolute; top: 0; left: 0; width: 100%; z-index: 99999;">
      <h1 style="color: #f43f5e; font-size: 24px; border-bottom: 2px solid #f43f5e; padding-bottom: 10px; margin-bottom: 20px;">🚨 CRASH FATAL (Window Error)</h1>
      <p style="font-size: 16px;"><strong>Message :</strong> ${message}</p>
      <p style="font-size: 14px; margin-top: 10px;"><strong>Fichier :</strong> ${source}</p>
      <p style="font-size: 14px;"><strong>Ligne :</strong> ${lineno} | <strong>Colonne :</strong> ${colno}</p>
      <pre style="background: rgba(0,0,0,0.8); padding: 15px; border-radius: 8px; margin-top: 20px; overflow-x: auto; font-size: 12px;">${error?.stack || 'Pas de trace disponible'}</pre>
    </div>
  `;
  return true; // منع المتصفح من إخفاء الخطأ
};

window.onunhandledrejection = function(event) {
  document.body.innerHTML = `
    <div style="background-color: #4c0519; color: white; padding: 2rem; font-family: monospace; min-height: 100vh; position: absolute; top: 0; left: 0; width: 100%; z-index: 99999;">
      <h1 style="color: #f43f5e; font-size: 24px; border-bottom: 2px solid #f43f5e; padding-bottom: 10px; margin-bottom: 20px;">🚨 CRASH FATAL (Promise Rejection)</h1>
      <p style="font-size: 16px;"><strong>Raison :</strong> ${event.reason}</p>
      <pre style="background: rgba(0,0,0,0.8); padding: 15px; border-radius: 8px; margin-top: 20px; overflow-x: auto; font-size: 12px;">${event.reason?.stack || 'Pas de trace disponible'}</pre>
    </div>
  `;
};

// 2. الاستدعاءات القياسية لـ React
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // تأكد أن ملف التنسيق موجود

// 3. التحقق من وجود نقطة الإقلاع في index.html
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Div avec l'id 'root' introuvable dans index.html !");
}

const root = ReactDOM.createRoot(rootElement);

// 4. إثبات الحياة (Proof of Life) - سيظهر فوراً إذا كان المتصفح سليماً
const ProofOfLife = () => (
  <div style={{ background: '#064e3b', color: 'white', padding: '2rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
    <h1 style={{ fontSize: '3rem', fontWeight: 'bold', margin: '0' }}>🦅 Eagle Web Active</h1>
    <p style={{ marginTop: '1rem', opacity: '0.8' }}>Le DOM fonctionne. Chargement du cœur de l'application dans 1.5s...</p>
    <div style={{ marginTop: '2rem', width: '40px', height: '40px', border: '4px solid #34d399', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

root.render(<ProofOfLife />);

// 5. الاستدعاء الديناميكي للتطبيق (هنا سنصطاد الخطأ الخفي)
setTimeout(() => {
  import('./App')
    .then((module) => {
      const App = module.default;
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    })
    .catch((err) => {
      // إذا فشل App.tsx أو أي ملف يستدعيه (مثل PremiumTheme) في مرحلة التقييم!
      root.render(
        <div style={{ background: '#4c0519', color: 'white', padding: '2rem', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#f43f5e', fontSize: '24px', borderBottom: '2px solid #f43f5e', paddingBottom: '10px' }}>🚨 ERREUR D'IMPORTATION (Import Error)</h1>
          <p style={{ marginTop: '15px', fontSize: '14px' }}>Le composant App.tsx a échoué lors de son importation. C'est probablement dû à une importation de React Native (ex: StyleSheet, View) qui traîne dans App.tsx ou dans un thème importé.</p>
          <pre style={{ background: 'rgba(0,0,0,0.8)', padding: '15px', borderRadius: '8px', marginTop: '20px', overflowX: 'auto', fontSize: '12px' }}>
            {err.stack || err.message}
          </pre>
        </div>
      );
    });
}, 1500);
