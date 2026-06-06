import pino from 'pino'
import { pinoHttp } from 'pino-http'
import { CONFIG } from '../config.js'

const transport = !CONFIG.IS_PROD
  ? { target: 'pino-pretty', options: { colorize: true } }
  : undefined

export const logger = pino({
  level: CONFIG.LOG_LEVEL,
  redact: {
    paths: ['req.headers.cookie', 'req.headers.authorization', 'res.headers["set-cookie"]'],
    censor: '[Redacted]',
  },
  transport,
})

export const httpLogger = pinoHttp({
  logger,
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return 'error'
    if (res.statusCode >= 400) return 'warn'
    return 'info'
  },
})
