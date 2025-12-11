import {Dict, Token, TokenizationRes, tokenizeText} from '../analyzer/tokenizer.js'
import {aiSteamResponse} from './Ai.js'
import {getGenerateStoryPrompt} from './prompts.js'

interface AnalyzedStoryChunk {
	paragraph: {
		text: string
		translation: string
		tokens: Token[]
	}
	dict: Dict
}

function getAnalyzedStoryChunk(
	text: string,
	translation: string,
	globalDict: Dict,
	tokenRes: TokenizationRes
): AnalyzedStoryChunk {
	const {dict: resDict, tokens} = tokenRes
	let currentDict: Dict = {}

	for (const prop in resDict) {
		if (globalDict[prop]) continue
		currentDict = {...currentDict, [prop]: resDict[prop]}
	}

	return {
		paragraph: {
			text,
			translation,
			tokens
		},
		dict: currentDict
	}
}

export async function* generateAnalizadStoryStream(
	prompt: string
): AsyncGenerator<AnalyzedStoryChunk> {
	const generated = aiSteamResponse({
		prompt: getGenerateStoryPrompt(prompt)
	})
	let currentText = ''
	let currentTranslation = ''
	let inText = true
	let globalDict: Dict = {}

	for await (const chunk of generated) {
		for (const char of chunk) {
			if (char === '\n') continue
			if (char === '(') {
				inText = false
				continue
			}
			if (char === ')') {
				inText = true
				const tokenRes = await tokenizeText(currentText)

				const res = getAnalyzedStoryChunk(
					currentText,
					currentTranslation,
					globalDict,
					tokenRes
				)
				globalDict = {...globalDict, ...tokenRes.dict}
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
