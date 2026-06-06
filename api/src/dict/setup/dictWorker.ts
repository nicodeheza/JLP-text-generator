import {parentPort} from 'worker_threads'
import {insertToDict} from '../db/setupInserts.dict.js'
import {Msg} from './setupTypes.js'
import {DictDb} from '../db/db.dict.js'

DictDb.open()
parentPort?.on('message', async (msg: Msg) => {
	try {
		await insertToDict(msg.jMdictWord, msg.mecab, msg.tags)
		parentPort?.postMessage({success: true})
	} catch (error) {
		console.error('Worker error:', error)
		parentPort?.postMessage({success: false})
	}
})
