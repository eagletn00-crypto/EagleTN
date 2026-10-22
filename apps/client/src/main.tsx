import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // منع التحميل الزائد عند تبديل التطبيقات في الهاتف
      retry: 2, // إعادة المحاولة مرتين في حالة ضعف الإنترنت (4G/3G)
      staleTime: 1000 * 60 * 5, // الاحتفاظ بالبيانات كـ "طازجة" لمدة 5 دقائق
    },
  },
});

import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
