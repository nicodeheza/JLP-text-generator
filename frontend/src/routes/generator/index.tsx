import {createFileRoute} from '@tanstack/react-router'
import {TextGenerator} from './-text-generator/TextGenerator.view'

export const Route = createFileRoute('/generator/')({
	component: RouteComponent
})

function RouteComponent() {
	return <TextGenerator />
}
