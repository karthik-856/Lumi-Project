import { Container } from "@/components/common/Container"

const steps = [
  {
    number: "01",
    title: "Tell Lumi what you want",
    body: "Start in your own words. A perfect prompt is not required.",
  },
  {
    number: "02",
    title: "Answer a few simple questions",
    body: "Lumi asks who it is for, what the AI should know, and what shape you want back.",
  },
  {
    number: "03",
    title: "Understand how your prompt improves",
    body: "See what was added, and why that detail changes the answer.",
  },
  {
    number: "04",
    title: "Use what you learned next time",
    body: "The reason stays with you, so the next idea is easier to explain.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-lumi-works" aria-labelledby="how-lumi-heading" className="pt-8 pb-6 md:pt-10 md:pb-8">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">How Lumi works</p>
          <h2 id="how-lumi-heading" className="type-h2 mt-2 text-balance">
            Guidance first. The prompt comes after.
          </h2>
        </div>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.number} className="rounded-2xl border border-border bg-elevated p-4 shadow-soft">
              <span className="text-sm font-semibold text-primary">{step.number}</span>
              <h3 className="mt-3 text-base font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
