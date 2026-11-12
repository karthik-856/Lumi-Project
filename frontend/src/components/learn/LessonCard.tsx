import { Link } from "react-router-dom"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { LessonContent } from "@/data/curriculum"
import { useLearning } from "@/hooks/useLearning"
import type { LessonStatus } from "@/types/learning"

const statusLabel: Record<LessonStatus, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  completed: "Completed",
}

const actionLabel: Record<LessonStatus, string> = {
  "not-started": "Start",
  "in-progress": "Continue",
  completed: "Review",
}

export function LessonCard({ lesson }: { lesson: LessonContent }) {
  const { statusFor, markStarted } = useLearning()
  const status = statusFor(lesson.id)

  return (
    <article className="rounded-2xl border border-border bg-elevated p-4 shadow-soft md:p-5">
      <div className="flex gap-4">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-sm font-semibold"
          aria-hidden="true"
        >
          {status === "completed" ? <Check className="size-4" /> : lesson.number}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h3 className="text-base font-semibold tracking-tight">
              <span className="sr-only">Lesson {lesson.number}. </span>
              {lesson.title}
            </h3>
            <p className="text-sm text-muted-foreground">{statusLabel[status]}</p>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{lesson.description}</p>
          <p className="mt-2 text-sm">{lesson.difficulty}</p>
          <Button asChild className="mt-4 h-11 rounded-xl px-4">
            <Link
              to={`/learn/lessons/${lesson.id}`}
              onClick={() => {
                if (status === "not-started") markStarted(lesson.id)
              }}
            >
              {actionLabel[status]}
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
