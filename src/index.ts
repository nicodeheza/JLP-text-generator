import {DictDb} from './dict/db/db.dict.js'
import express from 'express'
import cors from 'cors'
import routes from './routes.js'
import {CONFIG} from './config.js'
import {join, dirname} from 'path'
import {fileURLToPath} from 'url'
import {setupAi} from './infrastructure/Ai/index.ai.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function onExit() {
	const signals = ['SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM']
	signals.forEach((signal) => {
		process.on(signal, () => {
			try {
				DictDb.close()
			} catch (e) {
				console.error(e)
			} finally {
				process.exit()
			}
		})
	})
}

async function setup() {
	DictDb.open(true)
	await setupAi()
	onExit()
}

async function main() {
	await setup()
	const app = express()

	app.use(express.json())

	if (!CONFIG.IS_PROD) {
		app.use(cors())
	}

	app.use('/api', routes)

	if (CONFIG.IS_PROD) {
		app.use(express.static(join(__dirname, '..', 'frontend', 'dist')))
		app.get('/', (req, res) =>
			res.sendFile(join(__dirname, '..', 'frontend', 'dist', 'index.html'))
		)
	}

	app.listen(CONFIG.PORT, () => {
		console.log(`App listening on port ${CONFIG.PORT}`)
	})
}

main().catch(console.error)
