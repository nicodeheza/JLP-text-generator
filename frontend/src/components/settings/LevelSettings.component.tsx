import type {FC} from 'react'
import type {JlptLevel} from '../../types/Settings.types'
import {OptionsSelect} from '../shared/OptionsSelect.component'
import styles from './FuriganaSettinga.module.css'

const LEVEL_OPTIONS: Record<string, JlptLevel> = {
	N5: 'N5',
	N4: 'N4',
	N3: 'N3',
	N2: 'N2',
	N1: 'N1',
}

interface LevelSettingsProps {
	value: JlptLevel
	onChange: (v: JlptLevel) => void
}

export const LevelSettings: FC<LevelSettingsProps> = ({value, onChange}) => {
	return (
		<div className={styles.container}>
			<p>Level:</p>
			<OptionsSelect
				name="level"
				options={LEVEL_OPTIONS}
				value={value}
				onChange={onChange}
				variant="pills"
			/>
		</div>
	)
}
