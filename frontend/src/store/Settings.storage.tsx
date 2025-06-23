import type {FuriganaValues} from '../types/Settings.types'

const savedSettingsKey = '_settings'
type SavedSettings = Partial<{
	furigana: FuriganaValues
}>

function getSettings(): SavedSettings | undefined {
	const settingsJson = localStorage.getItem(savedSettingsKey)
	return settingsJson && JSON.parse(settingsJson)
}
export function saveSettings(update: SavedSettings) {
	const settings: SavedSettings = getSettings() || {}

	const newSettings = {
		...settings,
		...update
	}

	localStorage.setItem(savedSettingsKey, JSON.stringify(newSettings))
}

export function getFurigana(): FuriganaValues {
	const settings = getSettings()

	return settings?.furigana || 'enable'
}
