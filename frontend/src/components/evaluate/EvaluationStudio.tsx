import { useEffect, useState, type FormEvent } from "react"
import { AdvancedOptions } from "@/components/studio/AdvancedOptions"
import { AudienceStep } from "@/components/studio/AudienceStep"
import { ContextStep } from "@/components/studio/ContextStep"
import { GoalStep } from "@/components/studio/GoalStep"
import { IdeaStep } from "@/components/studio/IdeaStep"
import { OutputStep } from "@/components/studio/OutputStep"
import { PromptCanvas } from "@/components/studio/PromptCanvas"
import { StudioProgress } from "@/components/studio/StudioProgress"
import { StudioShell } from "@/components/studio/StudioShell"
import { StudioHeadingLevel } from "@/components/studio/StudioStep"
import { ToneStep } from "@/components/studio/ToneStep"
import { Button } from "@/components/ui/button"
import { studioStepCount } from "@/data/studio-options"
import { useStudio } from "@/hooks/useStudio"
import { nextRevision, stepsFromDraft } from "@/lib/evaluation"
import type { EvaluationSession } from "@/types/evaluation"
import type { StudioDraft } from "@/types/studio"

function usableDraft(draft: StudioDraft | null) {
  if (!draft || typeof draft.idea !== "string" || !draft.advanced) return undefined
  return draft
}

export function EvaluationStudio({
  session,
  onProgress,
  onFinish,
}: {
  session: EvaluationSession
  onProgress: (progress: {
    draft: StudioDraft
    step: number
    ready: boolean
    revisions: number
    lastEditAt: number | null
    startedAt: string
  }) => void
  onFinish: (prompt: string, steps: string[]) => void
}) {
  const studio = useStudio(null, {
    ignoreHandoff: true,
    draft: usableDraft(session.guidedDraft),
    step: session.guidedStep,
    ready: session.guidedReady && Boolean(session.guidedDraft?.idea),
  })
  const [revisions, setRevisions] = useState({ count: session.guidedRevisions, lastAt: session.guidedLastEditAt })
  const [startedAt] = useState(() => session.guidedStartedAt ?? new Date().toISOString())

  useEffect(() => {
    onProgress({
      draft: studio.draft,
      step: studio.step,
      ready: studio.ready,
      revisions: revisions.count,
      lastEditAt: revisions.lastAt,
      startedAt,
    })
  }, [onProgress, revisions, startedAt, studio.draft, studio.ready, studio.step])

  function noteEdit() {
    setRevisions((current) => nextRevision(current, Date.now()))
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    studio.forward()
  }

  const primaryLabel = studio.step === studioStepCount - 1 ? "Build my prompt" : "Continue"

  const builder = (
    <>
      {studio.step === 0 ? (
        <IdeaStep
          idea={studio.draft.idea}
          error={studio.error}
          onChange={(idea) => {
            noteEdit()
            studio.update({ idea })
          }}
        />
      ) : null}
      {studio.step === 1 ? (
        <GoalStep
          goal={studio.draft.goal}
          onChange={(goal) => {
            noteEdit()
            studio.update({ goal })
          }}
        />
      ) : null}
      {studio.step === 2 ? (
        <AudienceStep
          audience={studio.draft.audience}
          audienceOther={studio.draft.audienceOther}
          onChange={(audience) => {
            noteEdit()
            studio.update({ audience })
          }}
          onOtherChange={(audienceOther) => {
            noteEdit()
            studio.update({ audienceOther })
          }}
        />
      ) : null}
      {studio.step === 3 ? (
        <ContextStep
          context={studio.draft.context}
          onChange={(context) => {
            noteEdit()
            studio.update({ context })
          }}
        />
      ) : null}
      {studio.step === 4 ? (
        <ToneStep
          tone={studio.draft.tone}
          onChange={(tone) => {
            noteEdit()
            studio.update({ tone })
          }}
        />
      ) : null}
      {studio.step === 5 ? (
        <OutputStep
          output={studio.draft.output}
          outputCustom={studio.draft.outputCustom}
          onChange={(output) => {
            noteEdit()
            studio.update({ output })
          }}
          onCustomChange={(outputCustom) => {
            noteEdit()
            studio.update({ outputCustom })
          }}
        />
      ) : null}
      {studio.step === 5 ? (
        <AdvancedOptions
          open={studio.draft.advancedOpen}
          values={studio.draft.advanced}
          onToggle={() => studio.update({ advancedOpen: !studio.draft.advancedOpen })}
          onChange={(patch) => {
            noteEdit()
            studio.updateAdvanced(patch)
          }}
        />
      ) : null}
      <div className="mt-6 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-xl px-4"
          onClick={studio.back}
          disabled={studio.step === 0 && !studio.ready}
        >
          Back
        </Button>
        <Button type="submit" className="h-11 rounded-xl px-4 sm:ml-auto">
          {primaryLabel}
        </Button>
      </div>
    </>
  )

  return (
    <StudioHeadingLevel level="h2">
      <div className="mt-8">
        <StudioProgress step={studio.step} total={studioStepCount} ready={studio.ready} />
        {studio.ready ? (
          <div className="mt-6">
            <PromptCanvas prompt={studio.prompt} />
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button type="button" className="h-11 rounded-xl px-4" onClick={() => onFinish(studio.prompt.text, stepsFromDraft(studio.draft))}>
                I'm finished with this prompt
              </Button>
              <Button type="button" variant="outline" className="h-11 rounded-xl px-4" onClick={studio.back}>
                Edit answers
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <StudioShell builder={builder} canvas={<PromptCanvas prompt={studio.prompt} />} />
          </form>
        )}
      </div>
    </StudioHeadingLevel>
  )
}
