import { DictDb } from './dict/db/db.dict.js'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import routes from './routes.js'
import { CONFIG } from './config.js'
import { logger, httpLogger } from './utils/logger.js'

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

  app.use(cors({ origin: CONFIG.FRONTEND_URL, credentials: true }))
  app.use(httpLogger)
  app.use(express.json())
  app.use(cookieParser())

  app.use('/api', routes)

  app.listen(CONFIG.PORT, () => {
    logger.info(`App listening on port ${CONFIG.PORT}`)
  })
}

main().catch((err) => logger.error(err, 'Fatal error'))
