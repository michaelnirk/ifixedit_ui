import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { URL } from 'node:url';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': new URL('./src', import.meta.url).pathname
		}
	},
	test: {
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html']
		},
		environment: 'jsdom',
		environmentOptions: {
			jsdom: {
				url: 'http://localhost'
			}
		},
		hookTimeout: 15000,
		setupFiles: ['./src/test/setupTests.js'],
		testTimeout: 15000
	}
});
