import {join} from 'path'
import {loadDictionary} from '@scriptin/jmdict-simplified-loader'
import {DictDb} from './db/db.dict'
import {insertToDict} from './db/setupInserts.dict'

async function setupDict(file: string) {
	console.log('open db')
	DictDb.open()

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
				.finally(() => DictDb.close())
		})
}

setupDict('../../jmDict/jmdict-eng-3.6.1.json').catch(console.error)
