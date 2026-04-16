import {useState} from 'react'
import type {JlptLevel} from '../../../types/Settings.types'
import {SelectedLevelStorage} from './TextGenerator.storage'

export function useSelectedLevel(): [JlptLevel, (v: JlptLevel) => void] {
	const [level, setLevelState] = useState<JlptLevel>(
		() => SelectedLevelStorage.getData() ?? 'N5'
	)

	const setLevel = (v: JlptLevel) => {
		setLevelState(v)
		SelectedLevelStorage.saveData(v)
	}

	return [level, setLevel]
}
