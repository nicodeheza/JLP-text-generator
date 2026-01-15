import {getByKanaAndMecabPos, getByKanjiAndMecabPos} from '../../dict/service.dict.js'
import {DictWord} from '../types.analyzer.js'
import {haveKanji} from '../utils.analyzer.js'

export async function dictLookup(text: string, mecabPos: string): Promise<DictWord[]> {
	if (haveKanji(text)) {
		return getByKanjiAndMecabPos(text, mecabPos)
	}

	return getByKanaAndMecabPos(text, mecabPos)
}
