import {Request, Response} from 'express'
import {analyzeText} from './service.analyzer.js'

export async function analyzeTextHandler(req: Request, res: Response) {
	const {text} = req.body as {text?: string}

	// Validate text input
	if (!text || text.trim() === '') {
		res.status(400).json({error: 'Text is required'})
		return
	}

	try {
		const result = await analyzeText(text)
		res.json(result)
	} catch (error) {
		console.error(error)
		res.status(500).json({error: 'Internal server error'})
	}
}
