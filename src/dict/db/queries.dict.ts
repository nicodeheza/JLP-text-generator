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

const db = DictDb.getDb()

// TODO - add return type and test
export async function getByKanaAndMecabPos(kana: string, mecabPosText: string) {
	return db
		.select({
			id: words.id,
			kanas: kanas.text,
			kanjis: kanjis.text,
			sense: glosses.text,
			pos: tags.text,
			mecab: mecabPos.text
		})
		.from(words)
		.innerJoin(kanjis, eq(kanjis.wordId, words.id))
		.innerJoin(kanas, eq(kanas.wordId, words.id))
		.innerJoin(sense, eq(sense.wordId, words.id))
		.innerJoin(glosses, eq(glosses.senseId, sense.id))
		.innerJoin(senseToPos, eq(senseToPos.senseId, sense.id))
		.innerJoin(tags, eq(tags.id, senseToPos.tagId))
		.innerJoin(senseToMecabPos, eq(senseToMecabPos.senseId, sense.id))
		.innerJoin(mecabPos, eq(mecabPos.id, senseToMecabPos.mecabPosId))
		.where(and(eq(kanas.text, kana), eq(mecabPos.text, mecabPosText)))
}

export async function getByKanjiAndMecabPos(kanji: string, mecabPosText: string) {
	return db
		.select({
			id: words.id,
			kanas: kanas.text,
			kanjis: kanjis.text,
			sense: glosses.text,
			pos: tags.text,
			mecab: mecabPos.text
		})
		.from(words)
		.innerJoin(kanjis, eq(kanjis.wordId, words.id))
		.innerJoin(kanas, eq(kanas.wordId, words.id))
		.innerJoin(sense, eq(sense.wordId, words.id))
		.innerJoin(glosses, eq(glosses.senseId, sense.id))
		.innerJoin(senseToPos, eq(senseToPos.senseId, sense.id))
		.innerJoin(tags, eq(tags.id, senseToPos.tagId))
		.innerJoin(senseToMecabPos, eq(senseToMecabPos.senseId, sense.id))
		.innerJoin(mecabPos, eq(mecabPos.id, senseToMecabPos.mecabPosId))
		.where(and(eq(kanjis.text, kanji), eq(mecabPos.text, mecabPosText)))
}
