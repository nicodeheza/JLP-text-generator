import {CONFIG} from '../config'
import type {JlptLevel} from '../types/Settings.types'

export function generateEvent(prompt: string, level: JlptLevel): EventSource {
	const params = new URLSearchParams({p: prompt, l: level})
	return new EventSource(`${CONFIG.API_URL}/generate/story?${params}`)
}
