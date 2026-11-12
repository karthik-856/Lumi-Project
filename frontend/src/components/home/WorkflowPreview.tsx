import { useEffect, useState, type ReactNode } from "react"
import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

const promptText = "Explain Python functions to a beginner using two simple examples."

export function WorkflowPreview() {
  const prefersReduce = useReducedMotion()
  const [step, setStep] = useState(0)
  const phase = prefersReduce ? 2 : step

  useEffect(() => {
    if (prefersReduce) return
    const guidance = window.setTimeout(() => setStep(1), 700)
    const prompt = window.setTimeout(() => setStep(2), 1500)
    return () => {
      window.clearTimeout(guidance)
      window.clearTimeout(prompt)
    }
  }, [prefersReduce])

  return (
    <figure className="rounded-3xl border border-border bg-elevated p-4 shadow-soft sm:p-5 lg:p-6">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm font-medium">How a prompt takes shape</p>
        <p className="text-xs text-muted-foreground">Idea, then guidance, then the prompt</p>
      </figcaption>

      <ol className="mt-4">
        <li>
          <Stage kicker="Idea" question="What are you trying to accomplish?" active>
            <p className="text-sm leading-relaxed">I want to understand Python functions.</p>
          </Stage>
          <Connector reached={phase >= 1} />
        </li>
        <li>
          <Stage kicker="Guidance" question="Who is this for?" active={phase >= 1}>
            <p
              className={cn(
                "inline-flex min-h-8 items-center rounded-full border px-3 text-sm",
                phase >= 1
                  ? "border-primary bg-accent font-medium text-accent-foreground"
                  : "border-border text-muted-foreground",
              )}
            >
              A beginner
            </p>
          </Stage>
          <Connector reached={phase >= 2} />
        </li>
        <li>
          <Stage
            kicker="Prompt"
            question={phase >= 2 ? promptText : "The prompt appears once the reader is named."}
            active={phase >= 2}
          />
        </li>
      </ol>

      <p
        className={cn(
          "mt-4 rounded-xl bg-accent px-3 py-2.5 text-sm leading-relaxed text-accent-foreground transition-opacity",
          phase >= 2 ? "opacity-100" : "opacity-70",
        )}
      >
        <span className="font-medium">Why this helps. </span>
        Naming the reader tells the AI which words and examples to use.
      </p>
    </figure>
  )
}

function Stage({
  kicker,
  question,
  active,
  children,
}: {
  kicker: string
  question: string
  active: boolean
  children?: ReactNode
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3.5 transition-colors",
        active ? "border-primary/40 bg-surface" : "border-border bg-background",
      )}
    >
      <p className="text-sm font-medium text-primary">{kicker}</p>
      <p className={cn("mt-1 text-[15px] font-semibold tracking-tight", active ? "text-foreground" : "text-muted-foreground")}>
        {question}
      </p>
      {children ? <div className="mt-2">{children}</div> : null}
    </div>
  )
}

function Connector({ reached }: { reached: boolean }) {
  return (
    <div aria-hidden="true" className="flex justify-center py-1.5">
      <span className={cn("block h-5 w-0.5 rounded-full", reached ? "bg-primary" : "bg-border")} />
    </div>
  )
}
