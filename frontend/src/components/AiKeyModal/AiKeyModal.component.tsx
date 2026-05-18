import {
	forwardRef,
	useRef,
	useImperativeHandle,
	useState,
	useMemo,
	useEffect
} from 'react'
import {Modal} from '../Modal/Modal.component'
import {Button} from '../Button/Button.component'
import {useGetIsAiSetUp, useSetAiKey, useDeleteAiKey} from '../../services/user.service'
import styles from './AiKeyModal.module.css'

const PLACEHOLDER_KEY = 'placeholder-api-key'

export interface AiKeyModalHandle {
	open: () => void
	close: () => void
}

export const AiKeyModal = forwardRef<AiKeyModalHandle>((_, ref) => {
	const dialogRef = useRef<HTMLDialogElement>(null)

	useImperativeHandle(ref, () => ({
		open: () => dialogRef.current?.showModal(),
		close: () => handleClose()
	}))

	const isAiSetUpRes = useGetIsAiSetUp()
	const {res: setRes, setKey, reset: resetSet} = useSetAiKey()
	const {res: deleteRes, deleteKey, reset: resetDelete} = useDeleteAiKey()

	const isAiSetUp = isAiSetUpRes.status === 'success' && isAiSetUpRes.data === true
	const isLoading = setRes.status === 'loading' || deleteRes.status === 'loading'

	const [inputValue, setInputValue] = useState(isAiSetUp ? PLACEHOLDER_KEY : '')
	useEffect(() => {
		setInputValue(isAiSetUp ? PLACEHOLDER_KEY : '')
	}, [isAiSetUp])

	function handleClose() {
		dialogRef.current?.close()
		resetDelete()
		resetSet()
	}

	function handleSave() {
		if (inputValue && inputValue !== PLACEHOLDER_KEY) {
			setKey(inputValue)
			setInputValue(PLACEHOLDER_KEY)
		}
	}

	function handleDelete() {
		deleteKey()
		setInputValue('')
	}

	const statusMessage = useMemo(() => {
		if (setRes.status === 'loading' || deleteRes.status === 'loading') {
			return {type: 'loading', text: 'Loading...'}
		}
		if (setRes.status === 'success') {
			return {type: 'success', text: 'API key saved successfully.'}
		}
		if (deleteRes.status === 'success') {
			return {type: 'success', text: 'API key deleted.'}
		}
		if (setRes.status === 'error') {
			return {type: 'error', text: setRes.error.message}
		}
		if (deleteRes.status === 'error') {
			return {type: 'error', text: deleteRes.error.message}
		}
		return null
	}, [setRes, deleteRes])

	return (
		<Modal ref={dialogRef} onClose={handleClose} className={styles.modal}>
			<div className={styles.header}>
				<h2 className={styles.title}>AI API Key</h2>
				<button className={styles.closeButton} onClick={handleClose} aria-label="Close">
					×
				</button>
			</div>

			<div className={styles.body}>
				<input
					className={styles.input}
					type="password"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="Enter your API key"
					disabled={isLoading}
				/>

				{statusMessage && (
					<p className={styles[statusMessage.type]}>{statusMessage.text}</p>
				)}
			</div>

			<div className={styles.footer}>
				<Button
					onClick={handleSave}
					disabled={isLoading || !inputValue || inputValue === PLACEHOLDER_KEY}
				>
					Save
				</Button>
				{isAiSetUp && (
					<Button variant="secondary" onClick={handleDelete} disabled={isLoading}>
						Delete key
					</Button>
				)}
				<Button variant="secondary" onClick={handleClose} disabled={isLoading}>
					Cancel
				</Button>
			</div>
		</Modal>
	)
})
