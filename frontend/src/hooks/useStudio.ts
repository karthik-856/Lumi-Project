import { useEffect, useMemo, useState } from "react"
import { createStudioDraft, studioStepCount } from "@/data/studio-options"
import { buildPrompt } from "@/lib/prompt-engine"
import { applyStudioHandoff, clearStudioHandoff, peekStudioHandoff, type StudioHandoff } from "@/lib/studio-handoff"
import type { GoalId, StudioDraft } from "@/types/studio"

export type StudioRecord = {
  promptId: string | null
  templateId?: string
  templateCategory?: string
  title?: string
  favorite: boolean
}

function recordFrom(handed: StudioHandoff | null): StudioRecord {
  return {
    promptId: handed?.promptId ?? null,
    templateId: handed?.templateId,
    templateCategory: handed?.templateCategory,
    title: handed?.title,
    favorite: Boolean(handed?.favorite),
  }
}

function cloneDraft(draft: StudioDraft): StudioDraft {
  return { ...draft, advanced: { ...draft.advanced } }
}

export function useStudio(
  initialGoal: GoalId | null,
  start?: { step?: number; advancedOpen?: boolean; ignoreHandoff?: boolean; draft?: StudioDraft; ready?: boolean },
) {
  const ignoreHandoff = start?.ignoreHandoff === true
  const [seedNote] = useState(() => (ignoreHandoff ? null : (peekStudioHandoff()?.note ?? null)))
  const [record, setRecord] = useState<StudioRecord>(() =>
    ignoreHandoff ? { promptId: null, favorite: false } : recordFrom(peekStudioHandoff()),
  )
  const [draft, setDraft] = useState<StudioDraft>(() => {
    if (ignoreHandoff) {
      const next = start?.draft ? cloneDraft(start.draft) : createStudioDraft(initialGoal)
      if (start?.advancedOpen) next.advancedOpen = true
      return next
    }
    const next = createStudioDraft(initialGoal)
    applyStudioHandoff(next, peekStudioHandoff())
    if (start?.advancedOpen) next.advancedOpen = true
    return next
  })

  useEffect(() => {
    if (!ignoreHandoff) clearStudioHandoff()
  }, [ignoreHandoff])
  const [step, setStep] = useState(() => {
    const requested = start?.step ?? 0
    if (requested < 0 || requested >= studioStepCount) return 0
    return requested
  })
  const [ready, setReady] = useState(() => (ignoreHandoff ? Boolean(start?.ready) : false))
  const [error, setError] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [savedText, setSavedText] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  const prompt = useMemo(() => buildPrompt(draft), [draft])

  function update(patch: Partial<StudioDraft>) {
    setDraft((current) => ({ ...current, ...patch }))
    setError(null)
    setConfirmReset(false)
  }

  function updateAdvanced(patch: Partial<StudioDraft["advanced"]>) {
    setDraft((current) => ({ ...current, advanced: { ...current.advanced, ...patch } }))
    setConfirmReset(false)
  }

  function goToStep(index: number) {
    if (index < 0 || index >= studioStepCount) return
    setReady(false)
    setStep(index)
    setError(null)
    setConfirmReset(false)
  }

  function back() {
    setError(null)
    setConfirmReset(false)
    if (ready) {
      setReady(false)
      return
    }
    if (step > 0) setStep((current) => current - 1)
  }

  function forward() {
    if (!draft.idea.trim()) {
      setStep(0)
      setReady(false)
      setError("Tell Lumi what you're trying to accomplish first.")
      return false
    }
    setError(null)
    if (step < studioStepCount - 1) {
      setStep((current) => current + 1)
      return true
    }
    setReady(true)
    return true
  }

  function restart() {
    setDraft(createStudioDraft(null))
    setRecord({ promptId: null, favorite: false })
    setStep(0)
    setReady(false)
    setError(null)
    setSavedId(null)
    setSavedText(null)
    setConfirmReset(false)
  }

  function ensureId() {
    if (record.promptId) return record.promptId
    const id = crypto.randomUUID()
    setRecord((current) => ({ ...current, promptId: id }))
    return id
  }

  function markSaved(id: string) {
    setSavedId(id)
    setRecord((current) => ({ ...current, promptId: id }))
    setSavedText(prompt.text)
  }

  return {
    draft,
    record,
    ensureId,
    seedNote,
    prompt,
    step,
    ready,
    error,
    savedId,
    saved: savedText !== null && savedText === prompt.text,
    confirmReset,
    setConfirmReset,
    update,
    updateAdvanced,
    goToStep,
    back,
    forward,
    restart,
    markSaved,
  }
}
