import { useState } from 'react'
import type { JLPTLevel } from '../../../types/Settings.types'
import { SelectedLevelStorage } from './TextGenerator.storage'

export function useSelectedLevel(): [JLPTLevel, (v: JLPTLevel) => void] {
  const [level, setLevelState] = useState<JLPTLevel>(() => SelectedLevelStorage.getData() ?? 'N5')

  const setLevel = (v: JLPTLevel) => {
    setLevelState(v)
    SelectedLevelStorage.saveData(v)
  }

  return [level, setLevel]
}
