import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({ jsxImportSource: '@emotion/react' })],
  assetsInclude: ['**/*.glb'],
  base: '/gamepad-api-experiment/',
});
