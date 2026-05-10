import {Request, Response} from 'express'
import {isValidAiAuthBody} from './validations.user.js'
import {validateAiApiKey, encryptApiKey} from './service.user.js'
import {CONFIG} from '../config.js'

const AI_KEY_COOKIE_NAME = 'ai_key'
const AI_KEY_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: CONFIG.IS_PROD,
	sameSite: 'strict' as const,
	path: '/api'
}

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

	res.cookie(AI_KEY_COOKIE_NAME, encrypted, AI_KEY_COOKIE_OPTIONS)
	res.status(200).json({success: true})
}

export function getAiAuthHandler(req: Request, res: Response): void {
	const auth = !!req.cookies?.[AI_KEY_COOKIE_NAME]
	res.status(200).json({auth})
}

export function deleteAiAuthHandler(req: Request, res: Response): void {
	res.clearCookie(AI_KEY_COOKIE_NAME, AI_KEY_COOKIE_OPTIONS)
	res.status(200).json({success: true})
}
