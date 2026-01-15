import {tokenize} from '../../tokenizer/tokenizer.js'
import {TokenizerToken} from '../types.analyzer.js'

export function tokenizeText(text: string): Promise<TokenizerToken[]> {
	return tokenize(text)
}
