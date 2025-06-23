import {JMdictWord} from '@scriptin/jmdict-simplified-types'
import {jmdictToMecabPOS, Word} from '../types.dict.js'
import {Db} from './db.dict.js'

const createDictTableQuery = /*sql */ `
DROP TABLE IF EXISTS dict;
CREATE TABLE dict(
    id TEXT PRIMARY KEY,
    mecabPos TEXT,
    kana TEXT,
    kanji TEXT,
    sense TEXT
);
`

const insertToDictQuery = /*sql*/ `INSERT INTO dict (id, mecabPos, kana, kanji, sense) VALUES (?,?,?,?,?);`

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

export async function createTables() {
	await Db.exec(createDictTableQuery)
}

export async function insertToDict(jmdictWord: JMdictWord, tags: Record<string, string>) {
	const mecabPos: Word['mecabPos'] = jmdictWord.sense
		.map((s) => s.partOfSpeech)
		.flat()
		.map((pos) => jmdictToMecabPOS[pos])
		.flat()

	const sense: Word['sense'] = jmdictWord.sense.map((s) => ({
		pos: s.partOfSpeech.map((p) => tags[p]),
		gloss: s.gloss.map((g) => g.text)
	}))

	const kana: Word['kana'] = jmdictWord.kana.map((k) => k.text)
	const kanji: Word['kanji'] = jmdictWord.kanji.map((k) => k.text)

	await Db.run(insertToDictQuery, [
		jmdictWord.id,
		JSON.stringify(mecabPos),
		JSON.stringify(kana),
		JSON.stringify(kanji),
		JSON.stringify(sense)
	])
}

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
	const res = await Db.all<LookupRes>(getByKanaAndMecabPosQuery, [kana, mecabPos])
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
	const res = await Db.all<LookupRes>(getByKanjiAndMecabPosQuery, [kanji, mecabPos])
	return res.map((r) => ({
		id: r.id,
		kana: JSON.parse(r.kana),
		kanji: JSON.parse(r.kanji),
		sense: JSON.parse(r.sense)
	}))
}
