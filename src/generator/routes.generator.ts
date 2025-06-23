import {Router} from 'express'
import {generateStoryHandler} from './handlers.generator.js'

const router = Router()

router.get('/story', generateStoryHandler)

export default router
