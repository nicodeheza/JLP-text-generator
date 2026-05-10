import {CONFIG} from '../config'
import {post, get, del} from './base.api'

const BASE = `${CONFIG.API_URL}/user/ai-auth`

export function setAiAuth(apiKey: string): Promise<void> {
	return post<void>(BASE, {apiKey}, {
		default: 'Error setting AI auth',
		401: 'Invalid API key'
	})
}

export function getAiAuth(): Promise<{auth: boolean}> {
	return get<{auth: boolean}>(BASE, {
		default: 'Error getting AI auth status'
	})
}

export function deleteAiAuth(): Promise<void> {
	return del<void>(BASE, {
		default: 'Error deleting AI auth'
	})
}
