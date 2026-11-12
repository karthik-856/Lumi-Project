import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { Container } from "@/components/common/Container"
import { ConfirmDelete } from "@/components/work/ConfirmDelete"
import { Button } from "@/components/ui/button"
import { useLibrary } from "@/hooks/useLibrary"
import { usePageTitle } from "@/hooks/usePageTitle"
import { downloadFile, promptToMarkdown, slugifyTitle } from "@/lib/export"
import { scoreBand } from "@/lib/prompt-analyzer"
import { formatPromptDate, latestPromptText, promptCategory, promptToAnalyzerSeed, promptToStudioSeed } from "@/lib/prompt-record"
import { sendDraftToStudio, sendPromptToAnalyzer } from "@/lib/studio-handoff"

export default function PromptDetailPage() {
  const { promptId } = useParams()
  const navigate = useNavigate()
  const { prompts, duplicatePrompt, toggleFavorite, deletePrompt, restorePrompt } = useLibrary()
  const prompt = prompts.find((item) => item.id === promptId)
  const [confirming, setConfirming] = useState(false)
  usePageTitle(prompt?.title ?? "Prompt")

  if (!prompt) {
    return (
      <Container className="py-10 md:py-14">
        <div className="max-w-xl">
          <h1 className="type-h2">That prompt is not in My Work</h1>
          <p className="mt-3 text-muted-foreground">It may have been deleted from this browser.</p>
          <Link to="/my-work" className="mt-6 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline">
            Back to My Work
          </Link>
        </div>
      </Container>
    )
  }

  const latest = latestPromptText(prompt)
  const updated = formatPromptDate(prompt.updatedAt) || prompt.updatedLabel
  const category = promptCategory(prompt)

  function editInStudio() {
    sendDraftToStudio(promptToStudioSeed(prompt!))
    navigate("/create/studio")
  }

  function analyzeAgain() {
    sendPromptToAnalyzer(promptToAnalyzerSeed(prompt!))
    navigate("/analyze")
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(latest)
      toast.success("Copied the latest prompt.")
    } catch {
      toast.error("Couldn't copy from this browser.")
    }
  }

  function duplicate() {
    const copy = duplicatePrompt(prompt!.id)
    if (!copy) return
    toast.success(`“${copy.title}” is ready to edit.`)
    navigate(`/my-work/${copy.id}`)
  }

  function remove() {
    const removed = deletePrompt(prompt!.id)
    setConfirming(false)
    if (!removed) return
    toast(`Removed “${removed.title}”.`, {
      action: {
        label: "Undo",
        onClick: () => {
          restorePrompt(removed)
          navigate(`/my-work/${removed.id}`)
        },
      },
    })
    navigate("/my-work")
  }

  return (
    <Container className="py-10 md:py-14">
      <article className="mx-auto max-w-2xl">
        <Link to="/my-work" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          Back to My Work
        </Link>
        <header className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-primary">{category}</p>
            <button
              type="button"
              aria-pressed={prompt.favorite}
              aria-label={prompt.favorite ? `Remove ${prompt.title} from favorites` : `Add ${prompt.title} to favorites`}
              onClick={() => {
                toggleFavorite(prompt.id)
                toast.success(prompt.favorite ? "Removed from Favorites." : "Saved to Favorites.")
              }}
              className="inline-flex min-h-9 cursor-pointer items-center rounded-lg border border-border px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {prompt.favorite ? "Favorited" : "Favorite"}
            </button>
          </div>
          <h1 className="type-h2 mt-3 text-balance">{prompt.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Updated {updated}</p>
        </header>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button type="button" className="h-11 rounded-xl px-4" onClick={editInStudio}>
            Edit in Studio
          </Button>
          <Button type="button" variant="outline" className="h-11 rounded-xl px-4" onClick={analyzeAgain}>
            Analyze again
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl px-4"
            onClick={() => {
              downloadFile(`${slugifyTitle(prompt.title)}.md`, promptToMarkdown(prompt), "text/markdown;charset=utf-8")
              toast.success("Prompt exported as Markdown.")
            }}
          >
            Download (.md)
          </Button>
          <Button type="button" variant="ghost" className="h-11 rounded-xl px-4" onClick={duplicate}>
            Duplicate
          </Button>
          <Button type="button" variant="destructive" className="h-11 rounded-xl px-4" onClick={() => setConfirming(true)}>
            Delete
          </Button>
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-semibold tracking-tight">Original idea</h2>
          <p className="mt-3 text-base leading-relaxed">{prompt.idea || "This prompt does not have an original idea saved."}</p>
        </section>

        <section className="mt-8" aria-labelledby="lumi-result-title">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="lumi-result-title" className="text-lg font-semibold tracking-tight">
                Latest prompt
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">The prompt you are keeping.</p>
            </div>
            <Button type="button" variant="ghost" className="h-9 rounded-lg px-3" onClick={() => void copyPrompt()}>
              Copy
            </Button>
          </div>
          <pre className="mt-3 overflow-x-auto rounded-3xl border border-border bg-elevated p-5 text-sm leading-relaxed whitespace-pre-wrap shadow-soft">
            {latest || "Edit in Studio to shape a prompt from this idea."}
          </pre>
        </section>

        <section className="mt-8" aria-labelledby="quality-title">
          <h2 id="quality-title" className="text-lg font-semibold tracking-tight">
            What Lumi noticed
          </h2>
          {prompt.score == null ? (
            <p className="mt-3 text-sm leading-relaxed">Not scored yet. Analyze again when you want guidance.</p>
          ) : (
            <>
              <p className="mt-3 text-lg font-semibold tracking-tight">{scoreBand(prompt.score)}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {prompt.score} out of 100. Guidance from the information in the prompt, not a grade.
              </p>
            </>
          )}
          {prompt.breakdown && prompt.breakdown.length > 0 ? (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {prompt.breakdown.map((item) => (
                <li key={item.id} className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm">
                  <span>{item.label}</span>
                  <span className="font-medium tabular-nums">{item.score}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        {prompt.improvements && prompt.improvements.length > 0 ? (
          <section className="mt-8" aria-labelledby="improved-title">
            <h2 id="improved-title" className="text-lg font-semibold tracking-tight">
              What Lumi improved
            </h2>
            <ul className="mt-3 space-y-2">
              {prompt.improvements.map((item) => (
                <li key={item} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
      {confirming ? <ConfirmDelete onCancel={() => setConfirming(false)} onConfirm={remove} /> : null}
    </Container>
  )
}
