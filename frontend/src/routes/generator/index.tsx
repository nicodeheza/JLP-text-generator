import {createFileRoute} from '@tanstack/react-router'
import {TextGenerator} from './-text-generator/TextGenerator.view'
import {AiPage} from '../../components/AiPage/AiPage.component'

export const Route = createFileRoute('/generator/')({
	component: RouteComponent
})

function RouteComponent() {
	return (
		<AiPage explanation={'Enter a prompt and choose a difficulty level to generate Japanese text. The AI will create annotated text with furigana, translations, and dictionary definitions on word click.'}>
			<TextGenerator />
		</AiPage>
	)
}
