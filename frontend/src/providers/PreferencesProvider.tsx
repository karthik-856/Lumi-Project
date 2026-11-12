import { useEffect, useMemo, useState, type ReactNode } from "react"
import { PreferencesContext, type ThemePreference } from "@/providers/preferences-context"
import {
  defaultPreferences,
  isContrast,
  isFontScale,
  isMotion,
  type Preferences,
} from "@/types/preferences"

const storageKey = "lumi-preferences"
const themeStorageKey = "lumi-theme"

function readTheme(): ThemePreference {
  try {
    const value = localStorage.getItem(themeStorageKey)
    if (value === "light" || value === "dark" || value === "system") return value
  } catch {
    /* The default theme still applies. */
  }
  return "system"
}

function readPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return defaultPreferences
    const parsed = JSON.parse(raw) as Partial<Preferences>
    return {
      contrast: isContrast(parsed.contrast) ? parsed.contrast : "system",
      fontScale: isFontScale(parsed.fontScale) ? parsed.fontScale : "default",
      motion: isMotion(parsed.motion) ? parsed.motion : "system",
    }
  } catch {
    return defaultPreferences
  }
}

function PreferencesState({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(readPreferences)
  const [theme, setTheme] = useState<ThemePreference>(readTheme)
  const [systemDark, setSystemDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches)
  const resolvedTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => setSystemDark(media.matches)
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", resolvedTheme === "dark")
    root.style.colorScheme = resolvedTheme
    localStorage.setItem(themeStorageKey, theme)
  }, [theme, resolvedTheme])

  useEffect(() => {
    const root = document.documentElement
    const media = window.matchMedia("(prefers-contrast: more)")
    const applyContrast = () => {
      const high =
        preferences.contrast === "high" ||
        (preferences.contrast === "system" && media.matches)
      root.classList.toggle("hc", high)
    }
    applyContrast()
    root.dataset.contrast = preferences.contrast
    root.dataset.fontScale = preferences.fontScale
    root.dataset.motion = preferences.motion
    root.classList.toggle("reduce", preferences.motion === "reduce")
    localStorage.setItem(storageKey, JSON.stringify(preferences))
    media.addEventListener("change", applyContrast)
    return () => media.removeEventListener("change", applyContrast)
  }, [preferences])

  const value = useMemo(
    () => ({
      ...preferences,
      theme,
      resolvedTheme,
      setTheme,
      setContrast: (contrast: Preferences["contrast"]) =>
        setPreferences((current) => ({ ...current, contrast })),
      setFontScale: (fontScale: Preferences["fontScale"]) =>
        setPreferences((current) => ({ ...current, fontScale })),
      setMotion: (motion: Preferences["motion"]) =>
        setPreferences((current) => ({ ...current, motion })),
      resetPreferences: () => {
        setTheme("system")
        setPreferences(defaultPreferences)
      },
    }),
    [preferences, theme, resolvedTheme],
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  return <PreferencesState>{children}</PreferencesState>
}
