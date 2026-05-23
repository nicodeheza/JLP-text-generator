import type {FC} from 'react'
import styles from './LoadingDots.module.css'

export const LoadingDots: FC = () => (
	<div className={styles.status}>
		<span className={styles.dot} />
		<span className={styles.dot} />
		<span className={styles.dot} />
	</div>
)
