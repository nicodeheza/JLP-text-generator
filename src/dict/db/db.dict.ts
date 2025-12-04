import {drizzle} from 'drizzle-orm/better-sqlite3'
import {join} from 'path'
import sqlite3 from 'sqlite3'

const __dirname = import.meta.dirname

export const DB_PATH = join(__dirname, '../../../jmDict/dictDb.db')

export class DictDb {
	private static db: sqlite3.Database | undefined
	private static drizzleDB: ReturnType<typeof drizzle> | undefined

	static open(readonly?: boolean) {
		if (DictDb.db) return
		DictDb.db = new sqlite3.Database(
			DB_PATH,
			readonly ? sqlite3.OPEN_READONLY : undefined
		)
		if (!DictDb.drizzleDB) DictDb.drizzleDB = drizzle(DictDb.db)
	}

	static close() {
		const db = DictDb.db
		if (!db) throw new Error('no db instance')

		return new Promise((resolve, reject) => {
			db.close((e) => {
				if (e) reject(e)
				DictDb.db = undefined
				resolve(undefined)
			})
		})
	}

	static closeSync() {
		const db = DictDb.db
		if (!db) throw new Error('no db instance')
		db.close()
	}

	static getDb() {
		if (!DictDb.db || !DictDb.drizzleDB) throw new Error('on db instance')
		return DictDb.drizzleDB
	}
}
