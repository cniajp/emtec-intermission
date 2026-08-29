import type { Theme, ThemeName } from './types'
import { defaultTheme } from './default'

const REGISTRY: Record<ThemeName, Theme> = {
  default: defaultTheme,
}

const DEFAULT_THEME: ThemeName = 'default'

export function selectTheme(name: string | undefined | null): Theme {
  if (name && (name as ThemeName) in REGISTRY) {
    return REGISTRY[name as ThemeName]
  }
  return REGISTRY[DEFAULT_THEME]
}
