import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { compareTasks, formatDuration, hciPrinciples, usabilityAverage } from "@/lib/evaluation"
import { downloadFile, evaluationToCsv } from "@/lib/export"
import type { EvaluationSession } from "@/types/evaluation"

function Meter({ label, value, max }: { label: string; value: number; max: number }) {
  const width = Math.max(0, Math.min(100, Math.round((value / max) * 100)))
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="font-medium tabular-nums">{value}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}

export function EvaluationResults({ session }: { session: EvaluationSession }) {
  const unaided = session.unaided
  const guided = session.guided
  if (!unaided || !guided || unaided.confidence == null || guided.confidence == null) {
    return <p className="mt-6 text-sm text-muted-foreground">This evaluation is still missing a result.</p>
  }
  const compared = compareTasks(unaided, guided)
  const average = usabilityAverage(session.questionnaire)

  return (
    <div className="mt-8 max-w-2xl space-y-10">
      <p className="text-xl font-semibold tracking-tight" role="status">
        {compared.headline}
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Both parts used the same task. Both prompts were scored with the same rules. Lumi did not change the scoring to favor the guided prompt.
      </p>

      <section aria-labelledby="quality-comparison">
        <h2 id="quality-comparison" className="text-lg font-semibold tracking-tight">
          Prompt quality
        </h2>
        <div className="mt-4 space-y-3">
          <Meter label="Without Lumi" value={unaided.score} max={100} />
          <Meter label="With Lumi" value={guided.score} max={100} />
        </div>
        <p className="sr-only">
          Without Lumi scored {unaided.score} out of 100. With Lumi scored {guided.score} out of 100.
        </p>
      </section>

      <section aria-labelledby="confidence-comparison">
        <h2 id="confidence-comparison" className="text-lg font-semibold tracking-tight">
          Confidence
        </h2>
        <div className="mt-4 space-y-3">
          <Meter label="Without Lumi" value={unaided.confidence} max={5} />
          <Meter label="With Lumi" value={guided.confidence} max={5} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {unaided.confidence}/5 without Lumi · {guided.confidence}/5 with Lumi
        </p>
      </section>

      <section aria-labelledby="effort-comparison">
        <h2 id="effort-comparison" className="text-lg font-semibold tracking-tight">
          Time and revisions
        </h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border px-4 py-3">
            <dt className="text-sm text-muted-foreground">Without Lumi</dt>
            <dd className="mt-1 text-base font-medium">{formatDuration(unaided.durationMs)}</dd>
            <dd className="text-sm text-muted-foreground">{unaided.revisions === 1 ? "1 revision" : `${unaided.revisions} revisions`}</dd>
          </div>
          <div className="rounded-2xl border border-border px-4 py-3">
            <dt className="text-sm text-muted-foreground">With Lumi</dt>
            <dd className="mt-1 text-base font-medium">{formatDuration(guided.durationMs)}</dd>
            <dd className="text-sm text-muted-foreground">{guided.revisions === 1 ? "1 revision" : `${guided.revisions} revisions`}</dd>
          </div>
        </dl>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          A longer time or another revision is not a better or worse score. It is only what happened while you wrote.
        </p>
      </section>

      <section aria-labelledby="what-changed">
        <h2 id="what-changed" className="text-lg font-semibold tracking-tight">
          What changed?
        </h2>
        {compared.shifts.improved.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {compared.shifts.improved.map((item) => (
              <li key={item} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">No single part of the guided prompt pulled clearly ahead.</p>
        )}
        {compared.shifts.declined.length > 0 ? (
          <div className="mt-4">
            <h3 className="text-sm font-medium">Stronger without Lumi</h3>
            <ul className="mt-2 space-y-2">
              {compared.shifts.declined.map((item) => (
                <li key={item} className="rounded-xl border border-border px-3 py-2 text-sm leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {guided.stepsUsed.length > 0 ? (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Guidance used: {guided.stepsUsed.join(", ")}.</p>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">No extra guidance was selected in Studio.</p>
        )}
      </section>

      <section aria-labelledby="usability-score">
        <h2 id="usability-score" className="text-lg font-semibold tracking-tight">
          Usability
        </h2>
        <p className="mt-3 text-base">
          {average == null ? "The questionnaire is incomplete." : `Your usability score is ${average} out of 5.`}
        </p>
      </section>

      <details className="rounded-2xl border border-border px-4 py-3">
        <summary className="cursor-pointer text-sm font-medium">Read both prompts</summary>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium">Without Lumi</h3>
            <pre className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{unaided.prompt}</pre>
          </div>
          <div>
            <h3 className="text-sm font-medium">With Lumi</h3>
            <pre className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{guided.prompt}</pre>
          </div>
        </div>
      </details>

      <section aria-labelledby="hci-principles">
        <h2 id="hci-principles" className="text-lg font-semibold tracking-tight">
          What this evaluation looks at
        </h2>
        <dl className="mt-4 space-y-4">
          {hciPrinciples.map((item) => (
            <div key={item.title}>
              <dt className="text-sm font-medium">{item.title}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-xl px-4"
          onClick={() => {
            downloadFile(`lumi-evaluation-${session.id}.json`, JSON.stringify(session, null, 2), "application/json;charset=utf-8")
            toast.success("Evaluation exported as JSON.")
          }}
        >
          Export report (JSON)
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-xl px-4"
          onClick={() => {
            downloadFile(`lumi-evaluation-${session.id}.csv`, evaluationToCsv(session), "text/csv;charset=utf-8")
            toast.success("Evaluation exported as CSV.")
          }}
        >
          Export summary (CSV)
        </Button>
      </div>
    </div>
  )
}
