import {getByKanaAndMecabPos, getByKanjiAndMecabPos} from '../dict/db/queries.dict.js'
import {Word} from '../dict/types.dict.js'
import {haveKanji} from './utils.js'

export type DictWord = Omit<Word, 'mecabPos'>

export async function dictLookup(text: string, mecabPos: string): Promise<DictWord[]> {
	if (haveKanji(text)) {
		return getByKanjiAndMecabPos(text, mecabPos)
	}

	return getByKanaAndMecabPos(text, mecabPos)
}
