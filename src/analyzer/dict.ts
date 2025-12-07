import {getByKanaAndMecabPos, getByKanjiAndMecabPos} from '../dict/service.dict'
import {Word} from '../dict/types.dict'
import {haveKanji} from './utils'

export type DictWord = Omit<Word, 'mecabPos'>

export async function dictLookup(text: string, mecabPos: string): Promise<DictWord[]> {
	if (haveKanji(text)) {
		return getByKanjiAndMecabPos(text, mecabPos)
	}

	return getByKanaAndMecabPos(text, mecabPos)
}
