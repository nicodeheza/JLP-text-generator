import {join} from 'path'
import {loadDictionary} from '@scriptin/jmdict-simplified-loader'
import {Db} from './db/db.dict.js'
import {createTables, insertToDict} from './db/queries.dict.js'

const __dirname = import.meta.dirname

async function setupDict(file: string) {
	console.log('open db')
	Db.open()

	console.log('Creating tables')
	await createTables()

	const path = join(__dirname, file)

	const promises: Promise<void>[] = []

	loadDictionary('jmdict', path)
		.onMetadata(() => {})
		.onEntry((entry, metadata) => {
			console.log(`Adding ${entry.id} record`)

			promises.push(insertToDict(entry, metadata.tags))
		})
		.onEnd(() => {
			console.log('Saving Records')
			Promise.all(promises)
				.then(() => {
					console.log('Done!')
				})
				.catch(console.error)
				.finally(async () => await Db.close())
		})
}

setupDict('../../jmDict/jmdict-eng-3.6.1.json').catch(console.error)
