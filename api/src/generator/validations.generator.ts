import { JLPTLevel, VALID_LEVELS } from './types.generator.js'

export function isValidJLPTLevel(value: unknown): value is JLPTLevel {
  return typeof value === 'string' && VALID_LEVELS.some((level) => level === value)
}
