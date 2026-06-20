#!/bin/bash

echo "🔍 جاري حقن سكربت الفحص الذكي داخل إعدادات Vite لمعرفة الملف المفقود..."

# إعادة كتابة vite.config.js ليقوم بطباعة اسم الملف المفقود بالتفصيل في الـ Build Logs
cat << 'JS' > vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [
        {
          name: 'catch-missing-files',
          resolveId(source, importer) {
            // إذا كان الملف محلي وليس من node_modules وفشل Vite في العثور عليه
            if (source.startsWith('.') || source.startsWith('/')) {
              console.log(`\n🚨🚨 [FOUND MISSING ITEM]: Attempting to import "${source}" inside "${importer}" 🚨🚨\n`);
            }
            return null;
          }
        }
      ]
    }
  }
});
JS

# إضافة الملف المعدل والرفع تلقائياً لـ GitHub
git add vite.config.js
git commit -m "Debug: Inject missing file logger into Vite config"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
git push origin $CURRENT_BRANCH --force

echo "✅ تم الرفع! انتظر ثوانٍ حتى يفشل البناء مجدداً في Vercel (هذه المرة مقصودة)."
echo "👀 بمجرد أن يفشل، ابحث في الـ Build Logs عن السطر الذي يحتوي على: [FOUND MISSING ITEM]"
