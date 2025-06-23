import type {Dict, Token} from '../types/analyzedText.types'

export interface Paragraph {
	text: string
	translation: string
	tokens: Token[]
}

interface AnalyzedStoryChunk {
	message: undefined
	error: undefined
	paragraph: Paragraph
	dict: Dict
}

interface EventError {
	message: string
	error: unknown
	paragraph: undefined
	dict: undefined
}

interface EventFinished {
	message: 'done'
	error: undefined
	paragraph: undefined
	dict: undefined
}

export type EventData = AnalyzedStoryChunk | EventError | EventFinished

export function isEventError(event: EventData): event is EventError {
	return !!(event.message && event.error)
}
export function isEventFinished(event: EventData): event is EventFinished {
	return !!(event.message && !event.error && event.message === 'done')
}

export interface CachedEvent {
	paragraphs: Paragraph[]
	dict: Dict
	prompt: string
}

export type ConnectionState = 'loading' | 'connected' | 'disconnected'
