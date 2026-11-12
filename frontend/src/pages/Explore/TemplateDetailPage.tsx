import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Container } from "@/components/common/Container"
import { TemplateIcon } from "@/components/explore/TemplateIcon"
import { Button } from "@/components/ui/button"
import { templates as localTemplates } from "@/data/templates"
import { usePageTitle } from "@/hooks/usePageTitle"
import { sendDraftToStudio } from "@/lib/studio-handoff"
import { getTemplate } from "@/services/templates"
import type { TemplateItem } from "@/types/library"

const definedFields = ["Goal", "Audience", "Context", "Output"] as const

export default function TemplateDetailPage() {
  const { templateId } = useParams()
  const navigate = useNavigate()
  const local = localTemplates.find((item) => item.id === templateId)
  const [template, setTemplate] = useState<TemplateItem | undefined>(local)
  const [missing, setMissing] = useState(!local)
  usePageTitle(template?.title ?? "Template")

  useEffect(() => {
    if (!templateId) return
    let active = true
    getTemplate(templateId).then((next) => {
      if (!active) return
      if (next) {
        setTemplate(next)
        setMissing(false)
        return
      }
      if (!local) setMissing(true)
    })
    return () => {
      active = false
    }
  }, [templateId, local])

  function openTemplate(item: TemplateItem) {
    sendDraftToStudio({
      idea: item.startingIdea,
      goal: item.suggestedGoal,
      audience: item.suggestedAudience,
      context: item.suggestedContext,
      tone: item.suggestedTone,
      output: item.suggestedOutput,
      note: `${item.title} filled in a starting idea. Change any answer.`,
      promptId: crypto.randomUUID(),
      templateId: item.id,
      templateCategory: item.category,
      title: item.title,
    })
    navigate("/create/studio")
  }

  if (missing || !template) {
    return (
      <Container className="py-10 md:py-14">
        <div className="max-w-xl">
          <h1 className="type-h2">That starting point is not available</h1>
          <p className="mt-3 text-muted-foreground">Choose another situation from Explore.</p>
          <Link to="/explore" className="mt-6 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline">
            Back to Explore
          </Link>
        </div>
      </Container>
    )
  }

  const defined = new Map(template.answers.map((answer) => [answer.label, answer.value]))

  return (
    <Container className="py-10 md:py-14">
      <article className="max-w-2xl">
        <Link to="/explore" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          Back to Explore
        </Link>
        <div className="mt-6 flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground">
            <TemplateIcon name={template.icon} className="size-6" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary">{template.category}</p>
            <h1 className="type-h2 mt-1 text-balance">{template.title}</h1>
          </div>
        </div>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{template.description}</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-elevated p-4">
            <dt className="text-sm text-muted-foreground">Best for</dt>
            <dd className="mt-1 text-sm leading-relaxed">{template.bestFor}</dd>
          </div>
          <div className="rounded-2xl border border-border bg-elevated p-4">
            <dt className="text-sm text-muted-foreground">Difficulty</dt>
            <dd className="mt-1 text-sm font-medium">{template.difficulty}</dd>
          </div>
        </dl>

        <section className="mt-8">
          <h2 className="text-lg font-semibold tracking-tight">Starting idea</h2>
          <blockquote className="mt-3 rounded-2xl border border-border bg-surface px-4 py-4 text-base leading-relaxed">
            “{template.startingIdea}”
          </blockquote>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold tracking-tight">What Lumi will help you define</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            These are starting answers. You can change every one of them in Studio.
          </p>
          <dl className="mt-4 grid gap-3">
            {definedFields.map((label) => (
              <div key={label} className="rounded-2xl border border-border bg-elevated px-4 py-3">
                <dt className="text-sm font-medium">{label}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{defined.get(label)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-accent px-4 py-4">
          <h2 className="text-base font-semibold">Why this template works</h2>
          <p className="mt-2 text-sm leading-relaxed">{template.whyItWorks}</p>
        </section>

        <Button type="button" className="mt-8 h-11 rounded-xl px-4" onClick={() => openTemplate(template)}>
          Use this template
        </Button>
      </article>
    </Container>
  )
}
