import type {FC, ReactNode} from 'react'
import {useStingsStore} from '../../store/Settings.store'
import type {FuriganaValues} from '../../types/Settings.types'
import styles from './FuriganaSettinga.module.css'

export const FuriganaSettings: FC = () => {
	return (
		<div className={styles.container}>
			<p>Furigana:</p>
			<div className={styles.radio}>
				<Option id="enable" value="enable">
					Show
				</Option>
				<Option id="disabled" value="disable">
					Hide
				</Option>
				<Option id="hover" value="hover">
					Hover
				</Option>
			</div>
		</div>
	)
}

interface OptionProps {
	children: ReactNode
	id: string
	value: FuriganaValues
}
const Option: FC<OptionProps> = ({children, id, value}) => {
	const {updateFurigana, furigana} = useStingsStore()

	const onChange = () => {
		updateFurigana(value)
	}
	return (
		<div>
			<input
				type="radio"
				name="furigana"
				id={id}
				value={value}
				checked={value === furigana}
				onChange={onChange}
			/>
			<label htmlFor={id}>{children}</label>
		</div>
	)
}
