import { WhyExplanation } from "@/components/studio/WhyExplanation"
import type { Suggestion } from "@/lib/prompt-analyzer"

export function SuggestionList({ suggestions }: { suggestions: Suggestion[] }) {
  return (
    <section aria-labelledby="suggestions-heading">
      <h2 id="suggestions-heading" className="text-lg font-semibold tracking-tight">
        Make it even better
      </h2>
      {suggestions.length === 0 ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Lumi doesn't see a missing piece that would clearly help this prompt.
        </p>
      ) : (
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id} className="rounded-2xl border border-border bg-surface p-4">
              <h3 className="font-semibold tracking-tight">+ {suggestion.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{suggestion.detail}</p>
              <WhyExplanation label="Why?" text={suggestion.why} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
