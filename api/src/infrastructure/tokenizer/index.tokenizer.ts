import {tokenize as mecabTokenize, Token} from '@enjoyjs/node-mecab'

export type MecabToken = Pick<Token, 'id' | 'surface' | 'feature'>

export const tokenize = (text: string): Promise<MecabToken[]> => mecabTokenize(text)
