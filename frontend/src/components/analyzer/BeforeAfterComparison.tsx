export function BeforeAfterComparison({ original, improved }: { original: string; improved: string }) {
  const same = original.trim() === improved.trim()

  return (
    <section aria-labelledby="comparison-heading">
      <h2 id="comparison-heading" className="text-lg font-semibold tracking-tight">
        A clearer version
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {same
          ? "Lumi kept your wording. The details it looks for are already there."
          : "Lumi suggestion. This version was assembled from the same rules, not from an outside model."}
      </p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <article className="rounded-2xl border border-border bg-surface p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Your prompt</h3>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{original}</p>
        </article>
        <article className="rounded-2xl border border-primary/30 bg-elevated p-4">
          <h3 className="text-sm font-medium text-primary">Lumi suggestion</h3>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{improved}</p>
        </article>
      </div>
    </section>
  )
}
