import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'
import { validateAiApiKey as validateAiApiKeyInfra } from './infrastructure/ai.user.js'
import { CONFIG } from '../config.js'

export function validateAiApiKey(apiKey: string): Promise<boolean> {
  return validateAiApiKeyInfra(apiKey)
}

export function encryptApiKey(apiKey: string): string {
  const key = Buffer.from(CONFIG.AI_KEY_SECRET, 'hex')
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)

  const encrypted = Buffer.concat([cipher.update(apiKey, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
}

export function decryptApiKey(encryptedApiKey: string): string {
  const [ivHex, authTagHex, encryptedHex] = encryptedApiKey.split(':')
  const key = Buffer.from(CONFIG.AI_KEY_SECRET, 'hex')
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const encrypted = Buffer.from(encryptedHex, 'hex')

  const decipher = createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(authTag)

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')
}
