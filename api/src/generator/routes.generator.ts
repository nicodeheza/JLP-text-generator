import { Router } from 'express'
import { generateStoryHandler } from './handlers.generator.js'
import { decryptAiKeyMiddleware } from '../middleware/decrypt-ai-key.middleware.js'

const router = Router()

router.get('/story', decryptAiKeyMiddleware, generateStoryHandler)

export default router
