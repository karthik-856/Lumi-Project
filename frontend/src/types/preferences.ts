export const contrastOptions = ["system", "default", "high"] as const
export const fontScaleOptions = ["default", "large", "larger"] as const
export const motionOptions = ["system", "reduce", "full"] as const

export type ContrastPreference = (typeof contrastOptions)[number]
export type FontScalePreference = (typeof fontScaleOptions)[number]
export type MotionPreference = (typeof motionOptions)[number]

export type Preferences = {
  contrast: ContrastPreference
  fontScale: FontScalePreference
  motion: MotionPreference
}

export const defaultPreferences: Preferences = {
  contrast: "system",
  fontScale: "default",
  motion: "system",
}

export function isContrast(value: unknown): value is ContrastPreference {
  return contrastOptions.includes(value as ContrastPreference)
}

export function isFontScale(value: unknown): value is FontScalePreference {
  return fontScaleOptions.includes(value as FontScalePreference)
}

export function isMotion(value: unknown): value is MotionPreference {
  return motionOptions.includes(value as MotionPreference)
}
