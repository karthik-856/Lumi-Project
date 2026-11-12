import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/common/Container"
import { PromptWorkbench } from "@/components/home/PromptWorkbench"

export function Hero() {
  return (
    <section className="hero-wash">
      <Container className="grid items-start gap-8 py-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-12 lg:py-12">
        <div className="lg:pt-4">
          <p className="text-sm font-medium text-primary">Structured Prompt Workbench</p>
          <h1 className="type-display mt-3 max-w-xl text-balance">
            Turn ideas into <span className="text-primary">clear AI prompts.</span>
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Define your idea, goal, audience, context, tone, and output format — then score, refine, and save locally.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild className="h-11 rounded-xl px-4 text-[15px]">
              <Link to="/create/studio">Open Guided Studio</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-xl px-4 text-[15px]">
              <Link to="/analyze">Analyze a prompt</Link>
            </Button>
          </div>
          <p className="mt-4">
            <Link to="/evaluate" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
              Run 2-minute comparison study
            </Link>
          </p>
        </div>
        <PromptWorkbench />
      </Container>
    </section>
  )
}
