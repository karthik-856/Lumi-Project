import type { AdvancedOptions as AdvancedState } from "@/types/studio"

const fields: Array<{ key: keyof AdvancedState; label: string; placeholder: string }> = [
  { key: "constraints", label: "Constraints", placeholder: "Stay within the course syllabus" },
  { key: "length", label: "Length", placeholder: "About 200 words" },
  { key: "language", label: "Language", placeholder: "English" },
  { key: "examples", label: "Examples", placeholder: "Include two everyday examples" },
  { key: "requiredSections", label: "Required sections", placeholder: "Definition, example, practice question" },
]

export function AdvancedOptions({
  open,
  values,
  onToggle,
  onChange,
}: {
  open: boolean
  values: AdvancedState
  onToggle: () => void
  onChange: (patch: Partial<AdvancedState>) => void
}) {
  return (
    <div className="mt-6 border-t border-border pt-4">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="studio-advanced"
        onClick={onToggle}
        className="text-sm font-medium text-primary"
      >
        {open ? "− Hide extra control" : "+ More control"}
      </button>
      {open ? (
        <div id="studio-advanced" className="mt-3 space-y-3">
          <p className="text-sm leading-relaxed text-muted-foreground">
            These options are useful when you want more control over the result.
          </p>
          {fields.map((field) => {
            const id = `studio-advanced-${field.key}`
            return (
              <div key={field.key}>
                <label htmlFor={id} className="text-sm font-medium">
                  {field.label}
                </label>
                <input
                  id={id}
                  value={values[field.key]}
                  onChange={(event) => onChange({ [field.key]: event.target.value })}
                  placeholder={field.placeholder}
                  className="mt-1.5 h-11 w-full rounded-xl border border-border bg-surface px-3 text-base outline-none placeholder:text-muted-foreground"
                />
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
