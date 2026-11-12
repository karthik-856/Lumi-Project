import { Link, useNavigate } from "react-router-dom"
import { Container } from "@/components/common/Container"
import { Button } from "@/components/ui/button"
import { useLibrary } from "@/hooks/useLibrary"
import { latestPromptText, promptCategory, promptToStudioSeed } from "@/lib/prompt-record"
import { sendDraftToStudio } from "@/lib/studio-handoff"

export function ContinueWhereYouLeftOff() {
  const navigate = useNavigate()
  const { prompts } = useLibrary()
  const prompt = prompts.find((item) => item.saved)
  if (!prompt) return null

  const preview = latestPromptText(prompt)

  function continueEditing() {
    sendDraftToStudio(promptToStudioSeed(prompt!))
    navigate("/create/studio")
  }

  return (
    <section aria-labelledby="continue-result-heading" className="pb-10 md:pb-12">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Your latest result</p>
          <h2 id="continue-result-heading" className="type-h2 mt-2">
            Continue where you left off
          </h2>
        </div>
        <article className="mt-6 max-w-3xl rounded-3xl border border-border bg-elevated p-5 shadow-soft md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <p>{promptCategory(prompt)}</p>
            <p>Updated {prompt.updatedLabel}</p>
          </div>
          <h3 className="mt-3 text-xl font-semibold tracking-tight">{prompt.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{prompt.idea}</p>
          <p className="mt-3 text-sm font-medium">{prompt.score == null ? "Not scored yet" : `Score ${prompt.score}`}</p>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed">{preview}</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button type="button" className="h-11 rounded-xl px-4" onClick={continueEditing}>
              Continue editing
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-xl px-4">
              <Link to={`/my-work/${prompt.id}`}>View result</Link>
            </Button>
          </div>
        </article>
      </Container>
    </section>
  )
}
