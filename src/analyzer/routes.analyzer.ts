import {Router} from 'express'
import {analyzeTextHandler} from './handlers.analyzer.js'

const router = Router()

router.post('/', analyzeTextHandler)

export default router
