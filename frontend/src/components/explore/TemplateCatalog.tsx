import { useEffect, useState } from "react"
import { Check, Search } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { Container } from "@/components/common/Container"
import { EmptyState } from "@/components/common/EmptyState"
import { PageIntro } from "@/components/common/PageIntro"
import { TemplateCard } from "@/components/explore/TemplateCard"
import { TemplateIcon } from "@/components/explore/TemplateIcon"
import { Button } from "@/components/ui/button"
import { templateCategories, templates as localTemplates } from "@/data/templates"
import { usePageTitle } from "@/hooks/usePageTitle"
import { filterTemplates } from "@/lib/template-catalog"
import { cn } from "@/lib/utils"
import { getTemplates } from "@/services/templates"
import type { TemplateCategory, TemplateItem } from "@/types/library"

const categoryIcons: Record<TemplateCategory, string> = {
  Education: "GraduationCap",
  Career: "Briefcase",
  Coding: "Code",
  Writing: "PenLine",
  Research: "Search",
  Productivity: "Calendar",
  Creative: "Sparkles",
  Data: "Table",
}

function isCategory(value: string | null): value is TemplateCategory {
  return templateCategories.includes(value as TemplateCategory)
}

export function TemplateCatalog() {
  usePageTitle("Explore")
  const [params, setParams] = useSearchParams()
  const [items, setItems] = useState<TemplateItem[]>(localTemplates)
  const [search, setSearch] = useState("")
  const requested = params.get("category")
  const category = isCategory(requested) ? requested : "All"
  const visible = filterTemplates(items, category, search)

  useEffect(() => {
    let active = true
    getTemplates().then((next) => {
      if (active && next.length > 0) setItems(next)
    })
    return () => {
      active = false
    }
  }, [])

  function selectCategory(next: string) {
    if (next === "All") {
      setParams({})
      return
    }
    setParams({ category: next })
  }

  function clearFilters() {
    setSearch("")
    setParams({})
  }

  const filters: Array<TemplateCategory | "All"> = ["All", ...templateCategories]

  return (
    <Container className="py-10 md:py-14">
      <PageIntro
        eyebrow="Explore"
        title="Explore ideas for your next prompt."
        description="Start with something that matches what you're trying to do, then make it your own."
      />
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        You do not need to remember what a prompt should include. Recognize the situation, such as preparing for an exam, and Lumi will help you fill in the details.
      </p>

      <div className="mt-8 max-w-xl">
        <label htmlFor="template-search" className="text-sm font-medium">
          Search templates
        </label>
        <div className="relative mt-2">
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="template-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="What are you trying to do?"
            className="h-12 w-full rounded-xl border border-border bg-elevated pr-3 pl-10 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Categories">
        {filters.map((item) => {
          const selected = item === category
          return (
            <button
              key={item}
              type="button"
              aria-pressed={selected}
              onClick={() => selectCategory(item)}
              className={cn(
                "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                selected
                  ? "border-primary bg-accent font-semibold text-accent-foreground"
                  : "border-border bg-elevated font-medium text-muted-foreground hover:text-foreground",
              )}
            >
              {item === "All" ? null : <TemplateIcon name={categoryIcons[item]} className="size-4" />}
              {item}
              {selected ? <Check aria-hidden="true" className="size-3.5" /> : null}
              {selected ? <span className="sr-only">selected</span> : null}
            </button>
          )
        })}
      </div>

      {visible.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No templates found."
            description="Try a different search or category."
            action={
              <Button type="button" className="h-11 rounded-xl px-4" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <p className="mt-8 text-sm text-muted-foreground">
            {visible.length} starting {visible.length === 1 ? "point" : "points"}
          </p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((template) => (
              <li key={template.id} className="min-w-0">
                <TemplateCard template={template} />
              </li>
            ))}
          </ul>
        </>
      )}
    </Container>
  )
}
