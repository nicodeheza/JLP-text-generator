import type { TokenRes, Dict } from '../../../types/analyzedText.types'

export interface PdfData {
  totalPages: number
  name: string
}

interface Box {
  x: number
  y: number
  w: number
  h: number
}

export interface OcrResult {
  text: string
  box: Box
}

export interface AnalyzedOcrResult {
  data: {
    tokens: TokenRes[]
    box: Box
  }[]
  dict: Dict
}

export type OcrPages = Record<number, AnalyzedOcrResult['data']>
