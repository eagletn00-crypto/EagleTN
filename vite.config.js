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
