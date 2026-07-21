import type {
  Token,
  Word,
  Sense,
  Dict,
  AnalyzeRes,
  BulkAnalyzeRes,
  JLPTLevel,
  Paragraph,
  AnalyzedStoryChunk,
} from '@ja-tools/share-types'

export type {
  Token,
  Word,
  Sense,
  Dict,
  AnalyzeRes,
  BulkAnalyzeRes,
  JLPTLevel,
  Paragraph,
  AnalyzedStoryChunk,
}

export type TokenRes =
  | Omit<Extract<Token, { isWord: true }>, 'mecabPos'>
  | Extract<Token, { isWord: false }>

export interface WordToken {
  original: string
  isWord: true
  basicForm: string
  furigana?: string
  dictIds: string[]
}

export interface NoWordToken {
  original: string
  isWord: false
}
