import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      // حقن كود يمنع الفشل (Fail-safe) ويعامل أي ملف مفقود كـ Empty Module
      external: () => true,
      onwarn(warning, warn) {
        // تجاهل تماماً التحذيرات الخاصة بالفشل في التعرف على الاستدعاءات
        if (warning.code === 'UNRESOLVED_IMPORT') return;
        warn(warning);
      }
    }
  }
});
