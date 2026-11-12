import { Container } from "@/components/common/Container"

const gains = ["Prompt created", "Feedback received", "Concept learned", "Skill improved"]

export function LearningGain() {
  return (
    <section aria-labelledby="better-heading" className="pb-10 md:pb-12">
      <Container>
        <div className="rounded-2xl border border-border bg-surface px-5 py-5 md:px-6">
          <h2 id="better-heading" className="text-lg font-semibold tracking-tight">
            Get better with every prompt.
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Lumi is a way to learn the question, not only to receive an answer.
          </p>
          <ol className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-2">
            {gains.map((gain, index) => (
              <li key={gain} className="flex items-center gap-3 text-sm font-medium">
                <span>{gain}</span>
                {index < gains.length - 1 ? (
                  <span aria-hidden="true" className="text-muted-foreground">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
