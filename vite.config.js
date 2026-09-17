import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Sem este arquivo o plugin do React não é carregado: o JSX até compila pelo
// transform padrão do Vite, mas não há Fast Refresh — toda edição recarrega a
// página inteira e o estado dos sliders do laboratório é perdido.
export default defineConfig({
  plugins: [react()],
})
