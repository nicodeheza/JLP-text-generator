import {Request, Response} from 'express'
import {generateAnalizadStoryStream} from './service.generator.js'
import {getSseMessage} from '../utils/utils.js'

export async function generateStoryHandler(req: Request, res: Response) {
	const {p: prompt} = req.query as Record<string, string>
	res.setHeader('Content-Type', 'text/event-stream')
	res.setHeader('Cache-Control', 'no-cache')
	res.setHeader('Connection', 'keep-alive')

	try {
		const storyRes = generateAnalizadStoryStream(prompt)

		for await (const chunk of storyRes) {
			res.write(getSseMessage(JSON.stringify(chunk)))
		}

		res.end(getSseMessage(JSON.stringify({message: 'done'})))
	} catch (error) {
		console.error(error)
		res.end(getSseMessage(JSON.stringify({message: 'error', error})))
	}
}
