import type {FC} from 'react'
import {useStingsStore} from '../../store/Settings.store'
import type {FuriganaValues} from '../../types/Settings.types'
import {OptionsSelect} from '../shared/OptionsSelect.component'
import styles from './FuriganaSettinga.module.css'

const FURIGANA_OPTIONS: Record<string, FuriganaValues> = {
	Show: 'enable',
	Hide: 'disable',
	Hover: 'hover'
}

export const FuriganaSettings: FC = () => {
	const {updateFurigana, furigana} = useStingsStore()

	return (
		<div className={styles.container}>
			<p>Furigana</p>
			<OptionsSelect
				name="furigana"
				options={FURIGANA_OPTIONS}
				value={furigana}
				onChange={updateFurigana}
				variant="rectangle"
			/>
		</div>
	)
}
