import { Check } from "lucide-react"

export function StrengthList({ strengths }: { strengths: string[] }) {
  return (
    <section aria-labelledby="strengths-heading" className="rounded-3xl border border-border bg-elevated p-5 shadow-soft">
      <h2 id="strengths-heading" className="text-lg font-semibold tracking-tight">
        What's already working
      </h2>
      {strengths.length === 0 ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          You have a starting point. The notes below show the next useful detail.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {strengths.map((strength) => (
            <li key={strength} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
