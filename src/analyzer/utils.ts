import {isKanji, toHiragana} from 'wanakana'
import {fit} from 'furigana'

export function katakaToHiragana(katakana: string): string {
	return toHiragana(katakana, {passRomaji: true})
}

export function haveKanji(text: string): boolean {
	return text.split('').some((c) => isKanji(c))
}

export function getFurigana(original: string, reading: string): string {
	return fit(original, reading) || ''
}
