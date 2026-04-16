import {JsonStorage} from '../../../store/localStorage'
import type {JlptLevel} from '../../../types/Settings.types'
import type {CachedEvent} from './TextGenerator.types'

export const GeneratedTextStorage = new JsonStorage<CachedEvent>('_event_cache')
export const SelectedLevelStorage = new JsonStorage<JlptLevel>('_level_cache')
