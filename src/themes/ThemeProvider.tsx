import { createContext, useContext, type PropsWithChildren } from 'react'
import type { Theme } from './types'

const ThemeContext = createContext<Theme | null>(null)

export function ThemeProvider({
  theme,
  children,
}: PropsWithChildren<{ theme: Theme }>) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext)
  if (!theme) {
    throw new Error('useTheme must be called inside a <ThemeProvider>')
  }
  return theme
}
