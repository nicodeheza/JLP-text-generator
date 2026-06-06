import { useState } from 'react'
import { JsonStorage } from '../../store/localStorage'
import { Icon, type IconName } from '../Icon/Icons.component'
import styles from './ThemeToggle.module.css'

type Theme = 'dark' | 'light'

const storage = new JsonStorage<Theme>('_theme')

function getCurrentTheme() {
  const storageTheme = storage.getData()
  if (storageTheme) return storageTheme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function saveTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  storage.saveData(theme)
}

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const currentTheme = getCurrentTheme()
    saveTheme(currentTheme)
    return currentTheme
  })

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    saveTheme(newTheme)
  }

  const currentIcon: IconName = theme === 'dark' ? 'moon' : 'sun'

  return (
    <button onClick={toggleTheme} className={styles.button}>
      <Icon icon={currentIcon} />
    </button>
  )
}
