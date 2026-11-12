import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { TemplateIcon } from "@/components/explore/TemplateIcon"
import { Button } from "@/components/ui/button"
import type { TemplateItem } from "@/types/library"

export function TemplateCard({ template }: { template: TemplateItem }) {
  const detail = `/explore/templates/${template.id}`

  return (
    <article className="interactive-card flex h-full cursor-default flex-col p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
          <TemplateIcon name={template.icon} className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight">
            <Link to={detail} className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
              {template.title}
            </Link>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{template.category}</p>
        </div>
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{template.description}</p>
      <p className="mt-4 text-sm">
        <span className="text-muted-foreground">Difficulty</span>
        <span className="mx-1.5 text-muted-foreground" aria-hidden="true">
          ·
        </span>
        {template.difficulty}
      </p>
      <Button asChild className="mt-4 h-10 w-fit rounded-xl px-4">
        <Link to={detail}>
          Use template
          <ArrowRight className="nudge-icon" aria-hidden="true" />
        </Link>
      </Button>
    </article>
  )
}
