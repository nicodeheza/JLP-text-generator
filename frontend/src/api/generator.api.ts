import {CONFIG} from '../config'

export function generateEvent(prompt: string): EventSource {
	const params = new URLSearchParams({p: prompt})
	return new EventSource(`${CONFIG.API_URL}/generate/story?${params}`)
}
