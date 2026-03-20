import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // Esta ruta debe ser el nombre de tu repositorio entre barras
  base: '/blog-noticias/', 
  plugins: [vue()],
})