import { useRef } from "react"
import { cn } from "@/lib/utils"
import { segmentIds } from "@/utils/segments"

export function SegmentedControl<T extends string>({
  name,
  label,
  value,
  options,
  onChange,
  panelId,
}: {
  name: string
  label: string
  value: T
  options: readonly { id: T; label: string }[]
  onChange: (next: T) => void
  panelId: string
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])

  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-1 rounded-xl bg-muted p-1">
      {options.map((option, index) => {
        const selected = option.id === value
        const ids = segmentIds(name, option.id)
        return (
          <button
            key={option.id}
            ref={(node) => {
              refs.current[index] = node
            }}
            id={ids.tabId}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            className={cn(
              "min-h-10 rounded-lg px-3 text-sm font-medium transition-colors",
              selected
                ? "bg-elevated text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => onChange(option.id)}
            onKeyDown={(event) => {
              const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0
              if (!direction) return
              event.preventDefault()
              const next = (index + direction + options.length) % options.length
              onChange(options[next].id)
              refs.current[next]?.focus()
            }}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
