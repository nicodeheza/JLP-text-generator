import express, {Request, Response} from 'express'
import cookieParser from 'cookie-parser'
import request from 'supertest'
import {describe, it, expect, afterEach, vi} from 'vitest'
import {encryptApiKey} from '../user/service.user.js'
import {decryptAiKeyMiddleware, AiKeyLocals} from './decrypt-ai-key.middleware.js'

function buildApp() {
	const app = express()
	app.use(cookieParser())
	app.use(decryptAiKeyMiddleware)
	app.get('/test', (req: Request, res: Response<any, AiKeyLocals>) => {
		res.status(200).json({aiKey: res.locals.aiKey})
	})
	return app
}

describe('decryptAiKeyMiddleware', () => {
	afterEach(() => {
		vi.clearAllMocks()
	})

	it('should return 401 when ai_key cookie is missing', async () => {
		const app = buildApp()
		const res = await request(app).get('/test')
		expect(res.status).toBe(401)
	})

	it('should return 401 when ai_key cookie is tampered/invalid', async () => {
		const app = buildApp()
		const res = await request(app).get('/test').set('Cookie', 'ai_key=invalid-value')
		expect(res.status).toBe(401)
	})

	it('should call next and set req.aiKey when cookie is valid', async () => {
		const app = buildApp()
		const plainKey = 'test-api-key'
		const encrypted = encryptApiKey(plainKey)
		const res = await request(app).get('/test').set('Cookie', `ai_key=${encrypted}`)
		expect(res.status).toBe(200)
		expect(res.body.aiKey).toBe(plainKey)
	})
})
