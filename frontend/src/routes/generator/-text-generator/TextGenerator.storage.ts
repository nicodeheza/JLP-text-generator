import { JsonStorage } from '../../../store/localStorage'
import type { JLPTLevel } from '../../../types/Settings.types'
import type { CachedEvent } from './TextGenerator.types'

export const GeneratedTextStorage = new JsonStorage<CachedEvent>('_event_cache')
export const SelectedLevelStorage = new JsonStorage<JLPTLevel>('_level_cache')
