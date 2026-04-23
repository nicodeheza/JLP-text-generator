import {Request, Response} from 'express'
import {isValidAiAuthBody} from './validations.user.js'
import {validateAiApiKey, encryptApiKey} from './service.user.js'
import {CONFIG} from '../config.js'

export async function aiAuthHandler(req: Request, res: Response): Promise<void> {
	if (!isValidAiAuthBody(req.body)) {
		res.status(400).json({error: 'apiKey is required'})
		return
	}

	const {apiKey} = req.body
	const isValid = await validateAiApiKey(apiKey)

	if (!isValid) {
		res.status(401).json({error: 'Invalid API key'})
		return
	}

	const encrypted = encryptApiKey(apiKey)

	res.cookie('ai_key', encrypted, {
		httpOnly: true,
		secure: CONFIG.IS_PROD,
		sameSite: 'strict',
		path: '/api'
	})

	res.status(200).json({success: true})
}
