import {Router} from 'express'
import {aiAuthHandler, getAiAuthHandler, deleteAiAuthHandler} from './handlers.user.js'

const router = Router()

router.post('/ai-auth', aiAuthHandler)
router.get('/ai-auth', getAiAuthHandler)
router.delete('/ai-auth', deleteAiAuthHandler)

export default router
