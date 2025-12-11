import {drizzle} from 'drizzle-orm/better-sqlite3'
import {join, dirname} from 'path'
import {fileURLToPath} from 'url'
import Database from 'better-sqlite3'
import * as schema from './schema.dict.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const DB_PATH = join(__dirname, '../../../jmDict/dictDb.db')

export class DictDb {
	private static db: Database.Database | undefined
	private static drizzleDB: ReturnType<typeof drizzle<typeof schema>> | undefined

	static open(readonly?: boolean) {
		if (DictDb.db) return
		DictDb.db = new Database(DB_PATH, readonly ? {readonly: true} : undefined)
		if (!readonly) DictDb.db.pragma('journal_mode = WAL')
		if (!DictDb.drizzleDB) DictDb.drizzleDB = drizzle({client: DictDb.db})
	}

	static close() {
		const db = DictDb.db
		if (!db) throw new Error('no db instance')

		db.close()
		DictDb.db = undefined
		DictDb.drizzleDB = undefined
	}

	static getDb() {
		if (!DictDb.db || !DictDb.drizzleDB) throw new Error('no db instance')
		return DictDb.drizzleDB
	}
}
