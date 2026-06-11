import type { FC } from 'react'
import type { JLPTLevel } from '../../types/Settings.types'
import { OptionsSelect } from '../shared/OptionsSelect.component'
import { SettingLabel } from './SettingLabel/SettigLabel.component'

const LEVEL_OPTIONS: Record<string, JLPTLevel> = {
  N5: 'N5',
  N4: 'N4',
  N3: 'N3',
  N2: 'N2',
  N1: 'N1',
}

interface LevelSettingsProps {
  value: JLPTLevel
  onChange: (v: JLPTLevel) => void
}

export const LevelSettings: FC<LevelSettingsProps> = ({ value, onChange }) => {
  return (
    <SettingLabel label="level">
      <OptionsSelect
        name="level"
        options={LEVEL_OPTIONS}
        value={value}
        onChange={onChange}
        variant="pills"
      />
    </SettingLabel>
  )
}
