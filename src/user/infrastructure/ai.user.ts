import {validateApiKey} from '../../infrastructure/Ai/index.ai.js'

export function validateAiApiKey(apiKey: string): Promise<boolean> {
	return validateApiKey(apiKey)
}
