export const CONFIG = {
  API_URL: import.meta.env.VITE_API || `${window.location.protocol}//${window.location.host}/api`,
} as const
