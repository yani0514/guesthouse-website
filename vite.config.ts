import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/guesthouse-website/',
  plugins: [react(), tailwindcss()],
  build: { target: 'baseline-widely-available' },
});
