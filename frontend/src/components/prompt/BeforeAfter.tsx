import { exampleOriginal, exampleSegments } from "@/data/examples"

const labels = [...new Set(exampleSegments.flatMap((segment) => ("label" in segment ? [segment.label] : [])))]

export function BeforeAfter() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="text-sm font-medium text-muted-foreground">Original</h3>
        <p className="mt-3 text-base leading-relaxed">{exampleOriginal}</p>
      </article>
      <article className="rounded-2xl border border-primary/30 bg-elevated p-5 shadow-soft">
        <h3 className="text-sm font-medium text-primary">Improved</h3>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="What was added">
          {labels.map((label) => (
            <li key={label} className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
              {label}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-base leading-relaxed">
          {exampleSegments.map((segment) =>
            "label" in segment ? (
              <mark key={segment.label} className="rounded bg-accent px-0.5 text-foreground">
                {segment.text}
              </mark>
            ) : (
              <span key={segment.text}>{segment.text}</span>
            ),
          )}
        </p>
      </article>
    </div>
  )
}
