import {GenerateContentParameters, GoogleGenAI, type Models} from '@google/genai'

interface RespondArgs {
	prompt: string
	temperature?: number
	model?: string
	systemInstructions?: string
}

const MODELS_WITH_NOT_SYSTEM_INSTRUCTIONS = new Set(['gemma-3-27b-it'])
const DEFAULT_MODEL = 'gemma-3-27b-it'

class Ai {
	private models: Models

	constructor(apiKey: string) {
		const client = new GoogleGenAI({apiKey})
		this.models = client.models
	}

	private supportSystemInstructions(model: string): boolean {
		return !MODELS_WITH_NOT_SYSTEM_INSTRUCTIONS.has(model)
	}

	private concatenatePromptWithSystem(prompt: string, system?: string): string {
		if (!system) return prompt

		return `${system}
		This is the user prompt:
		${prompt} 
		`
	}

	private getParameters(args: RespondArgs): GenerateContentParameters {
		const model = args.model ?? DEFAULT_MODEL
		const supportSystemInstructions = this.supportSystemInstructions(model)
		const systemInstruction = supportSystemInstructions
			? args.systemInstructions
			: undefined
		return {
			model,
			contents: supportSystemInstructions
				? args.prompt
				: this.concatenatePromptWithSystem(args.prompt, args.systemInstructions),
			config: {
				temperature: args.temperature,
				systemInstruction
			}
		}
	}

	async directRespond(args: RespondArgs): Promise<string> {
		const res = await this.models.generateContent(this.getParameters(args))
		return res.text || ''
	}

	async *streamingResponse(args: RespondArgs): AsyncGenerator<string> {
		const res = await this.models.generateContentStream(this.getParameters(args))

		for await (const chunk of res) {
			yield chunk.text || ''
		}
	}

	async validateApiKey(): Promise<boolean> {
		try {
			await this.models.list()
			return true
		} catch (error: unknown) {
			if (isRateLimitError(error)) return true
			return false
		}
	}
}

function isRateLimitError(error: unknown): boolean {
	if (!error || typeof error !== 'object') return false
	// @google/genai surfaces the HTTP status on the error object
	if ('status' in error && error.status === 429) return true
	if (
		'message' in error &&
		typeof error.message === 'string' &&
		error.message.includes('429')
	)
		return true
	return false
}

// TODO: remove createAi and update aiDirectResponse/aiStreamResponse to receive apiKey
// once all callers are updated to pass the key through the new flow
function createAi(): Ai {
	const apiKey = process.env.GEMINI_API_KEY
	if (!apiKey) throw new Error('GEMINI_API_KEY is not set')
	return new Ai(apiKey)
}

export function aiDirectResponse(args: RespondArgs) {
	return createAi().directRespond(args)
}

export async function* aiStreamResponse(args: RespondArgs): AsyncGenerator<string> {
	const ai = createAi()
	const res = ai.streamingResponse(args)

	for await (const chunk of res) {
		yield chunk
	}
}

export function validateApiKey(apiKey: string): Promise<boolean> {
	const ai = new Ai(apiKey)
	return ai.validateApiKey()
}
