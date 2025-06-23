import {useCallback, useEffect, useState} from 'react'
import {
	isEventError,
	isEventFinished,
	type CachedEvent,
	type ConnectionState,
	type EventData,
	type Paragraph
} from './TextGenerator.types'
import type {Dict} from '../types/analyzedText.types'
import {CONFIG} from '../config'

export function useGenerateText() {
	const [userPrompt, setUserPrompt] = useState('')
	const [paragraphs, setParagraphs] = useState<Paragraph[]>([])
	const [dict, setDict] = useState<Dict>({})
	const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected')
	const [error, setError] = useState<string>()
	const [saveCache, setSaveCache] = useState(false)

	useEffect(() => {
		if (!saveCache) return
		EventCache.saveEventData(paragraphs, dict, userPrompt)
		setSaveCache(false)
	}, [dict, paragraphs, saveCache, userPrompt])

	const setFromCache = useCallback(() => {
		const res = EventCache.getEventData()
		if (!res) return false
		setParagraphs(res.paragraphs)
		setDict(res.dict)
		setUserPrompt(res.prompt)

		return true
	}, [])

	const generateText = useCallback(() => {
		setParagraphs([])
		setDict({})
		setError(undefined)
		setConnectionState('loading')

		const params = new URLSearchParams({p: userPrompt})
		const event = new EventSource(`${CONFIG.API_URL}/generate/story?${params}`)

		event.onopen = () => {
			setConnectionState('connected')
		}

		event.onmessage = (e) => {
			const data: EventData = JSON.parse(e.data)

			if (isEventError(data)) {
				event.close()
				setConnectionState('disconnected')
				setError('Text generation has failed')
				console.error('SSE error:', data.error)
				return
			}

			if (isEventFinished(data)) {
				event.close()
				setConnectionState('disconnected')
				setSaveCache(true)
				return
			}

			setParagraphs((prev) => [...prev, data.paragraph])
			setDict((prev) => ({...prev, ...data.dict}))
		}

		event.onerror = (error) => {
			console.error('SSE error:', error)
			setError('Text generation has failed')
			setConnectionState('disconnected')
			event.close()
		}

		return () => {
			event.close()
			setConnectionState('disconnected')
		}
	}, [userPrompt])

	return {
		generateText,
		paragraphs,
		dict,
		connectionState,
		error,
		userPrompt,
		setUserPrompt,
		setFromCache
	}
}

class EventCache {
	private static key = '_event_cache'

	static getEventData(): CachedEvent | undefined {
		const storage = localStorage.getItem(EventCache.key)
		if (!storage) return
		return JSON.parse(storage)
	}

	static saveEventData(paragraphs: Paragraph[], dict: Dict, prompt: string) {
		const data: CachedEvent = {paragraphs, dict, prompt}
		localStorage.setItem(EventCache.key, JSON.stringify(data))
	}
}
