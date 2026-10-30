import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // ספריית האנימציות מגדילה את הקובץ מעבר לברירת המחדל של האזהרה (500KB).
    // זה תקין לאתר בגודל הזה, ולכן מעלים את הסף.
    chunkSizeWarningLimit: 800,
  },
})
