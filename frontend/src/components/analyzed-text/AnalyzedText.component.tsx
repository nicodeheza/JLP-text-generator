import type {FC} from 'react'
import type {Dict, Token} from '../../types/analyzedText.types'
import {TokenComponent} from './Token.component'

interface Props {
	tokens: Token[]
	dict: Dict
}

export const AnalyzedText: FC<Props> = ({tokens, dict}) => {
	return (
		<>
			{tokens.map((t, i) => (
				<TokenComponent token={t} dict={dict} key={i} />
			))}
		</>
	)
}
