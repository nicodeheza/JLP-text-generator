import { useMemo, type FC, type ReactNode } from 'react'
import { useStingsStore } from '../../store/Settings.store'
import styles from './Furigana.module.css'
import classNames from 'classnames'

interface Props {
  furigana: string
}

export const Furigana: FC<Props> = ({ furigana }) => {
  const { furigana: state } = useStingsStore()

  const nodes = useMemo(() => {
    const arr = furigana.split(/(\[|\])/)
    return getFuriganaNodes(arr)
  }, [furigana])
  return (
    <span
      className={classNames({
        [styles.disabled]: state === 'disable',
        [styles.hover]: state === 'hover',
      })}
    >
      {nodes}
    </span>
  )
}

function isKanjiChar(ch: string): boolean {
  const code = ch.charCodeAt(0)
  return code >= 0x4e00 && code <= 0x9fff
}

function getFuriganaNodes(strings: string[]): ReactNode[] {
  let i = 0
  const res: ReactNode[] = []
  let key = 0

  while (i < strings.length) {
    const str = strings[i]
    if (str === '[') {
      const furigana = strings[i + 1]
      // Split the trailing kanji block off the preceding text and wrap it
      // in its own <ruby> with the <rt>. The ruby base for an <rt> defaults
      // to every preceding character in the same <ruby>, so wrapping just
      // the kanji here is what scopes the furigana to the correct glyph
      // (e.g. `お祝[いわ]い` renders `<ruby>祝<rt>いわ</rt></ruby>`, not the
      // legacy `<ruby>お祝<rt>いわ</rt>い</ruby>` which would put the
      // annotation over `お祝`).
      const prev = res[res.length - 1]
      let kanjiBlock = ''
      if (typeof prev === 'string' && prev.length > 0) {
        let cut = prev.length
        while (cut > 0 && isKanjiChar(prev[cut - 1])) {
          cut--
        }
        kanjiBlock = prev.slice(cut)
        if (kanjiBlock) {
          res[res.length - 1] = prev.slice(0, cut)
        }
      }
      if (kanjiBlock) {
        res.push(
          <ruby key={key++}>
            {kanjiBlock}
            <rt className={styles.furigana}>{furigana}</rt>
          </ruby>
        )
      } else {
        // No kanji to anchor the annotation (e.g. `[]`); still wrap in a
        // minimal <ruby> so the <rt> renders as furigana.
        res.push(
          <ruby key={key++}>
            <rt className={styles.furigana}>{furigana}</rt>
          </ruby>
        )
      }
      i += 3
      continue
    }

    res.push(str)
    i += 1
  }

  return res
}
