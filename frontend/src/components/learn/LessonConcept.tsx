export function LessonConcept({ concept, whyItMatters }: { concept: string; whyItMatters: string }) {
  return (
    <section aria-labelledby="concept-heading">
      <h2 id="concept-heading" className="text-lg font-semibold tracking-tight">
        Concept
      </h2>
      <p className="mt-3 text-base leading-relaxed">{concept}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{whyItMatters}</p>
    </section>
  )
}
