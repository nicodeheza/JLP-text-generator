import {useRef, useState, type ChangeEvent, type FC} from 'react'
import {FileInput} from '../../../../../components/FileInput/FileInput.component'
import {Button} from '../../../../../components/Button/Button.component'
import styles from './PdfBar.module.css'
import {Icon} from '../../../../../components/Icon/Icons.component'

interface Props {
	file?: File
	onFileSelected: (file: File) => void
	currentPage: number
	totalPages: number | undefined
	onPageChange: (newPage: number) => void
	onOcr: () => void
	ocrReady?: boolean
	ocrLoading?: boolean
}

export const PdfBar: FC<Props> = ({
	file,
	onFileSelected,
	currentPage = 1,
	totalPages,
	onPageChange,
	onOcr,
	ocrReady = false,
	ocrLoading = false
}) => {
	const [inputValue, setInputValue] = useState(String(currentPage))
	const timeout = useRef<NodeJS.Timeout>(null)

	const handleFileSelected = (file: File) => {
		setInputValue('1')
		onFileSelected(file)
	}

	const onPrev = () => {
		const prevPage = Math.max(currentPage - 1, 1)
		onPageChange(prevPage)
		setInputValue(String(prevPage))
	}

	const onNext = () => {
		if (!totalPages) return
		const nextPage = Math.min(currentPage + 1, totalPages)
		onPageChange(nextPage)
		setInputValue(String(nextPage))
	}

	const onPageInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (timeout.current) clearTimeout(timeout.current)
		setInputValue(e.target.value)

		timeout.current = setTimeout(() => {
			if (e.target.value) onPageChange(Number(e.target.value))
		}, DEBOUNCE_TIME)
	}

	return (
		<div className={styles.bar}>
			<FileInput file={file} onFileChange={handleFileSelected} accept={'application/pdf'}>
				Upload a PDF
			</FileInput>
			<Button
				variant="secondary"
				disabled={!file || !ocrReady || ocrLoading}
				onClick={onOcr}
			>
				<Icon icon="lightning" /> {ocrLoading ? 'Loading OCR' : 'Run OCR'}
			</Button>
			<Pages
				inputValue={inputValue}
				totalPages={totalPages}
				onPrev={onPrev}
				onNext={onNext}
				onPageInputChange={onPageInputChange}
			/>
		</div>
	)
}

interface PagesProps {
	inputValue: string
	totalPages: number | undefined
	onPrev: () => void
	onNext: () => void
	onPageInputChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const Pages: FC<PagesProps> = ({
	inputValue,
	totalPages,
	onPrev,
	onNext,
	onPageInputChange
}) => {
	return (
		<div className={styles.pageSelect}>
			<Button variant="transparent" disabled={!totalPages} onClick={onPrev}>
				<Icon icon="chevron-left" />
			</Button>
			<input
				aria-label="Page"
				disabled={!totalPages}
				type="number"
				value={inputValue}
				onChange={onPageInputChange}
			/>
			{'/'}
			<output aria-label="Total pages">{totalPages ?? 0}</output>
			<Button variant="transparent" disabled={!totalPages} onClick={onNext}>
				<Icon icon="chevron-right" />
			</Button>
		</div>
	)
}

const DEBOUNCE_TIME = 500
