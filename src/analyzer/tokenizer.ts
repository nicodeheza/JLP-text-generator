import {tokenize, Token as MecabToken} from '@enjoyjs/node-mecab'
import {getFurigana, haveKanji, katakaToHiragana} from './utils.js'
import {dictLookup, DictWord} from './dict.js'

const noWord = new Set(['記号', 'BOS/EOS'])

export type Token =
	| {
			original: string
			isWord: true
			basicForm: string
			mecabPos: string
			furigana?: string
			dictIds: string[]
	  }
	| {
			original: string
			isWord: false
	  }

export type Dict = {[id: string]: Omit<DictWord, 'id'>}

export interface TokenizationRes {
	tokens: Token[]
	dict: Dict
}

export async function tokenizeText(text: string): Promise<TokenizationRes> {
	const result: MecabToken[] = await tokenize(text)

	let dict: Dict = {}
	const tokens: Token[] = []

	for (const mecabToken of result) {
		const {basicForm} = mecabToken.feature
		const pos = getPos(mecabToken)
		const isWord = mecabToken.feature.pos && pos && !noWord.has(mecabToken.feature.pos)

		if (isWord) {
			const {ids, dict: dictRes} = await getDictWords(
				basicForm ?? mecabToken.surface,
				pos
			)
			dict = {...dict, ...dictRes}
			const token: Token = {
				isWord: true,
				original: mecabToken.surface,
				mecabPos: pos,
				basicForm: basicForm ?? '',
				furigana: mecabToFurigana(mecabToken.surface, mecabToken.feature.reading ?? ''),
				dictIds: ids
			}
			tokens.push(token)

			continue
		}

		const token: Token = {
			isWord: false,
			original: mecabToken.surface
		}

		tokens.push(token)
	}

	return {dict, tokens}
}

function getPos(token: MecabToken) {
	if (!token.feature.pos) return
	return token.feature.pos
}

async function getDictWords(word: string, pos: string) {
	const res = await dictLookup(word, pos)

	const ids = res.map((r) => r.id)

	const dict = res.reduce((acc, r) => {
		const {id, ...rest} = r
		return {
			...acc,
			[r.id]: rest
		}
	}, {} as Dict)

	return {ids, dict}
}

function mecabToFurigana(original: string, katakana: string): string | undefined {
	if (!haveKanji(original)) return
	const reading = katakaToHiragana(katakana)
	return getFurigana(original, reading)
}
