import {GoogleGenAI, type Models} from '@google/genai'

interface RespondArgs {
	prompt: string
	temperature?: number
}

export class Ai {
	private static models: Models | undefined
	private static model = 'gemma-3-27b-it'

	static async setup() {
		if (Ai.models) return
		const client = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})
		Ai.models = client.models
	}

	private static getModel() {
		if (!Ai.models) throw new Error('No model, run setup')
		return Ai.models
	}

	//no stream
	static async directRespond({prompt, temperature}: RespondArgs): Promise<string> {
		const models = Ai.getModel()
		const res = await models.generateContent({
			model: Ai.model,
			contents: prompt,
			config: {
				temperature
			}
		})
		return res.text || ''
	}

	static async *streamingResponse({
		prompt,
		temperature
	}: RespondArgs): AsyncGenerator<string> {
		const models = Ai.getModel()
		const res = await models.generateContentStream({
			model: Ai.model,
			contents: prompt,
			config: {
				temperature
			}
		})

		for await (const chunk of res) {
			yield chunk.text || ''
		}
	}
}

export function aiDirectResponse(args: RespondArgs) {
	return Ai.directRespond(args)
}

export async function* aiSteamResponse(args: RespondArgs): AsyncGenerator<string> {
	const res = Ai.streamingResponse(args)

	for await (const chunk of res) {
		yield chunk
	}
}
