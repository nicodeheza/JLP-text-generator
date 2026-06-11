import type { FC } from 'react'
import type { Dict, TokenRes } from '../../types/analyzedText.types'
import { TokenComponent } from './Token.component'

interface Props {
  tokens: TokenRes[]
  dict: Dict
}

export const AnalyzedText: FC<Props> = ({ tokens, dict }) => {
  return (
    <>
      {tokens.map((t, i) => (
        <TokenComponent token={t} dict={dict} key={i} />
      ))}
    </>
  )
}
