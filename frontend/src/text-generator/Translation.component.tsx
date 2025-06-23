import {useState, type FC} from 'react'
import {Button} from '../components/Button/Button.component'
import styles from './Translation.module.css'

interface Props {
	translation: string
}

export const Translation: FC<Props> = ({translation}) => {
	const [show, setShow] = useState(false)

	const onToggle = () => {
		setShow((prev) => !prev)
	}

	const buttonLabel = show ? 'Hide Translation' : 'Show Translation'

	return (
		<div className={styles.translation}>
			<Button onClick={onToggle} variant="secondary">
				{buttonLabel}
			</Button>
			{show && <p>{translation}</p>}
		</div>
	)
}
