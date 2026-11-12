import { Link } from "react-router-dom"
import { Container } from "@/components/common/Container"
import { EmptyState } from "@/components/common/EmptyState"
import { PromptCard } from "@/components/prompt/PromptCard"
import { Button } from "@/components/ui/button"
import { useBackend } from "@/hooks/useBackend"
import { useLibrary } from "@/hooks/useLibrary"

export function RecentWork() {
  const { prompts, restoreSamples } = useLibrary()
  const { mode } = useBackend()
  const recent = prompts.slice(0, 3)

  return (
    <section aria-labelledby="recent-heading" className="pb-10 md:pb-12">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Recent work</p>
            <h2 id="recent-heading" className="type-h2 mt-2">
              Prompts you can open
            </h2>
            <p className="mt-3 text-muted-foreground">
              {mode === "api" ? "These prompts are saved with Lumi. Open one, copy it, or star it." : "These samples stay in this browser. Open one, copy it, or star it."}
            </p>
          </div>
          <Button asChild variant="outline" className="h-11 rounded-xl px-4">
            <Link to="/my-work">View all</Link>
          </Button>
        </div>
        {recent.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No prompts in this browser yet."
              description="Restore the sample prompts to see how Open, Duplicate, and Favorite behave."
              action={
                <Button type="button" className="h-11 rounded-xl px-4" onClick={restoreSamples}>
                  Restore samples
                </Button>
              }
            />
          </div>
        ) : (
          <ul className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {recent.map((prompt) => (
              <li key={prompt.id}>
                <PromptCard prompt={prompt} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  )
}
