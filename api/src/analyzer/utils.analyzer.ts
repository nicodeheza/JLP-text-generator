import { isKanji, toHiragana } from 'wanakana'

export function katakaToHiragana(katakana: string): string {
  return toHiragana(katakana, { passRomaji: true })
}

export function haveKanji(text: string): boolean {
  return text.split('').some((c) => isKanji(c))
}

/**
 * Builds a furigana bracket-notation string (e.g. `東京都[とうきょうと]に住[す]む`)
 * from an original surface form and its full hiragana reading.
 *
 * Strategy: walk left-to-right, alternating between:
 *  1. Kana runs  — matched literally against the reading and emitted as plain text.
 *  2. Kanji runs — the contiguous block of kanji characters is wrapped together
 *                  with however much of the reading is consumed before the next
 *                  literal kana segment (or the end of the string).
 */
export function getFurigana(original: string, reading: string): string {
  if (!original) return ''
  return buildFurigana(original, reading)
}

function buildFurigana(original: string, reading: string): string {
  if (!original) return ''

  // --- Kana prefix: consume characters that are NOT kanji ---
  if (!isKanji(original[0])) {
    let kanaEnd = 0
    while (kanaEnd < original.length && !isKanji(original[kanaEnd])) {
      kanaEnd++
    }
    const kanaSegment = original.slice(0, kanaEnd)
    // The kana segment should appear literally at the start of the reading
    const rPos = reading.indexOf(kanaSegment)
    if (rPos === 0) {
      return kanaSegment + buildFurigana(original.slice(kanaEnd), reading.slice(kanaEnd))
    }
    // Fallback: emit as-is (shouldn't happen with well-formed MeCab output)
    return original
  }

  // --- Kanji run: consume contiguous kanji characters ---
  let kanjiEnd = 0
  while (kanjiEnd < original.length && isKanji(original[kanjiEnd])) {
    kanjiEnd++
  }
  const kanjiBlock = original.slice(0, kanjiEnd)
  const rest = original.slice(kanjiEnd)

  if (!rest) {
    // Kanji block runs to end of string — consume the entire remaining reading
    return kanjiBlock + '[' + reading + ']'
  }

  // Find the next kana segment (non-kanji run) in `rest` to anchor the reading split
  let nextKanaEnd = 0
  while (nextKanaEnd < rest.length && !isKanji(rest[nextKanaEnd])) {
    nextKanaEnd++
  }
  const nextKana = rest.slice(0, nextKanaEnd)

  // Locate that kana segment inside the remaining reading to know where the
  // kanji reading ends
  const splitPos = reading.indexOf(nextKana)
  if (splitPos === -1) {
    // Fallback: wrap everything remaining as one block
    return kanjiBlock + '[' + reading + ']' + rest
  }

  const kanjiReading = reading.slice(0, splitPos)
  return kanjiBlock + '[' + kanjiReading + ']' + buildFurigana(rest, reading.slice(splitPos))
}
