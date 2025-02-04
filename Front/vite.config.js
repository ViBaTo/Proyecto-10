import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // Importante para rutas relativas
  build: {
    outDir: 'dist' // Asegúrate de que coincida con la carpeta de salida
  }
})
