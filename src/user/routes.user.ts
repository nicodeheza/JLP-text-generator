import {Router} from 'express'
import {aiAuthHandler, getAiAuthHandler} from './handlers.user.js'

const router = Router()

router.post('/ai-auth', aiAuthHandler)
router.get('/ai-auth', getAiAuthHandler)

export default router
