import classNames from 'classnames'
import type {FC, ButtonHTMLAttributes} from 'react'
import styles from './Button.module.css'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary'
}

export const Button: FC<Props> = (props) => {
	const {className, variant = 'primary', ...otherProps} = props

	const variantClass = {
		[styles.primary]: variant === 'primary',
		[styles.secondary]: variant === 'secondary'
	}

	return (
		<button
			className={classNames(styles.button, variantClass, className)}
			{...otherProps}
		/>
	)
}
