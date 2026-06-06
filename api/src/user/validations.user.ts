import { AiAuthBody } from './types.user.js'

export function isValidAiAuthBody(body: unknown): body is AiAuthBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    'apiKey' in body &&
    typeof body.apiKey === 'string' &&
    body.apiKey.trim() !== ''
  )
}
