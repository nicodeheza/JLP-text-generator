import type {FC} from 'react'
import {useAnalyzedText} from './analyze.service'
import {InputPage} from './components/InputPage.component'
import {ResultPage} from './components/ResultPage.component'
import {ErrorMessage} from '../../../components/ErrorMessage/ErrorMessage.component'
import {LoadingDots} from '../../../components/LoadingDots/LoadingDots.component'
import {ToolDescription} from '../../../components/ToolDescription/ToolDescription.component'
import {FuriganaSettings} from '../../../components/settings/FuriganaSettings.component'

export const Analyze: FC = () => {
	const {status, data, error, analyzeText, removeData} = useAnalyzedText()

	if (status === 'loading') {
		return <LoadingDots />
	}

	if (status === 'error' && error) {
		return <ErrorMessage message={error.message} />
	}

	return (
		<>
			<div>
				<ToolDescription
					title="Analyze Text"
					descriptions="Insert Japanese text and get furigana and dictionary definitions."
				/>
				<FuriganaSettings />
			</div>

			{status === 'success' ? (
				<ResultPage data={data} onClear={removeData} />
			) : (
				<InputPage onSubmit={analyzeText} />
			)}
		</>
	)
}
