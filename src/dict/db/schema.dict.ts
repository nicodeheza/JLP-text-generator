import {relations} from 'drizzle-orm'
import {int, primaryKey, sqliteTable as table, text} from 'drizzle-orm/sqlite-core'

export const words = table('words', {
	id: int().primaryKey({autoIncrement: true})
})
export const wordsRelations = relations(words, ({many}) => ({
	kanjis: many(kanjis),
	kanas: many(kanas)
}))

export const kanjis = table('kanjis', {
	id: int().primaryKey({autoIncrement: true}),
	common: int({mode: 'boolean'}).notNull(),
	text: text().notNull(),
	wordId: int('word_id').notNull()
})
export const kanjisRelations = relations(kanjis, ({one, many}) => ({
	word: one(words, {
		fields: [kanjis.wordId],
		references: [words.id]
	}),
	kanas: many(kanasToKanjis)
}))

export const kanas = table('kanas', {
	id: int().primaryKey({autoIncrement: true}),
	common: int({mode: 'boolean'}).notNull(),
	text: text().notNull(),
	wordId: int('word_id').notNull()
})
export const kanasRelations = relations(kanas, ({one, many}) => ({
	word: one(words, {
		fields: [kanas.wordId],
		references: [words.id]
	}),
	kanjis: many(kanasToKanjis)
}))

export const kanasToKanjis = table(
	'kanas_kanjis',
	{
		kanaId: int('kana_id')
			.notNull()
			.references(() => kanas.id),
		kanjisId: int('kanji_id')
			.notNull()
			.references(() => kanjis.id)
	},
	(t) => [primaryKey({columns: [t.kanaId, t.kanjisId]})]
)
export const kanasToKanjisRelations = relations(kanasToKanjis, ({one}) => ({
	kana: one(kanas, {
		fields: [kanasToKanjis.kanaId],
		references: [kanas.id]
	}),
	kanji: one(kanjis, {
		fields: [kanasToKanjis.kanjisId],
		references: [kanjis.id]
	})
}))

export const sense = table('sense', {
	id: int().primaryKey({autoIncrement: true}),
	wordId: int('word_id').notNull()
})
export const senseRelations = relations(sense, ({many}) => ({
	glosses: many(glosses),
	senseToPos: many(senseToPos),
	senseToKana: many(senseToKana),
	senseToKanji: many(senseToKanji),
	senseToMecabPos: many(senseToMecabPos)
}))

export const senseToKana = table('sense_kana', {
	senseId: int('sense_id')
		.notNull()
		.references(() => sense.id),
	kanaId: int('kana_id')
		.notNull()
		.references(() => kanas.id)
})
export const senseToKanaRelations = relations(senseToKana, ({one}) => ({
	sense: one(sense, {
		fields: [senseToKana.senseId],
		references: [sense.id]
	}),
	kana: one(kanas, {
		fields: [senseToKana.kanaId],
		references: [kanas.id]
	})
}))

export const senseToKanji = table('sense_kana', {
	senseId: int('sense_id')
		.notNull()
		.references(() => sense.id),
	kanjiId: int('kana_id')
		.notNull()
		.references(() => kanjis.id)
})
export const senseToKanjiRelations = relations(senseToKanji, ({one}) => ({
	sense: one(sense, {
		fields: [senseToKana.senseId],
		references: [sense.id]
	}),
	kanji: one(kanjis, {
		fields: [senseToKanji.kanjiId],
		references: [kanjis.id]
	})
}))

export const glosses = table('glosses', {
	id: int().primaryKey({autoIncrement: true}),
	text: text().notNull(),
	senseId: int('sense_id').notNull()
})
export const glossesRelations = relations(glosses, ({one}) => ({
	sense: one(glosses, {
		fields: [glosses.senseId],
		references: [glosses.id]
	})
}))

export const tags = table('tags', {
	id: int().primaryKey({autoIncrement: true}),
	abbreviation: text().notNull(),
	text: text().notNull()
})
export const tagsRelations = relations(tags, ({many}) => ({
	senseToPos: many(senseToPos)
}))

export const senseToPos = table(
	'kanas_kanjis',
	{
		senseId: int('sense_id')
			.notNull()
			.references(() => sense.id),
		tagId: int('tag_id')
			.notNull()
			.references(() => tags.id)
	},
	(t) => [primaryKey({columns: [t.senseId, t.tagId]})]
)
export const senseToPosRelations = relations(senseToPos, ({one}) => ({
	sense: one(sense, {
		fields: [senseToPos.senseId],
		references: [sense.id]
	}),
	pos: one(tags, {
		fields: [senseToPos.tagId],
		references: [tags.id]
	})
}))

export const mecabPos = table('mecab_pos', {
	id: int().primaryKey({autoIncrement: true}),
	text: text().notNull()
})
export const mecabPosRelations = relations(mecabPos, ({many}) => ({
	senseToMecabPos: many(senseToMecabPos)
}))

export const senseToMecabPos = table(
	'sense_mecab_pos',
	{
		mecabPosId: int('mecab_pos_id')
			.notNull()
			.references(() => mecabPos.id),
		senseId: int('sense_id')
			.notNull()
			.references(() => sense.id)
	},
	(t) => [primaryKey({columns: [t.mecabPosId, t.senseId]})]
)

export const senseToMecaPosRelations = relations(senseToMecabPos, ({one}) => ({
	mecabPos: one(mecabPos, {
		fields: [senseToMecabPos.mecabPosId],
		references: [mecabPos.id]
	}),
	sense: one(sense, {
		fields: [senseToMecabPos.senseId],
		references: [sense.id]
	})
}))
