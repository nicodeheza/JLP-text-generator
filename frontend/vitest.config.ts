import {defineConfig, mergeConfig} from 'vitest/config'
import viteConfig from './vite.config'
import path from 'path'

export default mergeConfig(
	viteConfig,
	defineConfig({
		resolve: {
			alias: {
				'onnxruntime-web': path.resolve(__dirname, 'src/__mocks__/onnxruntime-web.ts')
			}
		},
		test: {
			environment: 'jsdom',
			setupFiles: './src/vitest.setup.ts',
			include: ['src/**/*.test.{ts,tsx}'],
			exclude: ['node_modules', 'dist']
		}
	})
)
