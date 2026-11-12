import { studioStepNames } from "@/data/studio-options"

export function StudioProgress({ step, total, ready }: { step: number; total: number; ready: boolean }) {
  const value = ready ? total : step + 1
  const name = studioStepNames[step] ?? "Step"
  const label = ready ? "Prompt ready" : `${name} · Step ${value} of ${total}`

  return (
    <div className="w-full max-w-56">
      <p className="text-sm font-medium">{label}</p>
      <div
        className="mt-2 h-1 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={value}
        aria-label={label}
      >
        <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${(value / total) * 100}%` }} />
      </div>
    </div>
  )
}
