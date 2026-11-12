import { useRef } from "react"
import { Check } from "lucide-react"
import type { StudioChoice } from "@/data/studio-options"
import { cn } from "@/lib/utils"

export function ChoiceGrid<T extends string>({
  labelId,
  value,
  options,
  onChange,
}: {
  labelId: string
  value: T | null
  options: StudioChoice<T>[]
  onChange: (id: T) => void
}) {
  const groupRef = useRef<HTMLDivElement>(null)

  function move(current: T | null, direction: 1 | -1) {
    const index = options.findIndex((option) => option.id === current)
    const start = index < 0 ? (direction === 1 ? -1 : 0) : index
    const next = options[(start + direction + options.length) % options.length]
    onChange(next.id)
    groupRef.current?.querySelector<HTMLButtonElement>(`[data-choice="${next.id}"]`)?.focus()
  }

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-labelledby={labelId}
      className="grid gap-3 sm:grid-cols-2"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault()
          move(value, 1)
        }
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault()
          move(value, -1)
        }
      }}
    >
      {options.map((option) => {
        const selected = value === option.id
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            data-choice={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex h-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
              selected ? "border-primary bg-accent" : "border-border bg-surface hover:border-primary/45",
            )}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-background text-primary">
              <option.icon className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="flex flex-wrap items-center gap-2 font-semibold tracking-tight">
                {option.title}
                {selected ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                    <Check className="size-3.5" aria-hidden="true" />
                    Selected
                  </span>
                ) : null}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{option.description}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
