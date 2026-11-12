import type { DimensionScore } from "@/lib/prompt-analyzer"

export function ScoreDimension({ dimension }: { dimension: DimensionScore }) {
  return (
    <article className="rounded-2xl border border-border bg-elevated p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-semibold tracking-tight">{dimension.label}</h3>
        <p className="tabular-nums">
          <span className="text-base font-semibold">{dimension.score}</span>
          <span className="text-sm text-muted-foreground"> / 100</span>
        </p>
      </div>
      <p className="mt-1 text-sm font-medium">{dimension.status}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{dimension.explanation}</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <div className="h-full rounded-full bg-primary" style={{ width: `${dimension.score}%` }} />
      </div>
    </article>
  )
}
