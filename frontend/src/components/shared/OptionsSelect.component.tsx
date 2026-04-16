import styles from './OptionsSelect.module.css'

interface Props<V extends string> {
	name: string
	options: Record<string, V>
	value: V
	onChange: (v: V) => void
}

export const OptionsSelect = <V extends string>({
	name,
	options,
	value,
	onChange
}: Props<V>) => {
	return (
		<div className={styles.radio}>
			{Object.entries(options).map(([label, optionValue]) => (
				<div key={optionValue}>
					<input
						type="radio"
						name={name}
						id={`${name}-${optionValue}`}
						value={optionValue}
						checked={optionValue === value}
						onChange={() => onChange(optionValue)}
					/>
					<label htmlFor={`${name}-${optionValue}`}>{label}</label>
				</div>
			))}
		</div>
	)
}
