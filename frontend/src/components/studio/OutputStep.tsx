import type { Ref } from "react"
import { ChoiceGrid } from "@/components/studio/ChoiceGrid"
import { StudioStep } from "@/components/studio/StudioStep"
import { outputOptions } from "@/data/studio-options"
import type { OutputId } from "@/types/studio"

const titleId = "studio-output-title"

export function OutputStep({
  output,
  outputCustom,
  headingRef,
  onChange,
  onCustomChange,
}: {
  output: OutputId | null
  outputCustom: string
  headingRef?: Ref<HTMLHeadingElement>
  onChange: (output: OutputId) => void
  onCustomChange: (value: string) => void
}) {
  return (
    <StudioStep
      titleId={titleId}
      headingRef={headingRef}
      title="How should AI present the answer?"
      description="Choose the shape that will be easiest to use."
    >
      <ChoiceGrid labelId={titleId} value={output} options={outputOptions} onChange={onChange} />
      {output === "custom" ? (
        <div className="mt-4">
          <label htmlFor="studio-output-custom" className="text-sm font-medium">
            Describe the format
          </label>
          <input
            id="studio-output-custom"
            value={outputCustom}
            onChange={(event) => onCustomChange(event.target.value)}
            placeholder="A one-page study sheet with three examples"
            className="mt-2 h-11 w-full rounded-xl border border-border bg-surface px-3 text-base outline-none placeholder:text-muted-foreground"
          />
        </div>
      ) : null}
    </StudioStep>
  )
}
