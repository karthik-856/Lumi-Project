import { Link, useSearchParams } from "react-router-dom"
import { Container } from "@/components/common/Container"
import { PromptSection } from "@/components/prompt/PromptSection"
import { Button } from "@/components/ui/button"
import { useLibrary } from "@/hooks/useLibrary"
import { usePageTitle } from "@/hooks/usePageTitle"
import { findPreview } from "@/utils/previews"

export default function StudioPreview() {
  const [params] = useSearchParams()
  const previewId = params.get("preview") ?? ""
  const { prompts } = useLibrary()
  const preview = findPreview(previewId, prompts)
  usePageTitle(preview ? preview.title : "Studio")

  if (!preview) {
    return (
      <Container className="py-8 md:py-12">
        <div role="status" className="rounded-2xl border border-dashed border-border bg-surface px-6 py-10">
          <h1 className="text-lg font-semibold">That prompt is not in this browser anymore.</h1>
          <p className="mt-2 text-sm text-muted-foreground">It may have been deleted. Your other work is still in My Work.</p>
          <Button asChild className="mt-5 h-11 rounded-xl px-4">
            <Link to="/my-work">Back to My Work</Link>
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-8 md:py-12">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Lumi Studio</p>
        <h1 className="type-h2 mt-2 text-balance">{preview.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {preview.source === "template"
            ? "This template is open as a preview. Start in Studio when you want to answer the questions yourself."
            : "This is a saved prompt. Start in Studio to build a new one, one question at a time."}
        </p>
      </div>
      <div className="mt-8 grid items-start gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section aria-labelledby="preview-idea-heading" className="rounded-3xl border border-border bg-elevated p-5 shadow-soft">
          <h2 id="preview-idea-heading" className="text-lg font-semibold tracking-tight">
            What are you trying to accomplish?
          </h2>
          <p className="mt-3 rounded-xl border border-border bg-surface px-3 py-3 text-sm leading-relaxed">{preview.idea}</p>
          <dl className="mt-4 space-y-3">
            {preview.answers.map((answer) => (
              <div key={answer.label}>
                <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{answer.label}</dt>
                <dd className="mt-0.5 text-sm">{answer.value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section aria-labelledby="preview-canvas-heading" className="rounded-3xl border border-border bg-background p-5 shadow-soft">
          <h2 id="preview-canvas-heading" className="text-base font-semibold tracking-tight">
            Your prompt is taking shape
          </h2>
          <div className="mt-4 space-y-2">
            {preview.sections.map((section) => (
              <PromptSection key={section.label} label={section.label}>
                {section.body}
              </PromptSection>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild className="h-11 rounded-xl px-4">
              <Link to="/create/studio">Start in Studio</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-xl px-4">
              <Link to="/my-work">My Work</Link>
            </Button>
          </div>
        </section>
      </div>
    </Container>
  )
}
