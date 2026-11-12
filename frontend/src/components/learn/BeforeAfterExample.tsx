export function BeforeAfterExample({ before, after }: { before: string; after: string }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <section aria-labelledby="before-heading" className="rounded-2xl border border-border bg-surface p-4">
        <h2 id="before-heading" className="text-sm font-medium text-muted-foreground">
          Before
        </h2>
        <p className="mt-2 text-base leading-relaxed">{before}</p>
      </section>
      <section aria-labelledby="after-heading" className="rounded-2xl border border-border bg-accent p-4">
        <h2 id="after-heading" className="text-sm font-medium text-primary">
          After
        </h2>
        <p className="mt-2 text-base leading-relaxed">{after}</p>
      </section>
    </div>
  )
}
