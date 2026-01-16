import {Router} from 'express'
import generatorRoutes from './generator/routes.generator.js'
import analyzerRoutes from './analyzer/routes.analyzer.js'

const router = Router()

router.use('/generate', generatorRoutes)
router.use('/analyze', analyzerRoutes)

export default router
