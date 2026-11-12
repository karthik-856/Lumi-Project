import { useCallback, useEffect, useState } from "react"
import { Container } from "@/components/common/Container"
import { PageIntro } from "@/components/common/PageIntro"
import { ConfidenceScale } from "@/components/evaluate/ConfidenceScale"
import { EvaluationResults } from "@/components/evaluate/EvaluationResults"
import { EvaluationStudio } from "@/components/evaluate/EvaluationStudio"
import { Button } from "@/components/ui/button"
import { useEvaluation } from "@/hooks/useEvaluation"
import { usePageTitle } from "@/hooks/usePageTitle"
import { cn } from "@/lib/utils"
import {
  answerQuestion,
  beginUnaided,
  completeQuestionnaire,
  editUnaided,
  evaluationTask,
  finishGuided,
  finishUnaided,
  formatDuration,
  mergeGuidedProgress,
  questionnaireItems,
  rateGuided,
  rateUnaided,
  setTaskConfidence,
} from "@/lib/evaluation"
import type { EvaluationPhase, QuestionnaireId } from "@/types/evaluation"
import type { StudioDraft } from "@/types/studio"

function Elapsed({ startedAt }: { startedAt: string | null }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])
  if (!startedAt) return null
  const elapsed = Math.max(0, now - Date.parse(startedAt))
  return <p className="text-sm text-muted-foreground">Time so far: {formatDuration(elapsed)}</p>
}

function EvaluationPath({ phase }: { phase: EvaluationPhase }) {
  const steps = [
    { label: "Part A", detail: "Without Lumi" },
    { label: "Part B", detail: "With Lumi" },
    { label: "Your evaluation", detail: phase === "questionnaire" ? "A few questions" : "Compare the two" },
  ]
  const rank =
    phase === "unaided" || phase === "unaided-confidence"
      ? 1
      : phase === "guided" || phase === "guided-confidence"
        ? 2
        : phase === "questionnaire" || phase === "results"
          ? 3
          : 0
  const current = rank === 0 ? -1 : rank - 1

  return (
    <ol aria-label="Evaluation order" className="mt-6 grid grid-cols-3 gap-2">
      {steps.map((step, index) => {
        const state = index === current ? "now" : index < current ? "done" : "upcoming"
        return (
          <li
            key={step.label}
            aria-current={state === "now" ? "step" : undefined}
            className={cn("rounded-xl border px-2.5 py-2.5 sm:px-3", state === "now" ? "border-primary bg-accent" : "border-border bg-surface")}
          >
            <p className="text-sm font-medium leading-snug">
              {index + 1}. {step.label}
            </p>
            <p className="mt-0.5 text-xs leading-snug text-muted-foreground sm:text-sm">{step.detail}</p>
            <p className="mt-1 text-xs font-medium">{state === "done" ? "Done" : state === "now" ? "Now" : "Later"}</p>
          </li>
        )
      })}
    </ol>
  )
}

function TaskQuote() {
  return (
    <blockquote className="mt-6 rounded-2xl border border-border bg-accent px-4 py-4 text-base leading-relaxed">
      <p className="text-sm font-medium text-primary">Task</p>
      <p className="mt-2">{evaluationTask.brief}</p>
    </blockquote>
  )
}

