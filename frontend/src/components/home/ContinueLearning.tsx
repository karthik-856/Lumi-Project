import { Link } from "react-router-dom"
import { Container } from "@/components/common/Container"
import { Button } from "@/components/ui/button"
import { lessons } from "@/data/curriculum"
import { useLearning } from "@/hooks/useLearning"
import { lessonStatus, nextLesson } from "@/lib/learning-progress"

export function ContinueLearning() {
  const learning = useLearning()
  const next = nextLesson(learning.state)
  const total = lessons.length
  const explored = lessons.filter((lesson) => lessonStatus(learning.state, lesson.id) !== "not-started").length
  const progress = Math.round((explored / total) * 100)

  return (
    <section aria-labelledby="journey-heading" className="pb-10 md:pb-12">
      <Container>
        <div className="rounded-3xl border border-border bg-elevated p-6 shadow-soft md:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:items-center">
            <div>
              <p className="text-sm font-medium text-primary">Continue learning</p>
              <h2 id="journey-heading" className="type-h2 mt-2">
                Your learning journey
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{learning.recommendationText}</p>
              <p className="mt-6 text-sm font-medium">Current level · {learning.level}</p>
              <div
                className="mt-3 h-2 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={explored}
                aria-valuemin={0}
                aria-valuemax={total}
                aria-label="Concepts explored"
              >
                <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {explored} of {total} concepts explored
              </p>
            </div>
            {next ? (
              <article className="rounded-2xl border border-border bg-surface p-5">
                <p className="text-sm text-muted-foreground">Next</p>
                <h3 className="mt-1 text-lg font-semibold">{next.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{next.description}</p>
                <Button asChild className="mt-5 h-11 rounded-xl px-4">
                  <Link to={`/learn/lessons/${next.id}`}>Continue learning</Link>
                </Button>
              </article>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}
