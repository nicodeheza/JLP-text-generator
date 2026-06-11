import { CONFIG } from '../config'
import { post } from './base.api'
import type { AnalyzeRes, BulkAnalyzeRes } from '@ja-tools/share-types'

export function getTextAnalyzeRes(text: string): Promise<AnalyzeRes> {
  return post<AnalyzeRes>(
    `${CONFIG.API_URL}/analyze`,
    { text },
    { default: 'Error getting analyzed text' }
  )
}

export function getBulkTextAnalyzedRes(texts: string[]): Promise<BulkAnalyzeRes> {
  return post<BulkAnalyzeRes>(`${CONFIG.API_URL}/analyze/bulk`, texts, {
    default: 'Error getting analyzed text',
  })
}
