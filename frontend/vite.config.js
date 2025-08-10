import { defineConfig } from 'vite'

// No JSX or React plugin needed; using plain JS with React.createElement
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
