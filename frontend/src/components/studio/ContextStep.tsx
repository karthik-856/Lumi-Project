import type { Ref } from "react"
import { StudioStep } from "@/components/studio/StudioStep"

const titleId = "studio-context-title"
const hints = ["Your experience level", "Your situation", "Important background information", "What you have already tried"]

export function ContextStep({
  context,
  headingRef,
  onChange,
}: {
  context: string
  headingRef?: Ref<HTMLHeadingElement>
  onChange: (context: string) => void
}) {
  return (
    <StudioStep
      titleId={titleId}
      headingRef={headingRef}
      title="What should AI know before answering?"
      description="Add the details that would help Lumi understand your situation."
    >
      <label htmlFor="studio-context" className="sr-only">
        Context
      </label>
      <textarea
        id="studio-context"
        value={context}
        onChange={(event) => onChange(event.target.value)}
        placeholder="I'm a third-year computer science student and my exam is next week. I understand basic concepts but struggle with mathematical explanations."
        rows={6}
        className="min-h-36 w-full resize-y rounded-xl border border-border bg-surface px-3 py-3 text-base leading-relaxed outline-none placeholder:text-muted-foreground"
      />
      <div className="mt-4">
        <p className="text-sm font-medium">Useful context</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
          {hints.map((hint) => (
            <li key={hint}>{hint}</li>
          ))}
        </ul>
      </div>
    </StudioStep>
  )
}
