import {GenerateContentParameters, GoogleGenAI, type Models} from '@google/genai'

interface RespondArgs {
	prompt: string
	temperature?: number
	model?: string
	systemInstructions?: string
}

const MODELS_WITH_NOT_SYSTEM_INSTRUCTIONS = new Set(['gemma-3-27b-it'])

class Ai {
	private static models: Models | undefined
	private static defaultModel = 'gemma-3-27b-it'

	static async setup() {
		if (Ai.models) return
		const client = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})
		Ai.models = client.models
	}

	private static getModel() {
		if (!Ai.models) throw new Error('No model, run setup')
		return Ai.models
	}

	private static supportSystemInstructions(model: string): boolean {
		return !MODELS_WITH_NOT_SYSTEM_INSTRUCTIONS.has(model)
	}

	private static concatenatePromptWithSystem(prompt: string, system?: string): string {
		if (!system) return prompt

		return `${system}
		This is the user prompt:
		${prompt} 
		`
	}

	private static getParameters(args: RespondArgs): GenerateContentParameters {
		const model = args.model ?? Ai.defaultModel
		const supportSystemInstructions = Ai.supportSystemInstructions(model)
		const systemInstruction = supportSystemInstructions
			? args.systemInstructions
			: undefined
		return {
			model,
			contents: supportSystemInstructions
				? args.prompt
				: Ai.concatenatePromptWithSystem(args.prompt, args.systemInstructions),
			config: {
				temperature: args.temperature,
				systemInstruction
			}
		}
	}

	//no stream
	static async directRespond(args: RespondArgs): Promise<string> {
		const models = Ai.getModel()
		const res = await models.generateContent(Ai.getParameters(args))
		return res.text || ''
	}

	static async *streamingResponse(args: RespondArgs): AsyncGenerator<string> {
		const models = Ai.getModel()
		const res = await models.generateContentStream(Ai.getParameters(args))

		for await (const chunk of res) {
			yield chunk.text || ''
		}
	}
}

export async function setupAi() {
	await Ai.setup()
}

export function aiDirectResponse(args: RespondArgs) {
	return Ai.directRespond(args)
}

export async function* aiStreamResponse(args: RespondArgs): AsyncGenerator<string> {
	const res = Ai.streamingResponse(args)

	for await (const chunk of res) {
		yield chunk
	}
}
