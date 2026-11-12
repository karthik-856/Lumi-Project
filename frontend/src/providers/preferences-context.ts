import { createContext } from "react"
import type { Preferences } from "@/types/preferences"

export type ThemePreference = "light" | "dark" | "system"

export type PreferencesContextValue = Preferences & {
  theme: ThemePreference
  resolvedTheme: "light" | "dark"
  setTheme: (value: ThemePreference) => void
  setContrast: (value: Preferences["contrast"]) => void
  setFontScale: (value: Preferences["fontScale"]) => void
  setMotion: (value: Preferences["motion"]) => void
  resetPreferences: () => void
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null)
