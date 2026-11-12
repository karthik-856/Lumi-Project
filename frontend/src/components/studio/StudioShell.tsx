import type { ReactNode } from "react"

export function StudioShell({ builder, canvas }: { builder: ReactNode; canvas: ReactNode }) {
  return (
    <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
      <section aria-labelledby="builder-heading" className="rounded-3xl border border-border bg-elevated p-5 shadow-soft md:p-6">
        <p id="builder-heading" className="text-sm font-medium text-muted-foreground">
          Guided builder
        </p>
        <div className="mt-4">{builder}</div>
      </section>
      <div className="lg:sticky lg:top-24">{canvas}</div>
    </div>
  )
}
