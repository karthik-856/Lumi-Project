import type { Ref } from "react"
import { ChoiceGrid } from "@/components/studio/ChoiceGrid"
import { StudioStep } from "@/components/studio/StudioStep"
import { toneOptions } from "@/data/studio-options"
import type { ToneId } from "@/types/studio"

const titleId = "studio-tone-title"

export function ToneStep({
  tone,
  headingRef,
  onChange,
}: {
  tone: ToneId | null
  headingRef?: Ref<HTMLHeadingElement>
  onChange: (tone: ToneId) => void
}) {
  return (
    <StudioStep
      titleId={titleId}
      headingRef={headingRef}
      title="How should the answer feel?"
      description="Choose the voice you want to read."
    >
      <ChoiceGrid labelId={titleId} value={tone} options={toneOptions} onChange={onChange} />
    </StudioStep>
  )
}
