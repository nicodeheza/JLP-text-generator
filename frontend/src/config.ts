export const CONFIG = {
	API_URL: import.meta.env.DEV
		? import.meta.env.VITE_DEV_API
		: `${window.location.protocol}//${window.location.host}/api`
} as const
