import {generateText} from './infrastructure/ai.generator.js'
import {analyzeText} from './infrastructure/analyzer.generator.js'
import {generateStoryInstructions} from './prompts.generator.js'
import {Analyzed, AnalyzedStoryChunk, Dict} from './types.generator.js'

function getAnalyzedStoryChunk(
	text: string,
	translation: string,
	globalDict: Dict,
	tokenRes: Analyzed
): AnalyzedStoryChunk {
	const {dict: resDict, tokens} = tokenRes
	return {
		paragraph: {
			text,
			translation,
			tokens
		},
		dict: {...globalDict, ...resDict}
	}
}

function isTranslationStart(char: string): boolean {
	return char === '('
}

function isEndOfSentence(char: string): boolean {
	return char === ')'
}

export async function* generateAnalizadStoryStream(
	prompt: string
): AsyncGenerator<AnalyzedStoryChunk> {
	const generated = generateText({
		prompt,
		systemInstructions: generateStoryInstructions
	})
	let currentText = ''
	let currentTranslation = ''
	let inText = true
	let globalDict: Dict = {}

	for await (const chunk of generated) {
		for (const char of chunk) {
			if (char === '\n') continue
			if (isTranslationStart(char)) {
				inText = false
				continue
			}
			if (isEndOfSentence(char)) {
				inText = true
				const analyzeRes = await analyzeText(currentText)

				const res = getAnalyzedStoryChunk(
					currentText,
					currentTranslation,
					globalDict,
					analyzeRes
				)
				globalDict = res.dict
				currentText = ''
				currentTranslation = ''

				yield res

				continue
			}

			if (inText) {
				currentText += char
				continue
			}
			currentTranslation += char
		}
	}
}
