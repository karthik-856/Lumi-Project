import type { Ref } from "react"
import { ChoiceGrid } from "@/components/studio/ChoiceGrid"
import { StudioStep } from "@/components/studio/StudioStep"
import { goalOptions } from "@/data/studio-options"
import type { GoalId } from "@/types/studio"

const titleId = "studio-goal-title"

export function GoalStep({
  goal,
  headingRef,
  onChange,
}: {
  goal: GoalId | null
  headingRef?: Ref<HTMLHeadingElement>
  onChange: (goal: GoalId) => void
}) {
  return (
    <StudioStep
      titleId={titleId}
      headingRef={headingRef}
      title="What would you like AI to do?"
      description="Choose the kind of help you need."
    >
      <ChoiceGrid labelId={titleId} value={goal} options={goalOptions} onChange={onChange} />
    </StudioStep>
  )
}
