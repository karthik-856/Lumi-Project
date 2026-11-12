import { lessons } from "@/data/curriculum"
import { useLearning } from "@/hooks/useLearning"
import { nextLesson } from "@/lib/learning-progress"

export function LearningProgress() {
  const learning = useLearning()
  const total = lessons.length
  const next = nextLesson(learning.state)
  const width = Math.round((learning.completedCount / total) * 100)

  return (
    <section aria-labelledby="learning-progress-heading" className="rounded-3xl border border-border bg-elevated p-5 shadow-soft md:p-6">
      <p className="text-sm font-medium text-primary">{learning.level}</p>
      <h2 id="learning-progress-heading" className="mt-2 text-xl font-semibold tracking-tight">
        {learning.completedCount} of {total} concepts learned
      </h2>
      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={learning.completedCount}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label="Concepts learned"
      >
        <div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }} />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{learning.recommendationText}</p>
      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-muted-foreground">Lessons completed</dt>
          <dd className="mt-1 font-medium">
            {learning.completedCount} of {total}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Challenges completed</dt>
          <dd className="mt-1 font-medium">{learning.challengeCount}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Next recommended lesson</dt>
          <dd className="mt-1 font-medium">{next ? next.title : "Path complete"}</dd>
        </div>
      </dl>
    </section>
  )
}
