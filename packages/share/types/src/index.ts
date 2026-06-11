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

export interface Word {
  id: string
  kana: string[]
  kanji: string[]
  sense: Sense[]
}

export interface Sense {
  pos: string[]
  gloss: string[]
}

export type Dict = { [id: string]: Omit<Word, 'id'> }

export interface AnalyzeRes {
  tokens: Token[]
  dict: Dict
}

export interface BulkAnalyzeRes {
  dict: Dict
  result: Token[][]
}

export interface Paragraph {
  text: string
  translation: string
  tokens: Token[]
}

export interface AnalyzedStoryChunk {
  paragraph: {
    text: string
    translation: string
    tokens: Token[]
  }
  dict: Dict
}

export type JLPTLevel = 'N1' | 'N2' | 'N3' | 'N4' | 'N5'
