import {and, eq} from 'drizzle-orm'
import {DictDb} from './db.dict'
import {
	glosses,
	kanas,
	kanjis,
	mecabPos,
	sense,
	senseToMecabPos,
	senseToPos,
	tags,
	words
} from './schema.dict'

const db = () => DictDb.getDb()

export interface DbWord {
	id: number
	kana: string
	kanji: string
	senseId: number
	gloss: string
	pos: string
	mecab: string
}

// TODO -add return type and test
export async function getByKanaAndMecabPosQuery(
	kana: string,
	mecabPosText: string
): Promise<DbWord[]> {
	return db()
		.select({
			id: words.id,
			kana: kanas.text,
			kanji: kanjis.text,
			senseId: sense.id,
			gloss: glosses.text,
			pos: tags.text,
			mecab: mecabPos.text
		})
		.from(words)
		.innerJoin(kanjis, eq(kanjis.wordId, words.id))
		.innerJoin(kanas, eq(kanas.wordId, words.id))
		.innerJoin(sense, eq(sense.wordId, words.id))
		.innerJoin(glosses, eq(glosses.senseId, sense.id))
		.innerJoin(tags, eq(tags.id, senseToPos.tagId))
		.innerJoin(mecabPos, eq(mecabPos.id, senseToMecabPos.mecabPosId))
		.where(and(eq(kanas.text, kana), eq(mecabPos.text, mecabPosText)))
}

export async function getByKanjiAndMecabPosQuery(
	kanji: string,
	mecabPosText: string
): Promise<DbWord[]> {
	return db()
		.select({
			id: words.id,
			kana: kanas.text,
			kanji: kanjis.text,
			senseId: sense.id,
			gloss: glosses.text,
			pos: tags.text,
			mecab: mecabPos.text
		})
		.from(words)
		.innerJoin(kanjis, eq(kanjis.wordId, words.id))
		.innerJoin(kanas, eq(kanas.wordId, words.id))
		.innerJoin(sense, eq(sense.wordId, words.id))
		.innerJoin(glosses, eq(glosses.senseId, sense.id))
		.innerJoin(tags, eq(tags.id, senseToPos.tagId))
		.innerJoin(mecabPos, eq(mecabPos.id, senseToMecabPos.mecabPosId))
		.where(and(eq(kanjis.text, kanji), eq(mecabPos.text, mecabPosText)))
}
