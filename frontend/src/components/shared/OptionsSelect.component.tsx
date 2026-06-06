import styles from './OptionsSelect.module.css'

interface Props<V extends string> {
  name: string
  options: Record<string, V>
  value: V
  onChange: (v: V) => void
  variant?: 'pills' | 'rectangle'
}

export const OptionsSelect = <V extends string>({
  name,
  options,
  value,
  onChange,
  variant = 'pills',
}: Props<V>) => {
  return (
    <div className={variant === 'rectangle' ? styles.rectangle : styles.pills}>
      {Object.entries(options).map(([label, optionValue]) => (
        <div key={optionValue} className={styles.option}>
          <input
            type="radio"
            name={name}
            id={`${name}-${optionValue}`}
            value={optionValue}
            checked={optionValue === value}
            onChange={() => onChange(optionValue)}
            className={styles.input}
          />
          <label htmlFor={`${name}-${optionValue}`} className={styles.label}>
            {label}
          </label>
        </div>
      ))}
    </div>
  )
}
