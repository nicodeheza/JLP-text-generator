import {Link} from '@tanstack/react-router'
import styles from './Header.module.css'
import type {ComponentProps, FC} from 'react'
import {useRef} from 'react'
import {AiKeyModal} from '../AiKeyModal/AiKeyModal.component'
import type {AiKeyModalHandle} from '../AiKeyModal/AiKeyModal.component'
import {Button} from '../Button/Button.component'
import {Logo} from '../Logo/Logo'

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
			<Button variant="secondary" onClick={() => aiKeyModalRef.current?.open()}>
				AI Settings
			</Button>
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
