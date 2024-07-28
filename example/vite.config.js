import { defineConfig } from 'vite';
import ReactPlugin from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ReactPlugin({})],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
