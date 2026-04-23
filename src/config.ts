function requireEnv(name: string): string {
	const value = process.env[name]
	if (!value) throw new Error(`Missing required environment variable: ${name}`)
	return value
}

export const CONFIG = {
	PORT: process.env.NODE_ENV === 'production' ? process.env.PORT : '4000',
	IS_PROD: process.env.NODE_ENV === 'production',
	COOKIE_SECRET: requireEnv('COOKIE_SECRET')
} as const
