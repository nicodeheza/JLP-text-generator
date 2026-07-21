import type {
  Token,
  Sense,
  Dict,
  AnalyzeRes,
  BulkAnalyzeRes,
  Word,
  JLPTLevel,
} from '@ja-tools/share-types'

export type { Token, Sense, Dict, AnalyzeRes, BulkAnalyzeRes, Word, JLPTLevel }

export type DictWord = Omit<Word, 'mecabPos'>

export interface TokenizerToken {
  feature: {
    basicForm?: string
    reading?: string
    pos?: string
  }
  surface: string
}
