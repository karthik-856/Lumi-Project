export function WhyExplanation({ children }: { children: string }) {
  return (
    <section aria-labelledby="why-heading" className="rounded-2xl border border-border bg-elevated p-4">
      <h2 id="why-heading" className="text-lg font-semibold tracking-tight">
        Why?
      </h2>
      <p className="mt-2 text-base leading-relaxed">{children}</p>
    </section>
  )
}
