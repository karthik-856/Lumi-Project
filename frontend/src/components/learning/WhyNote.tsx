import { ChevronDown } from "lucide-react"

export function WhyNote({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-xl border border-border bg-surface px-4 py-3">
      <summary className="flex cursor-pointer items-center justify-between gap-3 font-medium">
        <span>{question}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <p className="pt-2 text-sm leading-relaxed text-muted-foreground">{answer}</p>
    </details>
  )
}
