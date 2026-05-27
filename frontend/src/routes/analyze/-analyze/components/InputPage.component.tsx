import {useState, type FC, type FormEvent} from 'react'
import {Button} from '../../../../components/Button/Button.component'
import styles from './InputPage.module.css'
import {Card} from '../../../../components/Card/Card.component'
import {Icon} from '../../../../components/Icon/Icons.component'

interface Props {
	onSubmit: (text: string) => void
}

export const InputPage: FC<Props> = ({onSubmit}) => {
	const [text, setText] = useState('')

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		onSubmit(text)
	}

	return (
		<Card>
			<form onSubmit={handleSubmit}>
				<textarea
					className={styles.textarea}
					name="text"
					id="text"
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="Insert your Japanese text"
					required
				/>
				<div className={styles.buttonContainer}>
					<Button type="submit">
						Analice text <Icon icon="chart" />
					</Button>
				</div>
			</form>
		</Card>
	)
}
