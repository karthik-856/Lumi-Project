import { useMemo } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { WhyExplanation } from "@/components/studio/WhyExplanation"
import { analyzePrompt } from "@/lib/prompt-analyzer"
import type { BuiltPrompt } from "@/types/studio"

export function PromptCanvas({ prompt }: { prompt: BuiltPrompt }) {
  const reduce = useReducedMotion()
  const labels = prompt.sections.map((section) => section.label).join(", ")
  const liveScore = useMemo(() => (prompt.text ? analyzePrompt(prompt.text) : null), [prompt.text])

  return (
    <section aria-labelledby="canvas-heading" className="rounded-3xl border border-border bg-background p-5 shadow-soft md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="canvas-heading" className="text-base font-semibold tracking-tight">
          Your prompt is taking shape
        </h2>
        {liveScore ? (
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground tabular-nums">
            Score {liveScore.overall} / 100 · {liveScore.overallLabel}
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Lumi adds each answer here, so you can see the prompt form.</p>
      <p className="sr-only" aria-live="polite">
        {prompt.sections.length === 0 ? "Your prompt will appear here." : `Your prompt now includes ${labels}.`}
      </p>
      <div className="mt-4 space-y-2">
        {prompt.sections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-3 py-8 text-center">
            <p className="text-sm font-medium">Your prompt will appear here.</p>
            <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-muted-foreground">
              As you answer Lumi's questions, you'll see it take shape.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {prompt.sections.map((section) => (
              <motion.div
                key={section.id}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.24 }}
                className="rounded-xl border border-border/80 bg-surface px-3 py-2.5"
              >
                <p className="text-[13px] font-medium text-primary">{section.label}</p>
                <p className="mt-1 text-sm leading-relaxed">{section.body}</p>
                <WhyExplanation text={section.why} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </section>
  )
}
