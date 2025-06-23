export const CONFIG = {
	PORT: process.env.NODE_ENV === 'production' ? process.env.PORT : '4000',
	IS_PROD: process.env.NODE_ENV === 'production'
} as const
