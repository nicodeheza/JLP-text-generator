import type {
  JLPTLevel,
  Word,
  Sense,
  Dict,
  Token,
  AnalyzeRes,
  Paragraph,
  AnalyzedStoryChunk,
} from '@ja-tools/share-types'

export type {
  JLPTLevel,
  Word,
  Sense,
  Dict,
  Token,
  AnalyzeRes as Analyzed,
  Paragraph,
  AnalyzedStoryChunk,
}

export type AiStreamingResponse = AsyncGenerator<string>
export interface AiTextGenerationArgs {
  prompt: string
  systemInstructions: string
}

export const VALID_LEVELS = ['N1', 'N2', 'N3', 'N4', 'N5'] as const
