import { Link } from "react-router-dom"
import { Container } from "@/components/common/Container"
import { Button } from "@/components/ui/button"

export function FinalCta() {
  return (
    <section aria-labelledby="ready-heading" className="pb-12 md:pb-16">
      <Container>
        <div className="rounded-3xl border border-border bg-elevated px-6 py-8 shadow-soft md:px-10 md:py-9">
          <p className="text-sm font-medium text-primary">When you are ready</p>
          <h2 id="ready-heading" className="type-h2 mt-2 max-w-xl text-balance">
            Bring the idea. Leave with a prompt you understand.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Lumi asks a few simple questions, then shows what changed and why you can use it again.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-11 rounded-xl px-4 text-[15px]">
              <Link to="/create/studio">Start creating</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-xl px-4 text-[15px]">
              <Link to="/learn">See the learning path</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
