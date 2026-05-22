import styles from './Logo.module.css'

export const Logo = () => {
	return (
		<div className={styles.logo}>
			<div className={styles.circle} />
			<span className={styles.ja}>ja</span> <span>tools</span>
		</div>
	)
}
