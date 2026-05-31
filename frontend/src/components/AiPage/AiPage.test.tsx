import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest'
import {render, screen, cleanup, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {AiPage} from './AiPage.component'
import {clearUserStore} from '../../store/User.store'
import * as userApi from '../../api/user.api'

vi.mock('../../api/user.api')

HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
	this.setAttribute('open', '')
})
HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
	this.removeAttribute('open')
})

describe('AiPage', () => {
	beforeEach(() => {
		clearUserStore()
		vi.mocked(userApi.getAiAuth).mockResolvedValue({auth: false})
		vi.mocked(userApi.setAiAuth).mockResolvedValue(undefined)
		vi.mocked(userApi.deleteAiAuth).mockResolvedValue(undefined)
	})

	afterEach(() => {
		cleanup()
		vi.clearAllMocks()
	})

	it('shows children when API key is set up', async () => {
		vi.mocked(userApi.getAiAuth).mockResolvedValue({auth: true})

		render(
			<AiPage toolTitle="AI Tool" toolDescription="You need AI to use this.">
				<p>AI content</p>
			</AiPage>
		)

		await waitFor(() => {
			expect(screen.getByText('AI content')).toBeInTheDocument()
		})

		expect(screen.queryByText('You need AI to use this.')).not.toBeInTheDocument()
		expect(
			screen.queryByRole('button', {name: /set up api key/i})
		).not.toBeInTheDocument()
	})

	it('shows explanation and instructions when no API key', async () => {
		vi.mocked(userApi.getAiAuth).mockResolvedValue({auth: false})

		render(
			<AiPage toolTitle="AI Tool" toolDescription="You need AI to use this.">
				<p>AI content</p>
			</AiPage>
		)

		await waitFor(() => {
			expect(screen.getByText('You need AI to use this.')).toBeInTheDocument()
		})

		expect(screen.getByRole('link', {name: /aistudio\.google\.com/i})).toBeInTheDocument()
		expect(screen.getByRole('button', {name: /set up api key/i})).toBeInTheDocument()
		expect(screen.queryByText('AI content')).not.toBeInTheDocument()
	})

	it('user can open the modal and save a new API key', async () => {
		const user = userEvent.setup()
		vi.mocked(userApi.getAiAuth).mockResolvedValue({auth: false})
		vi.mocked(userApi.setAiAuth).mockResolvedValue(undefined)

		render(
			<AiPage toolTitle="AI Tool" toolDescription="You need AI to use this.">
				<p>AI content</p>
			</AiPage>
		)

		await waitFor(() => {
			expect(screen.getByRole('button', {name: /set up api key/i})).toBeInTheDocument()
		})

		await user.click(screen.getByRole('button', {name: /set up api key/i}))

		const input = await screen.findByPlaceholderText(/enter your api key/i)
		expect(input).toBeInTheDocument()

		await user.type(input, 'my-test-api-key')
		await user.click(screen.getByRole('button', {name: /^save$/i}))

		await waitFor(() => {
			expect(userApi.setAiAuth).toHaveBeenCalledWith('my-test-api-key')
		})
	})
})
