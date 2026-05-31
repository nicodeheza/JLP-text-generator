import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest'
import {render, screen, cleanup, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Header} from './Header.component'
import {clearUserStore} from '../../store/User.store'
import * as userApi from '../../api/user.api'

vi.mock('../../api/user.api')

vi.mock('@tanstack/react-router', () => ({
	Link: ({children, to, ...props}: {children: React.ReactNode; to: string; [key: string]: unknown}) => (
		<a href={to} {...props}>
			{children}
		</a>
	),
	useRouterState: vi.fn(() => ({location: {pathname: '/'}})),
	useMatch: vi.fn(() => null)
}))

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
})

HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
	this.setAttribute('open', '')
})
HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
	this.removeAttribute('open')
})

describe('Header — AI Key Modal', () => {
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

	function getDialog() {
		return screen.getByPlaceholderText(/enter your api key/i).closest('dialog')!
	}

	it('opens the modal when "AI Settings" button is clicked', async () => {
		const user = userEvent.setup()
		render(<Header />)

		expect(getDialog()).not.toHaveAttribute('open')

		await user.click(screen.getByRole('button', {name: /ai settings/i}))

		expect(getDialog()).toHaveAttribute('open')
	})

	it('closes the modal when the × button is clicked', async () => {
		const user = userEvent.setup()
		render(<Header />)

		await user.click(screen.getByRole('button', {name: /ai settings/i}))
		expect(getDialog()).toHaveAttribute('open')

		await user.click(screen.getByRole('button', {name: /close/i}))

		expect(getDialog()).not.toHaveAttribute('open')
	})

	it('closes the modal when "Cancel" button is clicked', async () => {
		const user = userEvent.setup()
		render(<Header />)

		await user.click(screen.getByRole('button', {name: /ai settings/i}))
		expect(getDialog()).toHaveAttribute('open')

		await user.click(screen.getByRole('button', {name: /cancel/i}))

		expect(getDialog()).not.toHaveAttribute('open')
	})

	it('can add a new API key', async () => {
		const user = userEvent.setup()
		vi.mocked(userApi.getAiAuth).mockResolvedValue({auth: false})

		render(<Header />)

		await user.click(screen.getByRole('button', {name: /ai settings/i}))

		const input = screen.getByPlaceholderText(/enter your api key/i)
		await user.type(input, 'my-new-api-key')
		await user.click(screen.getByRole('button', {name: /^save$/i}))

		await waitFor(() => {
			expect(userApi.setAiAuth).toHaveBeenCalledWith('my-new-api-key')
		})

		await waitFor(() => {
			expect(screen.getByText(/api key saved successfully/i)).toBeInTheDocument()
		})
	})

	it('can update an existing API key', async () => {
		const user = userEvent.setup()
		vi.mocked(userApi.getAiAuth).mockResolvedValue({auth: true})

		render(<Header />)

		await user.click(screen.getByRole('button', {name: /ai settings/i}))

		// Wait for the store to resolve the key status
		await waitFor(() => {
			expect(screen.getByRole('button', {name: /delete key/i})).toBeInTheDocument()
		})

		const input = screen.getByPlaceholderText(/enter your api key/i)
		// Clear the placeholder value and type a new key
		await user.tripleClick(input)
		await user.clear(input)
		await user.type(input, 'my-updated-api-key')
		await user.click(screen.getByRole('button', {name: /^save$/i}))

		await waitFor(() => {
			expect(userApi.setAiAuth).toHaveBeenCalledWith('my-updated-api-key')
		})
	})

	it('can delete an existing API key', async () => {
		const user = userEvent.setup()
		vi.mocked(userApi.getAiAuth).mockResolvedValue({auth: true})

		render(<Header />)

		await user.click(screen.getByRole('button', {name: /ai settings/i}))

		await waitFor(() => {
			expect(screen.getByRole('button', {name: /delete key/i})).toBeInTheDocument()
		})

		await user.click(screen.getByRole('button', {name: /delete key/i}))

		await waitFor(() => {
			expect(userApi.deleteAiAuth).toHaveBeenCalled()
		})

		await waitFor(() => {
			expect(screen.getByText(/api key deleted/i)).toBeInTheDocument()
		})
	})

	it('resets mutation state when closing and reopening the modal', async () => {
		const user = userEvent.setup()
		vi.mocked(userApi.getAiAuth).mockResolvedValue({auth: false})

		render(<Header />)

		// Open and save a key
		await user.click(screen.getByRole('button', {name: /ai settings/i}))
		const input = screen.getByPlaceholderText(/enter your api key/i)
		await user.type(input, 'some-api-key')
		await user.click(screen.getByRole('button', {name: /^save$/i}))

		await waitFor(() => {
			expect(screen.getByText(/api key saved successfully/i)).toBeInTheDocument()
		})

		// Close the modal
		await user.click(screen.getByRole('button', {name: /cancel/i}))
		expect(getDialog()).not.toHaveAttribute('open')
		expect(screen.queryByText(/api key saved successfully/i)).not.toBeInTheDocument()

		// Reopen — modal is open and success message should NOT be visible
		await user.click(screen.getByRole('button', {name: /ai settings/i}))
		expect(getDialog()).toHaveAttribute('open')
		expect(screen.queryByText(/api key saved successfully/i)).not.toBeInTheDocument()
	})
})
