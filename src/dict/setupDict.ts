import {join} from 'path'
import {loadDictionary} from '@scriptin/jmdict-simplified-loader'
import {DictDb} from './db/db.dict'
import {insertMecabPos, insertTags, insertToDict} from './db/setupInserts.dict'

const BATCH_SIZE = 100
async function setupDict(file: string) {
	console.log('open db')
	DictDb.open()

	const path = join(__dirname, file)

	let promises: Promise<void>[] = []
	let metadataReady: Promise<void> = Promise.resolve()
	let currentBatchPromise: Promise<void[]> = Promise.resolve([])

	loadDictionary('jmdict', path)
		.onMetadata((metadata) => {
			console.log('inserting metadata')
			metadataReady = (async () => {
				await insertTags(metadata.tags)
				await insertMecabPos()
			})()
		})
		.onEntry((entry, metadata) => {
			console.log(`Adding ${entry.id} record`)

			const p = Promise.all([metadataReady, currentBatchPromise]).then(() =>
				insertToDict(entry, metadata.tags)
			)
			promises.push(p)

			if (promises.length >= BATCH_SIZE) {
				currentBatchPromise = Promise.all(promises)
				promises = []
			}
		})
		.onEnd(() => {
			Promise.all([metadataReady, currentBatchPromise, ...promises])
				.then(() => {
					console.log('Done!')
				})
				.catch(console.error)
				.finally(() => DictDb.close())
		})
}

setupDict('../../jmDict/jmdict-eng-3.6.1.json').catch(console.error)
