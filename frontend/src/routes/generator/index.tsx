import { createFileRoute } from '@tanstack/react-router'
import { TextGenerator } from './-text-generator/TextGenerator.view'
import { AiPage } from '../../components/AiPage/AiPage.component'

export const Route = createFileRoute('/generator/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AiPage
      toolTitle="Generate Text"
      toolDescription="Generate level-appropriate Japanese reding material with AI."
    >
      <TextGenerator />
    </AiPage>
  )
}
