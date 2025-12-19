import {tokenize as mecabTokenize, Token} from '@enjoyjs/node-mecab'

export type MecabToken = Token

export const tokenize = (text: string) => mecabTokenize(text)
