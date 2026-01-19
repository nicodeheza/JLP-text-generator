import type {Dict} from '../types/analyzedText.types'
import type {CachedEvent, Paragraph} from './TextGenerator.types'

export class GeneratedTextStorage {
	private static key = '_event_cache'

	static getEventData(): CachedEvent | undefined {
		const storage = localStorage.getItem(GeneratedTextStorage.key)
		if (!storage) return
		return JSON.parse(storage)
	}

	static saveEventData(paragraphs: Paragraph[], dict: Dict, prompt: string) {
		const data: CachedEvent = {paragraphs, dict, prompt}
		localStorage.setItem(GeneratedTextStorage.key, JSON.stringify(data))
	}
}
