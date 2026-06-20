import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // امسح هذا السطر لو مشروعك ليس React

export default defineConfig({
  plugins: [react()], // امسح react() لو مشروعك ليس React
  build: {
    rollupOptions: {
      // إخبار Rollup بمعاملة الملفات التي تفشل في التعرف عليها كملفات خارجية دون إيقاف البناء
      external: (id) => id.includes('node_modules') ? false : false,
      onwarn(warning, warn) {
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        warn(warning);
      }
    }
  }
});
