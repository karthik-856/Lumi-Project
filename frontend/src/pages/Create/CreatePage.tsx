import { Link, useSearchParams } from "react-router-dom"
import { Container } from "@/components/common/Container"
import { PageIntro } from "@/components/common/PageIntro"
import { Button } from "@/components/ui/button"
import { intentToGoal } from "@/data/studio-options"
import { intentCopy, quickStarts } from "@/data/quick-start"
import { usePageTitle } from "@/hooks/usePageTitle"
import { cn } from "@/lib/utils"

export default function CreatePage() {
  usePageTitle("Create")
  const [params] = useSearchParams()
  const intent = params.get("intent") ?? ""
  const note = intentCopy[intent]
  const studioGoal = intentToGoal[intent]
  const studioTo = studioGoal ? `/create/studio?goal=${studioGoal}` : "/create/studio"

  return (
    <Container className="py-10 md:py-14">
      <PageIntro
        eyebrow="Create"
        title="Choose a task or start in Studio"
        description="Pick a task below to prefill your goal, or open Guided Studio directly."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild className="h-11 rounded-xl px-4">
            <Link to={studioTo}>Start in Studio</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-xl px-4">
            <Link to="/create/studio?preview=exam-prep">See a finished example</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-xl px-4">
            <Link to="/analyze">I already have a prompt</Link>
          </Button>
        </div>
      </PageIntro>

      <section aria-labelledby="intent-heading" className="mt-10">
        <h2 id="intent-heading" className="text-lg font-semibold tracking-tight">
          What are you trying to do?
        </h2>
        {note ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{note}</p> : null}
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickStarts
            .filter((item) => item.id !== "analyze")
            .map((item) => {
              const active = item.id === intent
              return (
                <li key={item.id}>
                  <Link
                    to={item.to}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "interactive-card flex h-full items-start gap-3 p-4",
                      active && "border-primary bg-accent",
                    )}
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-background text-primary">
                      <item.icon className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-semibold">{item.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{item.description}</span>
                      {active ? <span className="mt-2 block text-sm font-medium text-primary">Selected</span> : null}
                    </span>
                  </Link>
                </li>
              )
            })}
        </ul>
      </section>
    </Container>
  )
}
