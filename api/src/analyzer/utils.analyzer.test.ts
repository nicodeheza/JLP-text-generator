import { describe, it, expect } from 'vitest'
import { getFurigana } from './utils.analyzer.js'

describe('getFurigana()', () => {
  it('should return empty string for empty input', () => {
    expect(getFurigana('', '')).toBe('')
  })

  it('should wrap a kanji-only block with its full reading', () => {
    expect(getFurigana('漢字', 'かんじ')).toBe('漢字[かんじ]')
  })

  it('should wrap a multi-kanji compound as a single block', () => {
    // the key regression: fit() would produce 轟[どめき] 駅[えき]
    expect(getFurigana('轟駅', 'どめきえき')).toBe('轟駅[どめきえき]')
  })

  it('should handle kanji block followed by kana suffix', () => {
    expect(getFurigana('轟駅にいっています', 'どめきえきにいっています')).toBe(
      '轟駅[どめきえき]にいっています'
    )
  })

  it('should handle kana prefix followed by kanji block', () => {
    expect(getFurigana('お名前', 'おなまえ')).toBe('お名前[なまえ]')
  })

  it('should handle kana prefix + kanji block + kana suffix', () => {
    expect(getFurigana('この東京都へ', 'このとうきょうとへ')).toBe('この東京都[とうきょうと]へ')
  })

  it('should handle kana + kanji + kana + kanji + kana', () => {
    expect(getFurigana('名前は漢字です', 'なまえはかんじです')).toBe(
      '名前[なまえ]は漢字[かんじ]です'
    )
  })

  it('should handle multiple kanji blocks separated by kana (longer example)', () => {
    expect(getFurigana('東京都に住む', 'とうきょうとにすむ')).toBe('東京都[とうきょうと]に住[す]む')
  })

  it('should return the original string when there are no kanji', () => {
    expect(getFurigana('にいっています', 'にいっています')).toBe('にいっています')
  })

  it('お腹', () => {
    expect(getFurigana('お腹', 'おなか')).toBe('お腹[なか]')
  })

  it('あお腹', () => {
    expect(getFurigana('あお腹', 'あおなか')).toBe('あお腹[なか]')
  })

  it('should handle kana + kanji + kana + kanji + kana + kana + kanji + kana + kanji', () => {
    expect(
      getFurigana('お名前は漢字です名前は漢字です', 'おなまえはかんじですなまえはかんじです')
    ).toBe('お名前[なまえ]は漢字[かんじ]です名前[なまえ]は漢字[かんじ]です')
  })
})
