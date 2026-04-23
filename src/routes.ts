import {Router} from 'express'
import generatorRoutes from './generator/routes.generator.js'
import analyzerRoutes from './analyzer/routes.analyzer.js'
import userRoutes from './user/routes.user.js'

const router = Router()

router.use('/generate', generatorRoutes)
router.use('/analyze', analyzerRoutes)
router.use('/user', userRoutes)

export default router
