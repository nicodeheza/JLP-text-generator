import type {FC} from 'react'
import {Icon} from '../Icon/Icons.component'
import styles from './ErrorMessage.module.css'

interface Props {
	message: string
}

export const ErrorMessage: FC<Props> = ({message}) => {
	return (
		<div className={styles.error}>
			<div className={styles.message}>
				<Icon icon="error-circle" />
				<p>{message}</p>
			</div>
			<button className={styles.refreshButton} onClick={() => window.location.reload()}>
				Refresh page
			</button>
		</div>
	)
}
