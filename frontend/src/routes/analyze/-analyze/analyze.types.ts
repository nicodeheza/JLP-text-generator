import type { Dict } from '../../../types/analyzedText.types'
import type { TokenRes } from '../../../types/analyzedText.types'

export interface AnalyzeData {
  text: string
  tokens: TokenRes[]
  dict: Dict
}
