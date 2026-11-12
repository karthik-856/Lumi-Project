import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Container } from "@/components/common/Container"
import { EmptyState } from "@/components/common/EmptyState"
import { PageIntro } from "@/components/common/PageIntro"
import { SegmentedControl } from "@/components/common/SegmentedControl"
import { WorkPromptCard } from "@/components/work/WorkPromptCard"
import { Button } from "@/components/ui/button"
import { useBackend } from "@/hooks/useBackend"
import { useLibrary } from "@/hooks/useLibrary"
import { usePageTitle } from "@/hooks/usePageTitle"
import { downloadFile } from "@/lib/export"
import { promptMatchesSearch } from "@/lib/prompt-record"
import { cn } from "@/lib/utils"
import { segmentIds } from "@/utils/segments"
import type { PromptIntent, PromptItem } from "@/types/library"

const workPanelId = "work-panel"

const filters = [
  { id: "recent", label: "Recent" },
  { id: "saved", label: "Saved" },
  { id: "favorites", label: "Favorites" },
] as const

const intents: Array<"All" | PromptIntent> = ["All", "Write", "Study", "Code", "Create", "Work"]

type FilterId = (typeof filters)[number]["id"]
type SortId = "updated" | "score" | "title"

function visiblePrompts(prompts: PromptItem[], filter: FilterId) {
  if (filter === "saved") return prompts.filter((item) => item.saved)
  if (filter === "favorites") return prompts.filter((item) => item.favorite)
  return prompts
}

function sortPrompts(prompts: PromptItem[], sort: SortId) {
  const copy = [...prompts]
  if (sort === "score") {
    return copy.sort((a, b) => (b.score ?? -1) - (a.score ?? -1))
  }
  if (sort === "title") {
    return copy.sort((a, b) => a.title.localeCompare(b.title))
  }
  return copy
}

export default function MyWorkPage() {
  usePageTitle("My Work")
  const { prompts, restoreSamples } = useLibrary()
  const { mode } = useBackend()
  const [filter, setFilter] = useState<FilterId>("recent")
  const [intent, setIntent] = useState<"All" | PromptIntent>("All")
  const [sort, setSort] = useState<SortId>("updated")
  const [search, setSearch] = useState("")
  const inTab = visiblePrompts(prompts, filter)
  const items = useMemo(() => {
    const filtered = inTab.filter(
      (item) => (intent === "All" || item.intent === intent) && promptMatchesSearch(item, search),
    )
    return sortPrompts(filtered, sort)
  }, [inTab, intent, search, sort])
  const panel = segmentIds("work", filter)
  const searching = search.trim().length > 0 || intent !== "All"

  function exportAll() {
    downloadFile("lumi-prompts.json", JSON.stringify(items, null, 2), "application/json;charset=utf-8")
    toast.success(`Exported ${items.length} ${items.length === 1 ? "prompt" : "prompts"}.`)
  }

  let empty: { title: string; description: string; action: "create" | "explore" | "clear" } | null = null
  if (searching && items.length === 0) {
    empty = { title: "No prompts match your filters.", description: "Try a different word or reset filters.", action: "clear" }
  } else if (items.length === 0 && filter === "favorites") {
    empty = {
      title: "No favorites yet",
      description: "Save prompts you want to reuse quickly.",
      action: "explore",
    }
  } else if (items.length === 0) {
    empty = {
      title: "No saved prompts yet",
      description: "Create your first guided prompt and it will appear here.",
      action: "create",
    }
  }

  return (
    <Container className="py-10 md:py-14">
      <PageIntro
        eyebrow="My Work"
        title="The prompts you are keeping"
        description={
          mode === "api"
            ? "Recent, saved, and favorite prompts stay with Lumi. Open one to review it, then continue in Studio or analyze it again."
            : "Recent, saved, and favorite prompts stay in this browser. Open one to review it, then continue in Studio or analyze it again."
        }
      />
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1 max-w-xl">
          <label htmlFor="work-search" className="text-sm font-medium">
            Search saved prompts
          </label>
          <input
            id="work-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search your prompts"
            className="mt-2 h-12 w-full rounded-xl border border-border bg-elevated px-4 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div>
          <label htmlFor="work-sort" className="block text-sm font-medium">
            Sort by
          </label>
          <select
            id="work-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortId)}
            className="mt-2 h-12 rounded-xl border border-border bg-elevated px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="updated">Recently updated</option>
            <option value="score">Highest score</option>
            <option value="title">Title (A–Z)</option>
          </select>
        </div>
        <Button type="button" variant="outline" className="h-12 rounded-xl px-4" onClick={exportAll} disabled={items.length === 0}>
          Export JSON
        </Button>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <SegmentedControl
          name="work"
          label="Prompt library"
          value={filter}
          options={filters}
          onChange={setFilter}
          panelId={workPanelId}
        />
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
          {intents.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={intent === item}
              onClick={() => setIntent(item)}
              className={cn(
                "min-h-9 cursor-pointer rounded-xl border px-3 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                intent === item ? "border-primary bg-accent text-accent-foreground" : "border-border bg-elevated text-muted-foreground hover:text-foreground",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div role="tabpanel" id={workPanelId} aria-labelledby={panel.tabId} className="mt-6">
        {empty ? (
          <EmptyState
            title={empty.title}
            description={empty.description}
            action={
              empty.action === "clear" ? (
                <Button
                  type="button"
                  className="h-11 rounded-xl px-4"
                  onClick={() => {
                    setSearch("")
                    setIntent("All")
                  }}
                >
                  Reset filters
                </Button>
              ) : empty.action === "explore" ? (
                <Button asChild className="h-11 rounded-xl px-4">
                  <Link to="/explore">Explore templates</Link>
                </Button>
              ) : (
                <div className="flex flex-wrap justify-center gap-2">
                  <Button asChild className="h-11 rounded-xl px-4">
                    <Link to="/create/studio">Create a prompt</Link>
                  </Button>
                  <Button type="button" variant="outline" className="h-11 rounded-xl px-4" onClick={restoreSamples}>
                    Restore samples
                  </Button>
                </div>
              )
            }
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((prompt) => (
              <li key={prompt.id} className="min-w-0">
                <WorkPromptCard prompt={prompt} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  )
}
