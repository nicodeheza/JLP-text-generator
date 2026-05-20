import {defineConfig} from 'vitest/config'

export default defineConfig({
	test: {
		include: ['src/**/*.test.ts'],
		exclude: ['node_modules', 'dist', 'frontend'],
		env: {
			AI_KEY_SECRET: '0'.repeat(64)
		}
	}
})
