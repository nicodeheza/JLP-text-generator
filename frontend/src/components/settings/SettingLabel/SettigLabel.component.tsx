import type { FC, ReactNode } from 'react'
import styles from './SettingsLabel.module.css'

interface Props {
  label: string
  children: ReactNode
}

export const SettingLabel: FC<Props> = ({ label, children }) => {
  return (
    <div className={styles.container}>
      <p className={styles.label}>{label}</p>
      {children}
    </div>
  )
}
