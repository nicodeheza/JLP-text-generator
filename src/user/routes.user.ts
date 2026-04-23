import {Router} from 'express'
import {aiAuthHandler} from './handlers.user.js'

const router = Router()

router.post('/ai-auth', aiAuthHandler)

export default router
