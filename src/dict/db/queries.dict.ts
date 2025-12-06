import {Word} from '../types.dict'
import {DictDb} from './db.dict'

const db = DictDb.getDb()

const getByKanaAndMecabPosQuery = /*sql */ `SELECT id, kana, kanji, sense FROM dict WHERE
EXISTS ( SELECT 1 FROM json_each(dict.kana) WHERE json_each.value = ?) 
AND
EXISTS (SELECT 2 FROM json_each(dict.mecabPos) WHERE json_each.value = ?);
`
const getByKanjiAndMecabPosQuery = /*sql */ `SELECT id, kana, kanji, sense FROM dict WHERE
EXISTS ( SELECT 1 FROM json_each(dict.kanji) WHERE json_each.value = ?) 
AND
EXISTS (SELECT 2 FROM json_each(dict.mecabPos) WHERE json_each.value = ?);
`

interface LookupRes {
	id: string
	kana: string
	kanji: string
	sense: string
}
export async function getByKanaAndMecabPos(
	kana: string,
	mecabPos: string
): Promise<Omit<Word, 'mecabPos'>[]> {
	const res = await DictDb.all<LookupRes>(getByKanaAndMecabPosQuery, [kana, mecabPos])
	return res.map((r) => ({
		id: r.id,
		kana: JSON.parse(r.kana),
		kanji: JSON.parse(r.kanji),
		sense: JSON.parse(r.sense)
	}))
}

export async function getByKanjiAndMecabPos(
	kanji: string,
	mecabPos: string
): Promise<Omit<Word, 'mecabPos'>[]> {
	const res = await DictDb.all<LookupRes>(getByKanjiAndMecabPosQuery, [kanji, mecabPos])
	return res.map((r) => ({
		id: r.id,
		kana: JSON.parse(r.kana),
		kanji: JSON.parse(r.kanji),
		sense: JSON.parse(r.sense)
	}))
}
