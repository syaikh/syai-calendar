import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'SyaiCalendar',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['svelte', '@internationalized/date', 'bits-ui', 'tailwind-merge'],
      output: {
        globals: {
          svelte: 'Svelte',
          '@internationalized/date': 'InternationalizedDate',
          'bits-ui': 'BitsUI',
          'tailwind-merge': 'TailwindMerge'
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
})