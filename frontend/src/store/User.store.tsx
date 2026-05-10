import {create} from 'zustand'
import type {IsAiSetup} from '../types/user.types'

interface UserStore {
	aiEnabled: IsAiSetup
	updateAiEnabled: (update: IsAiSetup) => void
}

const useStore = create<UserStore>((set) => ({
	aiEnabled: undefined,
	updateAiEnabled: (update) => {
		set({aiEnabled: update})
	}
}))

export function useUserStore() {
	return useStore((store) => store)
}
