import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0', // Expose to all network interfaces
    port: 5173, // Default Vite port
    strictPort: true, // Fail if port is in use
  },
});
