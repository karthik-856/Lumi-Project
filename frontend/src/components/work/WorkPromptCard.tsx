import { useState } from "react"
import { Copy, Ellipsis, Pencil, Star, Trash2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { ConfirmDelete } from "@/components/work/ConfirmDelete"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLibrary } from "@/hooks/useLibrary"
import { analysisSummary, promptCategory, promptToStudioSeed } from "@/lib/prompt-record"
import { sendDraftToStudio } from "@/lib/studio-handoff"
import type { PromptItem } from "@/types/library"

export function WorkPromptCard({ prompt }: { prompt: PromptItem }) {
  const navigate = useNavigate()
  const { duplicatePrompt, toggleFavorite, deletePrompt, restorePrompt } = useLibrary()
  const [confirming, setConfirming] = useState(false)
  const detail = `/my-work/${prompt.id}`

  function openStudio() {
    sendDraftToStudio(promptToStudioSeed(prompt))
    navigate("/create/studio")
  }

  function duplicate() {
    const copy = duplicatePrompt(prompt.id)
    if (!copy) return
    toast.success(`“${copy.title}” is ready to edit.`)
    navigate(`/my-work/${copy.id}`)
  }

  function remove() {
    const removed = deletePrompt(prompt.id)
    setConfirming(false)
    if (!removed) return
    toast(`Removed “${removed.title}”.`, {
      action: {
        label: "Undo",
        onClick: () => restorePrompt(removed),
      },
    })
  }

  return (
    <article className="interactive-card flex h-full flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="type-small text-muted-foreground">{promptCategory(prompt)}</p>
        <button
          type="button"
          aria-pressed={prompt.favorite}
          aria-label={prompt.favorite ? `Remove ${prompt.title} from favorites` : `Add ${prompt.title} to favorites`}
          onClick={() => {
            toggleFavorite(prompt.id)
            toast.success(prompt.favorite ? "Removed from Favorites." : "Saved to Favorites.")
          }}
          className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border px-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Star aria-hidden="true" className={prompt.favorite ? "size-4 fill-current" : "size-4"} />
          {prompt.favorite ? "Favorited" : "Favorite"}
        </button>
      </div>
      <h2 className="mt-3 text-base font-semibold tracking-tight">
        <Link to={detail} className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          {prompt.title}
        </Link>
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {prompt.score == null ? "Not scored" : `Score ${prompt.score}`}
        <span className="sr-only">. {analysisSummary(prompt.score)}</span>
        <span aria-hidden="true"> · </span>
        <span>Updated {prompt.updatedLabel}</span>
      </p>
      <div className="mt-4 flex items-center gap-2">
        <Button asChild className="h-10 rounded-xl px-4">
          <Link to={detail}>Open</Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="size-10 shrink-0 rounded-xl" aria-label={`More actions for ${prompt.title}`}>
              <Ellipsis aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onSelect={openStudio}>
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={duplicate}>
              <Copy />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                toggleFavorite(prompt.id)
                toast.success(prompt.favorite ? "Removed from Favorites." : "Saved to Favorites.")
              }}
            >
              <Star />
              {prompt.favorite ? "Remove favorite" : "Favorite"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => setConfirming(true)}>
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {confirming ? <ConfirmDelete onCancel={() => setConfirming(false)} onConfirm={remove} /> : null}
    </article>
  )
}
