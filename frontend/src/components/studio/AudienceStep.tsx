import type { Ref } from "react"
import { ChoiceGrid } from "@/components/studio/ChoiceGrid"
import { StudioStep } from "@/components/studio/StudioStep"
import { WhyNote } from "@/components/learning/WhyNote"
import { audienceOptions } from "@/data/studio-options"
import type { AudienceId } from "@/types/studio"

const titleId = "studio-audience-title"

export function AudienceStep({
  audience,
  audienceOther,
  headingRef,
  onChange,
  onOtherChange,
}: {
  audience: AudienceId | null
  audienceOther: string
  headingRef?: Ref<HTMLHeadingElement>
  onChange: (audience: AudienceId) => void
  onOtherChange: (value: string) => void
}) {
  return (
    <StudioStep
      titleId={titleId}
      headingRef={headingRef}
      title="Who is this for?"
      description="The answer can change depending on who will read or use it."
    >
      <ChoiceGrid labelId={titleId} value={audience} options={audienceOptions} onChange={onChange} />
      {audience === "someone-else" ? (
        <div className="mt-4">
          <label htmlFor="studio-audience-other" className="text-sm font-medium">
            Who else?
          </label>
          <input
            id="studio-audience-other"
            value={audienceOther}
            onChange={(event) => onOtherChange(event.target.value)}
            placeholder="A hiring manager who has never met me"
            className="mt-2 h-11 w-full rounded-xl border border-border bg-surface px-3 text-base outline-none placeholder:text-muted-foreground"
          />
        </div>
      ) : null}
      <div className="mt-4">
        <WhyNote
          question="Why does this matter?"
          answer="Knowing the audience helps AI choose the right vocabulary, depth, and examples."
        />
      </div>
    </StudioStep>
  )
}
