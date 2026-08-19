import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { Furigana } from './Furigana.component'
import * as settingsStore from '../../store/Settings.store'

vi.mock('../../store/Settings.store', () => ({
  useStingsStore: vi.fn(),
}))

function mockFuriganaState(state: 'enable' | 'hover' | 'disable') {
  vi.mocked(settingsStore.useStingsStore).mockReturnValue({
    furigana: state,
    updateFurigana: vi.fn(),
  })
}

// Returns all base (non-rt) text in the container. Strips out the <rt>
// contents so the remaining text is exactly the annotated glyphs.
function getBaseText(container: HTMLElement): string {
  const clone = container.cloneNode(true) as HTMLElement
  clone.querySelectorAll('rt').forEach((rt) => rt.remove())
  return clone.textContent ?? ''
}

function getFuriganaTexts(container: Element): string[] {
  return Array.from(container.querySelectorAll('rt')).map((rt) => rt.textContent ?? '')
}

describe('Furigana component', () => {
  beforeEach(() => {
    mockFuriganaState('enable')
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  describe('with empty furigana brackets', () => {
    it('renders an empty <rt> when the bracket is empty in the middle', () => {
      const { container } = render(<Furigana furigana="お祝[]い" />)
      expect(getBaseText(container)).toBe('お祝い')
      expect(getFuriganaTexts(container)).toEqual([''])
    })

    it('renders an empty <rt> at any position', () => {
      const { container } = render(<Furigana furigana="お聞[]き" />)
      expect(getBaseText(container)).toBe('お聞き')
      expect(getFuriganaTexts(container)).toEqual([''])
    })
  })

  describe('with a single kanji block', () => {
    it('renders the base text and one <rt>', () => {
      const { container } = render(<Furigana furigana="漢字[かんじ]" />)
      expect(getBaseText(container)).toBe('漢字')
      expect(getFuriganaTexts(container)).toEqual(['かんじ'])
    })

    it('renders the kanji reading when the kanji is surrounded by kana', () => {
      const { container } = render(<Furigana furigana="お祝[いわ]い" />)
      expect(getBaseText(container)).toBe('お祝い')
      expect(getFuriganaTexts(container)).toEqual(['いわ'])
    })

    it('renders the kanji reading when the kanji has a kana prefix only', () => {
      const { container } = render(<Furigana furigana="お名前[なまえ]" />)
      expect(getBaseText(container)).toBe('お名前')
      expect(getFuriganaTexts(container)).toEqual(['なまえ'])
    })

    it('wraps only the annotated kanji in its own <ruby> (not the leading kana)', () => {
      const { container } = render(<Furigana furigana="お祝[いわ]い" />)
      // Without nesting the <ruby> around just `祝`, the furigana would
      // render over `お祝` instead of `祝`.
      const rubies = container.querySelectorAll('ruby')
      expect(rubies).toHaveLength(1)
      expect(rubies[0].textContent?.replace('いわ', '')).toBe('祝')
    })
  })

  describe('with multiple furigana segments', () => {
    it('renders segments in order', () => {
      const { container } = render(<Furigana furigana="東京都[とうきょうと]に住[す]む" />)
      expect(getBaseText(container)).toBe('東京都に住む')
      expect(getFuriganaTexts(container)).toEqual(['とうきょうと', 'す'])
      // Each annotated kanji block is in its own <ruby>.
      expect(container.querySelectorAll('ruby')).toHaveLength(2)
    })

    it('renders a long sentence with several kanji blocks', () => {
      const { container } = render(
        <Furigana furigana="私[わたし]は日本語[にほんご]を勉強[べんきょう]しています" />
      )
      expect(getBaseText(container)).toBe('私は日本語を勉強しています')
      expect(container.querySelectorAll('rt')).toHaveLength(3)
    })

    it('renders a long string with many segments', () => {
      const long =
        '私[わたし]は日本語[にほんご]を勉強[べんきょう]しています。毎日[まいにち]学校[がっこう]に行[い]きます。友達[ともだち]と昼ご飯[ひるごはん]を食[た]べます。'
      const { container } = render(<Furigana furigana={long} />)
      expect(container.querySelectorAll('rt').length).toBe(9)
    })
  })

  describe('with plain kana (no furigana)', () => {
    it('renders the text without any <ruby> or <rt>', () => {
      const { container } = render(<Furigana furigana="こんにちは" />)
      expect(container.textContent).toBe('こんにちは')
      expect(container.querySelectorAll('rt')).toHaveLength(0)
    })
  })

  describe('settings states', () => {
    it('renders without extra class when state is "enable"', () => {
      mockFuriganaState('enable')
      const { container } = render(<Furigana furigana="漢字[かんじ]" />)
      const wrapper = container.firstElementChild!
      expect(wrapper.className).not.toMatch(/disabled/i)
      expect(wrapper.className).not.toMatch(/hover/i)
    })

    it('applies hover class when state is "hover"', () => {
      mockFuriganaState('hover')
      const { container } = render(<Furigana furigana="漢字[かんじ]" />)
      const wrapper = container.firstElementChild!
      expect(wrapper.className).toMatch(/hover/i)
    })

    it('applies disabled class when state is "disable"', () => {
      mockFuriganaState('disable')
      const { container } = render(<Furigana furigana="漢字[かんじ]" />)
      const wrapper = container.firstElementChild!
      expect(wrapper.className).toMatch(/disabled/i)
    })
  })

  describe('edge cases', () => {
    it('renders empty string without throwing', () => {
      const { container } = render(<Furigana furigana="" />)
      expect(container.textContent).toBe('')
      expect(container.querySelectorAll('rt')).toHaveLength(0)
    })

    it('handles bare brackets `[]` (no surrounding text)', () => {
      const { container } = render(<Furigana furigana="[]" />)
      const rts = container.querySelectorAll('rt')
      expect(rts).toHaveLength(1)
      expect(rts[0].textContent).toBe('')
    })

    it('handles katakana readings inside brackets', () => {
      const { container } = render(<Furigana furigana="日本[ニホン]" />)
      const rt = container.querySelector('rt')!
      expect(rt.textContent).toBe('ニホン')
    })

    it('handles malformed input — missing closing bracket', () => {
      const { container } = render(<Furigana furigana="漢字[かんじ" />)
      expect((container.textContent ?? '').length).toBeGreaterThan(0)
    })

    it('handles nested-looking text — `[` inside a reading', () => {
      const { container } = render(<Furigana furigana="漢字[a[b]c]" />)
      expect(container.querySelectorAll('rt').length).toBeGreaterThan(0)
    })
  })

  describe('re-rendering', () => {
    it('updates when furigana prop changes', () => {
      const { container, rerender } = render(<Furigana furigana="漢字[かんじ]" />)
      expect(getBaseText(container)).toBe('漢字')

      rerender(<Furigana furigana="私[わたし]" />)
      expect(getBaseText(container)).toBe('私')

      rerender(<Furigana furigana="こんにちは" />)
      expect(container.textContent).toBe('こんにちは')
      expect(container.querySelectorAll('rt')).toHaveLength(0)
    })
  })
})
