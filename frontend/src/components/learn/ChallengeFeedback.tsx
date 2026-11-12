import { Check, Minus } from "lucide-react"

export function ChallengeFeedback({ correct, explanation }: { correct: boolean; explanation: string }) {
  return (
    <div role="status" className="flex gap-3 rounded-2xl border border-border bg-elevated p-4">
      {correct ? <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> : <Minus className="mt-0.5 size-4 shrink-0" aria-hidden="true" />}
      <div>
        <p className="font-semibold">{correct ? "Good choice." : "Keep exploring."}</p>
        <p className="mt-2 text-sm leading-relaxed">{explanation}</p>
      </div>
    </div>
  )
}
