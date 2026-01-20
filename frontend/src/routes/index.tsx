import {createFileRoute, redirect} from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: RouteComponent,
	beforeLoad: () => {
		return redirect({to: '/generator'})
	}
})

function RouteComponent() {
	return <div />
}
