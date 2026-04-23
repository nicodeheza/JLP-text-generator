import {createCipheriv, randomBytes} from 'crypto'
import {validateAiApiKey as validateAiApiKeyInfra} from './infrastructure/ai.user.js'
import {CONFIG} from '../config.js'

export function validateAiApiKey(apiKey: string): Promise<boolean> {
	return validateAiApiKeyInfra(apiKey)
}

export function encryptApiKey(apiKey: string): string {
	const key = Buffer.from(CONFIG.COOKIE_SECRET, 'hex')
	const iv = randomBytes(12)
	const cipher = createCipheriv('aes-256-gcm', key, iv)

	const encrypted = Buffer.concat([cipher.update(apiKey, 'utf8'), cipher.final()])
	const authTag = cipher.getAuthTag()

	return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
}
