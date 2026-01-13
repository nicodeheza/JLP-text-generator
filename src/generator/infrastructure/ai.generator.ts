import {aiStreamResponse} from '../../infrastructure/Ai/index.ai.js'
import {AiStreamingResponse, AiTextGenerationArgs} from '../types.generator.js'

export function generateText(args: AiTextGenerationArgs): AiStreamingResponse {
	return aiStreamResponse(args)
}