export default function EvaluatePage() {
  usePageTitle("Evaluate")
  const { session, ready, update, change, reset } = useEvaluation()
  const [confirmReset, setConfirmReset] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const onProgress = useCallback(
    (progress: {
      draft: StudioDraft
      step: number
      ready: boolean
      revisions: number
      lastEditAt: number | null
      startedAt: string
    }) => {
      change((current) => mergeGuidedProgress(current, progress))
    },
    [change],
  )

  function restart() {
    setError(null)
    setConfirmReset(false)
    reset()
  }

  const resetControl = confirmReset ? (
    <div className="mt-6 flex flex-col gap-2 sm:flex-row">
      <Button type="button" variant="outline" className="h-11 rounded-xl px-4" onClick={restart}>
        Clear this evaluation
      </Button>
      <Button type="button" variant="ghost" className="h-11 rounded-xl px-4" onClick={() => setConfirmReset(false)}>
        Keep going
      </Button>
    </div>
  ) : (
    <div className="mt-6">
      <Button type="button" variant="ghost" className="h-11 rounded-xl px-4" onClick={() => setConfirmReset(true)}>
        {session.phase === "results" ? "Start new evaluation" : "Start over"}
      </Button>
    </div>
  )

  let body = null
  if (!ready) {
    body = <p className="text-sm text-muted-foreground">Loading your evaluation…</p>
  } else if (session.phase === "intro") {
    body = (
      <>
        <PageIntro
          eyebrow="Evaluate"
          title="Does Lumi make prompting easier?"
          description="Complete a prompt-writing task with and without Lumi. Compare your time, revisions, confidence, and prompt quality."
        />
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          You will write the same request twice. First on your own, with no suggestions. Then with Lumi's questions. Both prompts are scored with the same rules.
        </p>
        <EvaluationPath phase={session.phase} />
        <TaskQuote />
        <Button type="button" className="mt-6 h-11 rounded-xl px-4" onClick={() => update(beginUnaided(session, new Date().toISOString()))}>
          Begin
        </Button>
      </>
    )
  } else if (session.phase === "unaided") {
    body = (
      <>
        <PageIntro
          eyebrow="Part A · Without Lumi"
          title="Write this prompt on your own"
          description="Lumi stays quiet in this part. There are no suggestions and no score yet."
        />
        <EvaluationPath phase={session.phase} />
        <TaskQuote />
        <div className="mt-6 max-w-2xl">
          <Elapsed startedAt={session.unaidedStartedAt} />
          <label htmlFor="unaided-prompt" className="mt-4 block text-sm font-medium">
            Your prompt
          </label>
          <textarea
            id="unaided-prompt"
            value={session.unaidedDraft}
            onChange={(event) => {
              setError(null)
              change((current) => editUnaided(current, event.target.value, Date.now()))
            }}
            rows={7}
            className="mt-2 w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-base leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            placeholder="Write the prompt in your own words."
          />
          {error ? (
            <p className="mt-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <Button
            type="button"
            className="mt-4 h-11 rounded-xl px-4"
            onClick={() => {
              const next = finishUnaided(session, new Date().toISOString())
              if (next === session) {
                setError("Write a prompt before you continue.")
                return
              }
              setError(null)
              update(next)
            }}
          >
            I'm finished
          </Button>
        </div>
        {resetControl}
      </>
    )
  } else if (session.phase === "unaided-confidence") {
    body = (
      <>
        <PageIntro
          eyebrow="Part A · Without Lumi"
          title="How confident are you in that prompt?"
          description="This is your own rating. The score stays hidden until both parts are finished."
        />
        <EvaluationPath phase={session.phase} />
        <div className="mt-6 max-w-xl">
          <ConfidenceScale
            name="unaided-confidence"
            legend="Confidence"
            low="Not confident"
            high="Very confident"
            value={session.unaided?.confidence ?? null}
            onChange={(value) => change((current) => setTaskConfidence(current, "unaided", value))}
          />
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              className="h-11 rounded-xl px-4"
              disabled={session.unaided?.confidence == null}
              onClick={() => {
                const confidence = session.unaided?.confidence
                if (confidence == null) return
                update(rateUnaided(session, confidence, new Date().toISOString()))
              }}
            >
              Continue to Lumi
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl px-4"
              onClick={() => update({ ...session, phase: "unaided", updatedAt: new Date().toISOString() })}
            >
              Edit my prompt
            </Button>
          </div>
        </div>
        {resetControl}
      </>
    )
  } else if (session.phase === "guided") {
    body = (
      <>
        <PageIntro
          eyebrow="Part B · With Lumi"
          title="Build the same prompt with Lumi"
          description="Answer the questions in your own words. The task is the same as before."
        />
        <EvaluationPath phase={session.phase} />
        <TaskQuote />
        <div className="mt-4">
          <Elapsed startedAt={session.guidedStartedAt} />
        </div>
        <EvaluationStudio
          key={session.id}
          session={session}
          onProgress={onProgress}
          onFinish={(prompt, steps) => update(finishGuided(session, prompt, steps, new Date().toISOString()))}
        />
        {resetControl}
      </>
    )
  } else if (session.phase === "guided-confidence") {
    body = (
      <>
        <PageIntro
          eyebrow="Part B · With Lumi"
          title="How confident are you in the Lumi prompt?"
          description="Rate this before you see how the two prompts compare."
        />
        <EvaluationPath phase={session.phase} />
        <div className="mt-6 max-w-xl">
          <ConfidenceScale
            name="guided-confidence"
            legend="Confidence"
            low="Not confident"
            high="Very confident"
            value={session.guided?.confidence ?? null}
            onChange={(value) => change((current) => setTaskConfidence(current, "guided", value))}
          />
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              className="h-11 rounded-xl px-4"
              disabled={session.guided?.confidence == null}
              onClick={() => {
                const confidence = session.guided?.confidence
                if (confidence == null) return
                update(rateGuided(session, confidence, new Date().toISOString()))
              }}
            >
              Continue
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl px-4"
              onClick={() => update({ ...session, phase: "guided", updatedAt: new Date().toISOString() })}
            >
              Edit answers
            </Button>
          </div>
        </div>
        {resetControl}
      </>
    )
  } else if (session.phase === "questionnaire") {
    body = (
      <>
        <PageIntro
          eyebrow="A few last questions"
          title="How did Lumi feel?"
          description="Five short statements. There is no right answer."
        />
        <EvaluationPath phase={session.phase} />
        <p className="mt-4 text-sm text-muted-foreground">
          {questionnaireItems.filter((item) => session.questionnaire[item.id] != null).length} of {questionnaireItems.length} answered.
          Choose 1 for strongly disagree and 5 for strongly agree.
        </p>
        <div className="mt-4 max-w-xl space-y-3">
          {questionnaireItems.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border bg-surface px-4 py-4">
              <ConfidenceScale
                name={`question-${item.id}`}
                legend={item.statement}
                low="Strongly disagree"
                high="Strongly agree"
                showScale={false}
                value={session.questionnaire[item.id] ?? null}
                onChange={(value) => change((current) => answerQuestion(current, item.id as QuestionnaireId, value))}
              />
            </div>
          ))}
          <Button
            type="button"
            className="h-11 rounded-xl px-4"
            onClick={() => update(completeQuestionnaire(session, new Date().toISOString()))}
            disabled={questionnaireItems.some((item) => session.questionnaire[item.id] == null)}
          >
            See my results
          </Button>
        </div>
        {resetControl}
      </>
    )
  } else {
    body = (
      <>
        <PageIntro
          eyebrow="Evaluate"
          title="Your Lumi evaluation"
          description="Here is what changed between the prompt you wrote alone and the prompt you built with Lumi."
        />
        <EvaluationPath phase={session.phase} />
        <EvaluationResults session={session} />
        {resetControl}
      </>
    )
  }

  return <Container className="py-10 md:py-14">{body}</Container>
}
