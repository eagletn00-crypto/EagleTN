import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log("🔥 [CRITICAL CHECK] MAIN.TSX EXECUTED SUCCESSFULLY");

const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = "<h1 style='color:red;font-size:24px;padding:20px;'>❌ ERROR: #root element missing in index.html</h1>";
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err: any) {
    document.body.innerHTML = `<h1 style='color:red;'>💥 React Render Crash</h1><pre>${err?.message || err}</pre>`;
  }
}
