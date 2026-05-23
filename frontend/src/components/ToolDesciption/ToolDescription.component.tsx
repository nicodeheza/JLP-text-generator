import type {FC} from 'react'
import styles from './ToolDesciption.module.css'

interface Props {
	title: string
	descriptions: string
}

export const ToolDescription: FC<Props> = ({title, descriptions}) => {
	return (
		<div className={styles.container}>
			<h1>{title}</h1>
			<p>{descriptions}</p>
		</div>
	)
}
