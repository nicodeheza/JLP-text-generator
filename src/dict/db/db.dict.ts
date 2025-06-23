import {join} from 'path'
import sqlite3 from 'sqlite3'

const __dirname = import.meta.dirname

export const DB_PATH = join(__dirname, '../../../jmDict/dictDb.db')

export class Db {
	private static db: sqlite3.Database | undefined

	static open(readonly?: boolean) {
		if (Db.db) return
		Db.db = new sqlite3.Database(DB_PATH, readonly ? sqlite3.OPEN_READONLY : undefined)
	}

	static close() {
		const db = Db.db
		if (!db) throw new Error('no db instance')

		return new Promise((resolve, reject) => {
			db.close((e) => {
				if (e) reject(e)
				Db.db = undefined
				resolve(undefined)
			})
		})
	}

	static closeSync() {
		const db = Db.db
		if (!db) throw new Error('no db instance')
		db.close()
	}

	private static getDb() {
		const db = Db.db
		if (!db) throw new Error('on db instance')
		return db
	}

	static exec(sql: string) {
		const db = Db.getDb()
		return new Promise((resolve, reject) => {
			db.exec(sql, (e) => {
				if (e) return reject(e)
				resolve(undefined)
			})
		})
	}

	static run(sql: string, params: any[]) {
		const db = Db.getDb()

		return new Promise((resolve, reject) => {
			db.run(sql, params, (err) => {
				if (err) return reject(err)
				resolve(undefined)
			})
		})
	}

	static get<D>(sql: string, params: any[]): Promise<D> {
		const db = Db.getDb()
		return new Promise((resolve, reject) => {
			db.get(sql, params, (err, row) => {
				if (err) return reject(err)
				resolve(row as D)
			})
		})
	}

	static all<D>(sql: string, params: any[]): Promise<D[]> {
		const db = Db.getDb()
		return new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows) => {
				if (err) return reject(err)
				resolve(rows as D[])
			})
		})
	}
}
