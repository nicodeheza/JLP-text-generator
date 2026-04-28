import {describe, expect, it, vi, afterEach} from 'vitest'
import express from 'express'
import cookieParser from 'cookie-parser'
import request from 'supertest'
import routes from './routes.user.js'
import * as aiUserInfra from './infrastructure/ai.user.js'

vi.mock('./infrastructure/ai.user.js')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(routes)

describe('User Routes', () => {
	afterEach(() => {
		vi.clearAllMocks()
	})

	describe('POST /ai-auth', () => {
		it('should not accept invalid api keys', async () => {
			vi.mocked(aiUserInfra.validateAiApiKey).mockResolvedValue(false)

			const response = await request(app)
				.post('/ai-auth')
				.send({apiKey: 'invalid-key'})
				.set('Content-Type', 'application/json')

			expect(response.status).toEqual(401)
			expect(response.body).toEqual({error: 'Invalid API key'})
		})

		it('should accept api keys that are out of limit (429)', async () => {
			vi.mocked(aiUserInfra.validateAiApiKey).mockResolvedValue(true)

			const response = await request(app)
				.post('/ai-auth')
				.send({apiKey: 'rate-limited-key'})
				.set('Content-Type', 'application/json')

			expect(response.status).toEqual(200)
			expect(response.body).toEqual({success: true})
		})

		it('should accept valid api keys', async () => {
			vi.mocked(aiUserInfra.validateAiApiKey).mockResolvedValue(true)

			const response = await request(app)
				.post('/ai-auth')
				.send({apiKey: 'valid-key'})
				.set('Content-Type', 'application/json')

			expect(response.status).toEqual(200)
			expect(response.body).toEqual({success: true})
		})

		it('should return an http-only cookie with the token encrypted', async () => {
			const originalKey = 'valid-key'
			vi.mocked(aiUserInfra.validateAiApiKey).mockResolvedValue(true)

			const response = await request(app)
				.post('/ai-auth')
				.send({apiKey: originalKey})
				.set('Content-Type', 'application/json')

			expect(response.status).toEqual(200)

			const cookie = response.headers['set-cookie']
			expect(cookie).toBeDefined()

			const cookieStr: string = Array.isArray(cookie) ? cookie[0] : cookie

			// http-only
			expect(cookieStr.toLowerCase()).toContain('httponly')
			// samesite strict
			expect(cookieStr.toLowerCase()).toContain('samesite=strict')
			// path
			expect(cookieStr).toContain('Path=/api')
			// cookie name and encrypted value (iv:authTag:ciphertext format, colons may be url-encoded)
			expect(cookieStr).toMatch(/^ai_key=[0-9a-f]+(%3A|:)[0-9a-f]+(%3A|:)[0-9a-f]+/)
			// encrypted value must differ from the original key
			const cookieValue = cookieStr.split(';')[0].replace('ai_key=', '')
			expect(decodeURIComponent(cookieValue)).not.toEqual(originalKey)
		})

		it('should return 400 when apiKey is missing', async () => {
			const response = await request(app)
				.post('/ai-auth')
				.send({})
				.set('Content-Type', 'application/json')

			expect(response.status).toEqual(400)
			expect(response.body).toEqual({error: 'apiKey is required'})
		})
	})

	describe('GET /ai-auth', () => {
		it('should return auth:true when ai_key cookie is present', async () => {
			const response = await request(app)
				.get('/ai-auth')
				.set('Cookie', 'ai_key=someencryptedvalue')

			expect(response.status).toEqual(200)
			expect(response.body).toEqual({auth: true})
		})

		it('should return auth:false when ai_key cookie is absent', async () => {
			const response = await request(app).get('/ai-auth')

			expect(response.status).toEqual(200)
			expect(response.body).toEqual({auth: false})
		})
	})
})
