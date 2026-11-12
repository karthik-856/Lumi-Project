import type { BuiltPrompt } from "@/types/studio"

export function BeforeAfter({ idea, prompt, hideTitle = false }: { idea: string; prompt: BuiltPrompt; hideTitle?: boolean }) {
  const added = prompt.additions.length > 0

  return (
    <div>
      {hideTitle ? null : <h3 className="text-base font-semibold tracking-tight">See what changed</h3>}
      <p className={hideTitle ? "text-sm leading-relaxed text-muted-foreground" : "mt-1 text-sm leading-relaxed text-muted-foreground"}>
        {added
          ? "Lumi added a few details to make your request clearer."
          : "This prompt stays close to your idea. Add a detail whenever you want a more specific answer."}
      </p>
      {added ? (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Details Lumi added">
          {prompt.additions.map((label) => (
            <li key={label} className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
              + {label}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <article className="rounded-2xl border border-border bg-surface p-4">
          <h4 className="text-sm font-medium text-muted-foreground">Your original idea</h4>
          <p className="mt-2 text-sm leading-relaxed">{idea.trim()}</p>
        </article>
        <article className="rounded-2xl border border-primary/30 bg-elevated p-4">
          <h4 className="text-sm font-medium text-primary">Lumi's guided prompt</h4>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{prompt.text}</p>
        </article>
      </div>
    </div>
  )
}
