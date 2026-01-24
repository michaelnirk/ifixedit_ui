import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': new URL('./src', import.meta.url).pathname
		}
	},
	server: {
		proxy: {
			'/api': {
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
				target: 'http://localhost:3001'
			}
		}
	}
});
