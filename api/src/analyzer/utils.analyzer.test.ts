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

  describe('kanji reading starting with the same kana as the okurigana', () => {
    it('お祝い', () => {
      expect(getFurigana('お祝い', 'おいわい')).toBe('お祝[いわ]い')
    })

    it('お聞き', () => {
      expect(getFurigana('お聞き', 'おきき')).toBe('お聞[き]き')
    })

    it('お祝い方', () => {
      expect(getFurigana('お祝い方', 'おいわいかた')).toBe('お祝[いわ]い方[かた]')
    })
  })

  describe('common Japanese words', () => {
    it('日本語', () => {
      expect(getFurigana('日本語', 'にほんご')).toBe('日本語[にほんご]')
    })

    it('学校', () => {
      expect(getFurigana('学校', 'がっこう')).toBe('学校[がっこう]')
    })

    it('お土産', () => {
      expect(getFurigana('お土産', 'おみやげ')).toBe('お土産[みやげ]')
    })

    it('電話番号', () => {
      expect(getFurigana('電話番号', 'でんわばんごう')).toBe('電話番号[でんわばんごう]')
    })

    it('一日', () => {
      expect(getFurigana('一日', 'いちにち')).toBe('一日[いちにち]')
    })

    it('二人', () => {
      expect(getFurigana('二人', 'ふたり')).toBe('二人[ふたり]')
    })

    it('お手伝い', () => {
      expect(getFurigana('お手伝い', 'おてつだい')).toBe('お手伝[てつだ]い')
    })

    it('お祈り', () => {
      expect(getFurigana('お祈り', 'おいのり')).toBe('お祈[いの]り')
    })

    it('お参り', () => {
      expect(getFurigana('お参り', 'おまいり')).toBe('お参[まい]り')
    })

    it('お話し', () => {
      expect(getFurigana('お話し', 'おはなし')).toBe('お話[はな]し')
    })

    it('お母さん', () => {
      expect(getFurigana('お母さん', 'おかあさん')).toBe('お母[かあ]さん')
    })

    it('日本語を勉強します', () => {
      expect(getFurigana('日本語を勉強します', 'にほんごをべんきょうします')).toBe(
        '日本語[にほんご]を勉強[べんきょう]します'
      )
    })

    it('long sentence with several kanji blocks', () => {
      expect(
        getFurigana('私は日本語を勉強しています', 'わたしはにほんごをべんきょうしています')
      ).toBe('私[わたし]は日本語[にほんご]を勉強[べんきょう]しています')
    })

    it('compound kanji + okurigana (kanji + kana + kanji + kana)', () => {
      expect(getFurigana('引き受け', 'ひきうけ')).toBe('引[ひ]き受[う]け')
    })

    it('compound kanji + okurigana (kanji + kana + kanji + kana + kana)', () => {
      expect(getFurigana('申し送り', 'もうしおくり')).toBe('申[もう]し送[おく]り')
    })
  })

  describe('edge cases', () => {
    it('should handle single kanji with reading', () => {
      expect(getFurigana('字', 'じ')).toBe('字[じ]')
    })

    it('should handle single kanji with okurigana', () => {
      expect(getFurigana('私と', 'わたしと')).toBe('私[わたし]と')
    })

    it('should leave kana-only input unchanged', () => {
      expect(getFurigana('こんにちは', 'こんにちは')).toBe('こんにちは')
    })

    it('should leave katakana-only input unchanged', () => {
      expect(getFurigana('カタカナ', 'カタカナ')).toBe('カタカナ')
    })

    it('should handle whitespace at end', () => {
      expect(getFurigana('漢字 ', 'かんじ ')).toBe('漢字[かんじ] ')
    })

    it('should handle repeated kanji', () => {
      expect(getFurigana('人人', 'ひとびと')).toBe('人人[ひとびと]')
    })
  })
})
