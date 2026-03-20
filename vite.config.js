import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // SUSTITUYE 'blog-noticias' por el nombre exacto de tu repo en GitHub
  base: '/blog-noticias/', 
  plugins: [vue()],
  build: {
    // Esto asegura que los activos se generen en una estructura compatible
    outDir: 'dist',
  }
})