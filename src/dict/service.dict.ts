import {
	DbWord,
	getByKanaAndMecabPosQuery,
	getByKanjiAndMecabPosQuery
} from './db/queries.dict'
import {Word} from './types.dict'

function mapDbRes(dbRes: DbWord[]): Word[] {
	let map: Record<
		number,
		{
			id: number
			kana: Set<string>
			kanji: Set<string>
			mecab: Set<string>
			sense: Record<
				number,
				{
					gloss: Set<string>
					pos: Set<string>
				}
			>
		}
	> = {}

	map = dbRes.reduce((acc, r) => {
		if (acc[r.id]) {
			acc[r.id].kana.add(r.kana)
			acc[r.id].kanji.add(r.kanji)
			acc[r.id].mecab.add(r.mecab)
			acc[r.id].sense[r.senseId].gloss.add(r.gloss)
			acc[r.id].sense[r.senseId].gloss.add(r.gloss)
			acc[r.id].sense[r.senseId].pos.add(r.pos)

			return acc
		}

		return {
			...acc,
			[r.id]: {
				id: r.id,
				kana: new Set<string>().add(r.kana),
				kanji: new Set<string>().add(r.kanji),
				mecab: new Set<string>().add(r.mecab),
				sense: {
					[r.senseId]: {
						gloss: new Set<string>().add(r.gloss),
						pos: new Set<string>().add(r.pos)
					}
				}
			}
		}
	}, map)

	return Object.values(map).map((d) => ({
		id: String(d.id),
		kana: Array.from(d.kana),
		kanji: Array.from(d.kanji),
		mecabPos: Array.from(d.mecab),
		sense: Object.values(d.sense).map((s) => ({
			gloss: Array.from(s.gloss),
			pos: Array.from(s.pos)
		}))
	}))
}

export async function getByKanjiAndMecabPos(
	kanji: string,
	mecabPos: string
): Promise<Word[]> {
	const queryRes = await getByKanjiAndMecabPosQuery(kanji, mecabPos)
	return mapDbRes(queryRes)
}

export async function getByKanaAndMecabPos(
	kana: string,
	mecabPos: string
): Promise<Word[]> {
	const queryRes = await getByKanaAndMecabPosQuery(kana, mecabPos)
	return mapDbRes(queryRes)
}
