import { Copy, Ellipsis, Pencil, Star, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLibrary } from "@/hooks/useLibrary"
import type { PromptItem } from "@/types/library"

export function PromptCard({ prompt }: { prompt: PromptItem }) {
  const { duplicatePrompt, toggleFavorite, toggleSaved, deletePrompt, restorePrompt } = useLibrary()
  const previewTo = `/create/studio?preview=${prompt.id}`

  return (
    <article className="interactive-card flex h-full flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="type-small text-muted-foreground">{prompt.intent}</p>
          <h3 className="mt-1 text-base font-semibold tracking-tight">
            <Link to={previewTo} className="rounded-sm hover:text-primary">
              {prompt.title}
            </Link>
          </h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-9 shrink-0 rounded-lg" aria-label={`More actions for ${prompt.title}`}>
              <Ellipsis aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem asChild>
              <Link to={previewTo}>Open</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`${previewTo}&mode=edit`}>
                <Pencil />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                const copy = duplicatePrompt(prompt.id)
                if (copy) toast.success(`Copied “${prompt.title}”. It is now in Recent.`)
              }}
            >
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
            <DropdownMenuItem
              onSelect={() => {
                toggleSaved(prompt.id)
                toast.success(prompt.saved ? "Removed from Saved." : "Saved.")
              }}
            >
              {prompt.saved ? "Remove from Saved" : "Save"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => {
                const removed = deletePrompt(prompt.id)
                if (!removed) return
                toast(`Removed “${removed.title}”.`, {
                  action: {
                    label: "Undo",
                    onClick: () => restorePrompt(removed),
                  },
                })
              }}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{prompt.excerpt}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{prompt.updatedLabel}</p>
        <Button asChild variant="ghost" size="sm" className="h-9 px-2">
          <Link to={previewTo}>
            Open
            <span className="nudge-icon" aria-hidden="true">
              →
            </span>
          </Link>
        </Button>
      </div>
    </article>
  )
}
