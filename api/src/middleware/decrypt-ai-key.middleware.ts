import { Request, Response, NextFunction } from 'express'
import { decryptApiKey } from '../user/index.js'

export type AiKeyLocals = {
  aiKey: string
}

export function decryptAiKeyMiddleware(
  req: Request,
  res: Response<any, AiKeyLocals>,
  next: NextFunction
): void {
  const encrypted = req.cookies?.['ai_key']

  if (!encrypted) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    res.locals.aiKey = decryptApiKey(encrypted)
    next()
  } catch {
    res.status(401).json({ error: 'Unauthorized' })
  }
}
