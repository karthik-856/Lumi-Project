import type { Ref } from "react"
import { StudioStep } from "@/components/studio/StudioStep"

const titleId = "studio-idea-title"

export function IdeaStep({
  idea,
  error,
  headingRef,
  onChange,
}: {
  idea: string
  error: string | null
  headingRef?: Ref<HTMLHeadingElement>
  onChange: (idea: string) => void
}) {
  return (
    <StudioStep
      titleId={titleId}
      headingRef={headingRef}
      title="What are you trying to accomplish?"
      description="Don't worry about writing the perfect prompt. Just tell Lumi what you want in your own words."
    >
      <label htmlFor="studio-idea" className="sr-only">
        Your idea
      </label>
      <textarea
        id="studio-idea"
        value={idea}
        onChange={(event) => onChange(event.target.value)}
        placeholder="I want AI to help me prepare for my machine learning exam."
        rows={6}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "studio-idea-error" : undefined}
        className="min-h-36 w-full resize-y rounded-xl border border-border bg-surface px-3 py-3 text-base leading-relaxed outline-none placeholder:text-muted-foreground"
      />
      {error ? (
        <p id="studio-idea-error" role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </StudioStep>
  )
}
