function requireEnv(name: string): string {
	const value = process.env[name]
	if (!value) throw new Error(`Missing required environment variable: ${name}`)
	return value
}

export const CONFIG = {
	PORT: process.env.NODE_ENV === 'production' ? process.env.PORT : '4000',
	IS_PROD: process.env.NODE_ENV === 'production',
	AI_KEY_SECRET: requireEnv('AI_KEY_SECRET'),
	FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:5173'
} as const
