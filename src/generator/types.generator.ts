export type AiStreamingResponse = AsyncGenerator<string>
export interface AiTextGenerationArgs {
	prompt: string
	systemInstructions: string
}

type Token =
	| {
			original: string
			isWord: true
			basicForm: string
			furigana?: string
			dictIds: string[]
	  }
	| {
			original: string
			isWord: false
	  }

interface Word {
	kana: string[]
	kanji: string[]
	sense: Sense[]
}
interface Sense {
	pos: string[]
	gloss: string[]
}

export interface Dict {
	[id: string]: Word
}

export interface Analyzed {
	tokens: Token[]
	dict: Dict
}

export interface AnalyzedStoryChunk {
	paragraph: {
		text: string
		translation: string
		tokens: Token[]
	}
	dict: Dict
}
