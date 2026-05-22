import {Link} from '@tanstack/react-router'
import styles from './Header.module.css'
import type {ComponentProps, FC} from 'react'
import {useRef} from 'react'
import {AiKeyModal} from '../AiKeyModal/AiKeyModal.component'
import type {AiKeyModalHandle} from '../AiKeyModal/AiKeyModal.component'
import {Button} from '../Button/Button.component'
import {Logo} from '../Logo/Logo'
import {Icon} from '../Icon/Icons.component'
import {ThemeToggle} from '../ThemeToggel/ThemToggle.component'

export const Header: FC = () => {
	const aiKeyModalRef = useRef<AiKeyModalHandle>(null)

	return (
		<header className={styles.header}>
			<Logo />
			<nav className={styles.nav}>
				<NavLink to={'/generator'}>Generate Text</NavLink>
				<NavLink to={'/analyze'}>Analyze Text</NavLink>
				<NavLink to={'/pdf-ocr'}>PDF OCR</NavLink>
			</nav>
			<div className={styles.right}>
				<Button variant="secondary" onClick={() => aiKeyModalRef.current?.open()}>
					<Icon icon="gear" /> AI Settings
				</Button>
				<ThemeToggle />
				<a
					href="https://github.com/nicodeheza/ja-tools"
					target="_blank"
					rel="noopener noreferrer"
					className={styles.gitHub}
				>
					<Icon icon="github" />
				</a>
			</div>
			<AiKeyModal ref={aiKeyModalRef} />
		</header>
	)
}

const NavLink: FC<ComponentProps<typeof Link>> = (props) => {
	return (
		<Link
			{...props}
			className={styles.link}
			activeProps={{
				className: styles.active
			}}
		/>
	)
}
