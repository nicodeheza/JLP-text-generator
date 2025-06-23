export const CONFIG = {
	API_URL: import.meta.env.DEV
		? import.meta.env.VITE_DEV_API
		: import.meta.env.VITE_PROD_API
} as const
