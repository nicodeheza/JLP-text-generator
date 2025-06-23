import {create} from 'zustand'
import type {FuriganaValues} from '../types/Settings.types'
import {getFurigana, saveSettings} from './Settings.storage'

interface SettingsStore {
	furigana: FuriganaValues
	updateFurigana: (newState: FuriganaValues) => void
}

const useStore = create<SettingsStore>((set) => ({
	furigana: getFurigana(),
	updateFurigana: (newState) => {
		const update = {furigana: newState}
		saveSettings(update)
		set(update)
	}
}))
export function useStingsStore() {
	return useStore((store) => store)
}
