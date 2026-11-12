import { audienceOptions, goalOptions, outputOptions, toneOptions } from "@/data/studio-options"
import type { GuidanceAnswer, PromptIntent } from "@/types/library"
import type { StudioDraft } from "@/types/studio"

const handoffKey = "lumi-studio-handoff"
const analyzerKey = "lumi-analyzer-handoff"

export type StudioHandoff = {
  idea: string
  goal?: string
  audience?: string
  context?: string
  tone?: string
  output?: string
  note?: string
  promptId?: string
  templateId?: string
  templateCategory?: string
  title?: string
  favorite?: boolean
}

export type AnalyzerHandoff = {
  text: string
  promptId?: string
  idea?: string
  title?: string
  intent?: PromptIntent
  templateId?: string
  templateCategory?: string
  favorite?: boolean
  answers?: GuidanceAnswer[]
}

let pendingDraft: StudioHandoff | null = null
let pendingAnalysis: AnalyzerHandoff | null = null

function choiceId(options: { id: string }[], value: string | undefined) {
  if (!value) return null
  return options.some((option) => option.id === value) ? value : null
}

export function parseStudioHandoff(raw: string): StudioHandoff {
  try {
    const parsed = JSON.parse(raw) as unknown
    if (parsed && typeof parsed === "object" && "idea" in parsed && typeof parsed.idea === "string") {
      return parsed as StudioHandoff
    }
  } catch {
    /* Older handoffs stored the idea as plain text. */
  }
  return { idea: raw }
}

export function sendDraftToStudio(seed: StudioHandoff) {
  pendingDraft = seed
  try {
    sessionStorage.setItem(handoffKey, JSON.stringify(seed))
  } catch {
    /* The in-memory value still carries the handoff for this visit. */
  }
}

export function sendIdeaToStudio(idea: string) {
  sendDraftToStudio({ idea })
}

export function peekStudioHandoff(): StudioHandoff | null {
  if (pendingDraft) return pendingDraft
  try {
    const raw = sessionStorage.getItem(handoffKey)
    return raw ? parseStudioHandoff(raw) : null
  } catch {
    return null
  }
}

export function applyStudioHandoff(draft: StudioDraft, handed: StudioHandoff | null) {
  if (!handed) return
  draft.idea = handed.idea
  const goal = choiceId(goalOptions, handed.goal)
  const audience = choiceId(audienceOptions, handed.audience)
  const tone = choiceId(toneOptions, handed.tone)
  const output = choiceId(outputOptions, handed.output)
  if (goal) draft.goal = goal as StudioDraft["goal"]
  if (audience) draft.audience = audience as StudioDraft["audience"]
  if (tone) draft.tone = tone as StudioDraft["tone"]
  if (output) draft.output = output as StudioDraft["output"]
  if (typeof handed.context === "string") draft.context = handed.context
}

export function clearStudioHandoff() {
  pendingDraft = null
  try {
    sessionStorage.removeItem(handoffKey)
  } catch {
    /* Nothing else needs to be cleared. */
  }
}

export function parseAnalyzerHandoff(raw: string): AnalyzerHandoff {
  try {
    const parsed = JSON.parse(raw) as unknown
    if (parsed && typeof parsed === "object" && "text" in parsed && typeof parsed.text === "string") {
      return parsed as AnalyzerHandoff
    }
  } catch {
    /* Older handoffs stored the prompt as plain text. */
  }
  return { text: raw }
}

export function sendPromptToAnalyzer(prompt: string | AnalyzerHandoff) {
  pendingAnalysis = typeof prompt === "string" ? { text: prompt } : prompt
  try {
    sessionStorage.setItem(analyzerKey, JSON.stringify(pendingAnalysis))
  } catch {
    /* The in-memory value still carries the prompt for this visit. */
  }
}

export function peekAnalyzerHandoff(): AnalyzerHandoff | null {
  if (pendingAnalysis) return pendingAnalysis
  try {
    const raw = sessionStorage.getItem(analyzerKey)
    return raw ? parseAnalyzerHandoff(raw) : null
  } catch {
    return null
  }
}

export function clearAnalyzerHandoff() {
  pendingAnalysis = null
  try {
    sessionStorage.removeItem(analyzerKey)
  } catch {
    /* Nothing else needs to be cleared. */
  }
}
