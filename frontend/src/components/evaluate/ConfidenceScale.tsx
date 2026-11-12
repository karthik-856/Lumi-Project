export function ConfidenceScale({
  name,
  value,
  onChange,
  low,
  high,
  legend,
  showScale = true,
}: {
  name: string
  value: number | null
  onChange: (value: number) => void
  low: string
  high: string
  legend: string
  showScale?: boolean
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <label key={score} className="cursor-pointer">
            <input
              className="peer sr-only"
              type="radio"
              name={name}
              value={score}
              checked={value === score}
              onChange={() => onChange(score)}
            />
            <span className="grid size-12 place-items-center rounded-xl border border-border bg-elevated text-sm font-medium tabular-nums peer-checked:border-primary peer-checked:bg-accent peer-checked:font-semibold peer-checked:ring-2 peer-checked:ring-primary peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50">
              {score}
            </span>
          </label>
        ))}
      </div>
      {showScale ? (
        <p className="mt-2 text-sm text-muted-foreground">
          1 — {low} · 5 — {high}
        </p>
      ) : (
        <p className="sr-only">
          1 means {low}. 5 means {high}.
        </p>
      )}
    </fieldset>
  )
}
