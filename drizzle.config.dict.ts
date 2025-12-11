import {defineConfig} from 'drizzle-kit'
import {join} from 'path'

export const DB_PATH = join(__dirname, './jmDict/dictDb.db')

export default defineConfig({
	schema: './src/dict/db/schema.dict.ts',
	out: './drizzle',
	dialect: 'sqlite',
	dbCredentials: {
		url: DB_PATH
	}
})
