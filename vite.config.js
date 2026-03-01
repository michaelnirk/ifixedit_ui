import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (!id.includes('node_modules')) {
						return;
					}

					if (id.includes('/@mui/x-date-pickers/')) {
						return 'mui-x';
					}

					if (
						id.includes('/@emotion/')
						|| id.includes('/@mui/material/')
						|| id.includes('/@mui/system/')
						|| id.includes('/@mui/utils/')
					) {
						return 'mui-core';
					}

					if (
						id.includes('/@reduxjs/toolkit/')
						|| id.includes('/immer/')
						|| id.includes('/react-redux/')
						|| id.includes('/redux/')
						|| id.includes('/reselect/')
					) {
						return 'state';
					}

					if (
						id.includes('/react-router/')
						|| id.includes('/react-router-dom/')
					) {
						return 'router';
					}

					if (
						id.includes('/react/')
						|| id.includes('/react-dom/')
					) {
						return 'react-vendor';
					}
				}
			}
		}
	},
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
