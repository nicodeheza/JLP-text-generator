import {useRef, useCallback, type FC} from 'react'
import {PdfBar} from './components/pdf-bar/PdfBar.component'
import {PdfPage, type PageApi} from './components/pdf-page/PdfPage.component'
import {
	useLoadPdf,
	useFile,
	useCurrentPage,
	useStoreHydration
} from './services/pdf.service'
import {useLoadOcr, useOcrDetect} from './services/ocr.service'
import styles from './PdfOcr.module.css'
import {useZoom} from './hooks/useZoom.hook'
import {FuriganaSettings} from '../../../components/settings/FuriganaSettings.component'
import {ToolDescription} from '../../../components/ToolDescription/ToolDescription.component'
import {ErrorMessage} from '../../../components/ErrorMessage/ErrorMessage.component'
import {LoadingDots} from '../../../components/LoadingDots/LoadingDots.component'

export const PdfOcr: FC = () => {
	const pageRef = useRef<PageApi>(null)
	const {file, setFile} = useFile()
	const {currentPage, setCurrentPage} = useCurrentPage()

	const {
		loadPdf,
		data: loadPdfData,
		status: loadPdfStatus,
		error: loadPdfError
	} = useLoadPdf()

	const {status: ocrLoadStatus, error: ocrLoadingError} = useLoadOcr()
	const {detect, status: ocrStatus, data: ocrData, dict} = useOcrDetect()
	const {isHydrating: isStoreLoading, error: storeError} = useStoreHydration()
	const {zoom} = useZoom()

	const handleFileSelected = useCallback(
		(file: File) => {
			setFile(file)
			loadPdf(file)
		},
		[setFile, loadPdf]
	)

	const handleOcr = () => {
		const image = pageRef.current?.getPageImage()
		if (!image) return
		detect(image, currentPage)
	}

	if (ocrLoadStatus === 'error' || storeError)
		return (
			<ErrorMessage
				message={
					ocrLoadingError?.message || storeError?.message || 'Error loading OCR engin'
				}
			/>
		)
	if (ocrLoadStatus === 'loading' || isStoreLoading) return <LoadingDots />

	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<ToolDescription
					title="PDF OCR"
					descriptions="Upload a scanned PDF to extract text and analyze vocabulary with furigana. (Only support horizontal text)"
				/>
				<FuriganaSettings />
			</div>
			<PdfBar
				file={file}
				onFileSelected={handleFileSelected}
				currentPage={currentPage}
				totalPages={loadPdfData?.totalPages}
				onPageChange={setCurrentPage}
				onOcr={handleOcr}
				ocrReady={ocrLoadStatus === 'success'}
				ocrLoading={ocrStatus === 'loading'}
			/>
			<div className={styles.viewport}>
				{(() => {
					switch (loadPdfStatus) {
						case 'idle':
							return <p>Please upload a PDF</p>
						case 'loading':
							return <p>Loading...</p>
						case 'error':
							return <p>{loadPdfError.message}</p>
						case 'success':
							return (
								<PdfPage
									pageNumber={currentPage}
									ref={pageRef}
									ocrResults={ocrData[currentPage]}
									dict={dict}
									zoom={zoom}
								/>
							)
					}
				})()}
			</div>
		</div>
	)
}
