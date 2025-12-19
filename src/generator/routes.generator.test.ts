import {describe, expect, it} from 'vitest'
import express from 'express'
import routes from './routes.generator.js'
import request from 'supertest'

const app = express()
app.use(routes)

describe('Generator Routes', () => {
	it('GET /story', async () => {
		const response = await request(app).get('/story')
		expect(response.status).toEqual(200)
	})
})
