import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BeforeAfterExample } from "@/components/learn/BeforeAfterExample"
import { LessonConcept } from "@/components/learn/LessonConcept"
import { LessonExercise } from "@/components/learn/LessonExercise"
import { WhyExplanation } from "@/components/learn/WhyExplanation"
import { Button } from "@/components/ui/button"
import type { LessonContent } from "@/data/curriculum"
import { useLearning } from "@/hooks/useLearning"
import { sendIdeaToStudio, sendPromptToAnalyzer } from "@/lib/studio-handoff"

export function LessonPage({ lesson }: { lesson: LessonContent }) {
  const learning = useLearning()
  const navigate = useNavigate()
  const status = learning.statusFor(lesson.id)
  const done = status === "completed"

  useEffect(() => {
    learning.markStarted(lesson.id)
  }, [learning, lesson.id])

  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-sm font-medium text-primary">Lesson {lesson.number}</p>
      <h1 className="type-h2 mt-2 text-balance">{lesson.title}</h1>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{lesson.description}</p>
      <p className="mt-2 text-sm">
        {lesson.difficulty}
        <span className="text-muted-foreground"> · {done ? "Completed" : status === "in-progress" ? "In progress" : "Not started"}</span>
      </p>

      <div className="mt-10 space-y-8">
        <LessonConcept concept={lesson.concept} whyItMatters={lesson.whyItMatters} />
        <BeforeAfterExample before={lesson.before} after={lesson.after} />
        <WhyExplanation>{lesson.whyChanged}</WhyExplanation>
        <LessonExercise exercise={lesson.exercise} />
      </div>

      <section aria-labelledby="practice-heading" className="mt-10 rounded-3xl border border-border bg-elevated p-5">
        <h2 id="practice-heading" className="text-lg font-semibold tracking-tight">
          Try it in Studio
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{lesson.studioNote}</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            className="h-11 rounded-xl px-4"
            onClick={() => {
              sendIdeaToStudio(lesson.studioIdea)
              navigate(`/create/studio?focus=${lesson.studioFocus}`)
            }}
          >
            Try it in Studio
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl px-4"
            onClick={() => {
              sendPromptToAnalyzer(lesson.analyzePrompt)
              navigate("/analyze")
            }}
          >
            Analyze a prompt
          </Button>
        </div>
        <div className="mt-6 border-t border-border pt-5">
          <h3 className="text-sm font-semibold tracking-tight">Lesson progress</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Mark it when the idea makes sense. You can come back and review it later.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4 h-11 rounded-xl px-4"
            disabled={done}
            onClick={() => learning.completeLesson(lesson.id)}
          >
            {done ? "Lesson completed" : "Complete lesson"}
          </Button>
        </div>
        <p className="mt-4">
          <Link to="/learn" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
            Back to the path
          </Link>
        </p>
      </section>
    </article>
  )
}
