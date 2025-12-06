import {Router} from 'express'
import generatorRoutes from './generator/routes.generator'

const router = Router()

router.use('/generate', generatorRoutes)

export default router
