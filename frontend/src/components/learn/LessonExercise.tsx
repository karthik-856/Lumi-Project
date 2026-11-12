import { useState } from "react"
import { Check, Minus } from "lucide-react"
import type { LessonExercise as Exercise } from "@/data/curriculum"
import { cn } from "@/lib/utils"

export function LessonExercise({ exercise }: { exercise: Exercise }) {
  const [choice, setChoice] = useState<string | null>(null)
  const correct = choice === exercise.correctId

  return (
    <section aria-labelledby="try-heading">
      <h2 id="try-heading" className="text-lg font-semibold tracking-tight">
        Try it
      </h2>
      <p className="mt-2 text-base">{exercise.question}</p>
      <div className="mt-4 grid gap-3" role="group" aria-label={exercise.question}>
        {exercise.options.map((option) => {
          const selected = choice === option.id
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setChoice(option.id)}
              className={cn(
                "min-h-11 rounded-2xl border p-4 text-left",
                selected ? "border-primary bg-accent" : "border-border bg-surface hover:border-primary/40",
              )}
            >
              <span className="text-sm font-medium">{option.label}</span>
              <span className="mt-1 block text-base leading-relaxed">{option.prompt}</span>
              {selected ? <span className="mt-2 block text-sm font-medium">Selected</span> : null}
            </button>
          )
        })}
      </div>
      {choice ? (
        <div role="status" className="mt-4 flex gap-3 rounded-2xl border border-border bg-elevated p-4">
          {correct ? <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> : <Minus className="mt-0.5 size-4 shrink-0" aria-hidden="true" />}
          <p className="text-sm leading-relaxed">{correct ? exercise.correctFeedback : exercise.incorrectFeedback}</p>
        </div>
      ) : null}
    </section>
  )
}
