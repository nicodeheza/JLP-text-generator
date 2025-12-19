import {vi} from 'vitest'
import {Ai} from './generator/Ai.js'

const AiClassMock = vi.fn().mockImplementation(
	() =>
		({
			setup: vi.fn(),
			directRespond: vi.fn(() => Promise.resolve('')),
			streamingResponse: vi.fn(async function* () {
				yield ''
				yield ''
			})
		} satisfies Ai)
)

vi.mock('./generator/Ai.js', () => {
	return {
		Ai: AiClassMock,
		aiDirectResponse: vi.fn().mockResolvedValue(''),
		aiSteamResponse: vi.fn(async function* () {
			yield ''
			yield ''
		})
	}
})

vi.mock('./tokenizer/tokenizer.js', () => {
	return {
		tokenize: vi.fn().mockResolvedValue([])
	}
})

vi.mock('./dict/db/queries.dict.js', () => {
	return {
		getByKanaAndMecabPosQuery: vi.fn().mockResolvedValue([]),
		getByKanjiAndMecabPosQuery: vi.fn().mockResolvedValue([])
	}
})
