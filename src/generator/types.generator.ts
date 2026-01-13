export type AiStreamingResponse = AsyncGenerator<string>
export interface AiTextGenerationArgs {
	prompt: string
	systemInstructions: string
}
