export function AnalyzerEmptyState() {
  return (
    <section aria-labelledby="analyzer-empty-heading" className="rounded-3xl border border-dashed border-border bg-surface px-6 py-10">
      <h2 id="analyzer-empty-heading" className="text-lg font-semibold tracking-tight">
        Your prompt analysis will appear here.
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Paste a prompt to see what Lumi notices.
      </p>
    </section>
  )
}
