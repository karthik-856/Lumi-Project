import { useEffect, useRef, type FormEvent } from "react"
import { useSearchParams } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { AdvancedOptions } from "@/components/studio/AdvancedOptions"
import { AudienceStep } from "@/components/studio/AudienceStep"
import { BeforeAfter } from "@/components/studio/BeforeAfter"
import { ContextStep } from "@/components/studio/ContextStep"
import { GoalStep } from "@/components/studio/GoalStep"
import { IdeaStep } from "@/components/studio/IdeaStep"
import { OutputStep } from "@/components/studio/OutputStep"
import { PromptCanvas } from "@/components/studio/PromptCanvas"
import { StudioCompletion } from "@/components/studio/StudioCompletion"
import { StudioHeader } from "@/components/studio/StudioHeader"
import { StudioNav } from "@/components/studio/StudioNav"
import { StudioShell } from "@/components/studio/StudioShell"
import { ToneStep } from "@/components/studio/ToneStep"
import { Container } from "@/components/common/Container"
import { studioCues } from "@/data/curriculum"
import { parseGoal, studioStepCount } from "@/data/studio-options"
import { usePageTitle } from "@/hooks/usePageTitle"
import { useStudio } from "@/hooks/useStudio"

export function StudioExperience() {
  usePageTitle("Studio")
  const [params] = useSearchParams()
  const focus = params.get("focus")
  const cue = focus ? studioCues[focus] : undefined
  const studio = useStudio(parseGoal(params.get("goal")), cue ? { step: cue.step, advancedOpen: cue.advanced } : undefined)
  const reduce = useReducedMotion()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstFocus = useRef(true)

  useEffect(() => {
    if (firstFocus.current) {
      firstFocus.current = false
      return
    }
    headingRef.current?.focus()
  }, [studio.step, studio.ready])

  const canLeave = studio.step === 0 && !studio.ready
  const primaryLabel = studio.step === studioStepCount - 1 ? "Build my prompt" : "Continue"

  function submit(event: FormEvent) {
    event.preventDefault()
    studio.forward()
  }

  const stepView = (
    <motion.div
      key={studio.step}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      {studio.step === 0 ? (
        <IdeaStep
          idea={studio.draft.idea}
          error={studio.error}
          headingRef={headingRef}
          onChange={(idea) => studio.update({ idea })}
        />
      ) : null}
      {studio.step === 1 ? (
        <GoalStep goal={studio.draft.goal} headingRef={headingRef} onChange={(goal) => studio.update({ goal })} />
      ) : null}
      {studio.step === 2 ? (
        <AudienceStep
          audience={studio.draft.audience}
          audienceOther={studio.draft.audienceOther}
          headingRef={headingRef}
          onChange={(audience) => studio.update({ audience })}
          onOtherChange={(audienceOther) => studio.update({ audienceOther })}
        />
      ) : null}
      {studio.step === 3 ? (
        <ContextStep context={studio.draft.context} headingRef={headingRef} onChange={(context) => studio.update({ context })} />
      ) : null}
      {studio.step === 4 ? (
        <ToneStep tone={studio.draft.tone} headingRef={headingRef} onChange={(tone) => studio.update({ tone })} />
      ) : null}
      {studio.step === 5 ? (
        <OutputStep
          output={studio.draft.output}
          outputCustom={studio.draft.outputCustom}
          headingRef={headingRef}
          onChange={(output) => studio.update({ output })}
          onCustomChange={(outputCustom) => studio.update({ outputCustom })}
        />
      ) : null}
      {studio.step === 5 ? (
        <>
          <AdvancedOptions
            open={studio.draft.advancedOpen}
            values={studio.draft.advanced}
            onToggle={() => studio.update({ advancedOpen: !studio.draft.advancedOpen })}
            onChange={studio.updateAdvanced}
          />
          {studio.prompt.task ? (
            <details className="mt-6 rounded-xl border border-border bg-surface px-4 py-3">
              <summary className="cursor-pointer text-sm font-medium">See what changed</summary>
              <div className="mt-4">
                <BeforeAfter idea={studio.draft.idea} prompt={studio.prompt} hideTitle />
              </div>
            </details>
          ) : null}
        </>
      ) : null}
      <StudioNav canLeave={canLeave} onBack={studio.back} primaryLabel={primaryLabel} />
    </motion.div>
  )

  return (
    <Container className="py-6 md:py-8">
      <StudioHeader step={studio.step} total={studioStepCount} ready={studio.ready} canLeave={canLeave} onBack={studio.back} />
      {cue ? (
        <p className="mt-4 rounded-2xl border border-border bg-accent px-4 py-3 text-sm leading-relaxed">
          From your lesson. {cue.note}
        </p>
      ) : null}
      {studio.seedNote ? (
        <p className="mt-4 rounded-2xl border border-border bg-accent px-4 py-3 text-sm leading-relaxed">
          Starting point. {studio.seedNote}
        </p>
      ) : null}
      {studio.ready ? (
        <StudioCompletion
          draft={studio.draft}
          prompt={studio.prompt}
          saved={studio.saved}
          savedId={studio.savedId}
          confirmReset={studio.confirmReset}
          headingRef={headingRef}
          record={studio.record}
          ensureId={studio.ensureId}
          onEdit={() => studio.goToStep(studio.step)}
          onRestart={studio.restart}
          onRequestReset={() => studio.setConfirmReset(true)}
          onSaved={studio.markSaved}
        />
      ) : (
        <form onSubmit={submit}>
          <StudioShell builder={stepView} canvas={<PromptCanvas prompt={studio.prompt} />} />
        </form>
      )}
    </Container>
  )
}
