import {DictDb} from './dict/db/db.dict.js'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import routes from './routes.js'
import {CONFIG} from './config.js'
import {logger, httpLogger} from './utils/logger.js'
import {join, dirname} from 'path'
import {fileURLToPath} from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function onExit() {
	const signals = ['SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM']
	signals.forEach((signal) => {
		process.on(signal, () => {
			try {
				DictDb.close()
			} catch (e) {
				logger.error(e, 'Error closing database on exit')
			} finally {
				process.exit()
			}
		})
	})
}

function setup() {
	DictDb.open(true)
	onExit()
}

async function main() {
	setup()
	const app = express()

	app.use(httpLogger)
	app.use(express.json())
	app.use(cookieParser())

	if (!CONFIG.IS_PROD) {
		app.use(cors({origin: CONFIG.FRONTEND_URL, credentials: true}))
	}

	app.use('/api', routes)

	if (CONFIG.IS_PROD) {
		// TODO: remove static frontend serving — frontend will be a separate app
		app.use(express.static(join(__dirname, '../../..', 'frontend', 'dist')))
		app.get('/', (req, res) =>
			res.sendFile(join(__dirname, '../../..', 'frontend', 'dist', 'index.html'))
		)
	}

	app.listen(CONFIG.PORT, () => {
		logger.info(`App listening on port ${CONFIG.PORT}`)
	})
}

main().catch((err) => logger.error(err, 'Fatal error'))
