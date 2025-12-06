import {defineConfig} from 'drizzle-kit'
import {DB_PATH} from './src/dict/db/db.dict'

export default defineConfig({
	schema: './src/dict/db/schema.dict.ts',
	out: './drizzle',
	dialect: 'sqlite',
	dbCredentials: {
		url: DB_PATH
	}
})
