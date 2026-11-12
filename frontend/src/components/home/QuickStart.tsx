import { Link } from "react-router-dom"
import { Container } from "@/components/common/Container"
import { quickStarts } from "@/data/quick-start"

export function QuickStart() {
  return (
    <section aria-labelledby="quick-start-heading" className="pt-8 pb-10 md:pt-10 md:pb-12">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Quick start</p>
          <h2 id="quick-start-heading" className="type-h2 mt-2">
            Start from what you need
          </h2>
          <p className="mt-3 text-muted-foreground">Pick a familiar task. Lumi will ask the questions that fit it.</p>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickStarts.map((item) => (
            <li key={item.id}>
              <Link to={item.to} className="interactive-card flex h-full flex-col p-5">
                <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <item.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="mt-4 text-lg font-semibold tracking-tight">{item.title}</span>
                <span className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">{item.description}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Start
                  <span className="nudge-icon" aria-hidden="true">
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
