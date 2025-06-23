import {useMemo, type FC, type ReactNode} from 'react'
import {useStingsStore} from '../../store/Settings.store'
import styles from './Furigana.module.css'
import classNames from 'classnames'

interface Props {
	furigana: string
}

export const Furigana: FC<Props> = ({furigana}) => {
	const {furigana: state} = useStingsStore()

	const nodes = useMemo(() => {
		const arr = furigana.split(/(\[|\])/)
		return getFuriganaNodes(arr)
	}, [furigana])
	return (
		<ruby
			className={classNames({
				[styles.disabled]: state === 'disable',
				[styles.hover]: state === 'hover'
			})}
		>
			{nodes}
		</ruby>
	)
}

function getFuriganaNodes(strings: string[]): ReactNode[] {
	let i = 0
	const res: ReactNode[] = []

	while (i < strings.length) {
		const str = strings[i]
		if (str === '[') {
			const furigana = strings[i + 1]
			res.push(
				<rt className={styles.furigana} key={i}>
					{furigana}
				</rt>
			)
			i += 3
			continue
		}

		res.push(str)
		i += 1
	}

	return res
}
