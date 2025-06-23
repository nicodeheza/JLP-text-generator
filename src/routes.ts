import {Router} from 'express'
import generatorRoutes from './generator/routes.generator.js'

const router = Router()

router.use('/generate', generatorRoutes)

export default router
