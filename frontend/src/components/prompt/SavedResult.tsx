import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useLibrary } from "@/hooks/useLibrary"
import { promptToStudioSeed } from "@/lib/prompt-record"
import { sendDraftToStudio } from "@/lib/studio-handoff"

export function SavedResult({ promptId }: { promptId: string }) {
  const navigate = useNavigate()
  const { prompts } = useLibrary()
  const prompt = prompts.find((item) => item.id === promptId)

  function continueEditing() {
    if (prompt) sendDraftToStudio(promptToStudioSeed(prompt))
    navigate("/create/studio")
  }

  return (
    <div role="status" className="rounded-2xl border border-border bg-accent px-4 py-4">
      <h2 className="text-base font-semibold tracking-tight">Saved to My Work</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        The original idea, the latest prompt, and the score stay together.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button asChild className="h-11 rounded-xl px-4">
          <Link to={`/my-work/${promptId}`}>View in My Work</Link>
        </Button>
        <Button type="button" variant="outline" className="h-11 rounded-xl px-4" onClick={continueEditing}>
          Continue editing
        </Button>
        <Button asChild variant="ghost" className="h-11 rounded-xl px-4">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
