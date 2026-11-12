import { motion, useReducedMotion } from "framer-motion"

export function ScoreBars({
  scores,
  overall,
}: {
  scores: readonly { label: string; value: number }[]
  overall: number
}) {
  const reduce = useReducedMotion()

  return (
    <div>
      <p className="type-small text-muted-foreground">Example score</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight">
        {overall}
        <span className="text-lg font-medium text-muted-foreground">/100</span>
      </p>
      <ul className="mt-6 max-w-xl space-y-3">
        {scores.map((score) => (
          <li key={score.label}>
            <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
              <span>{score.label}</span>
              <span className="tabular-nums text-muted-foreground">{score.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={reduce ? false : { width: 0 }}
                animate={{ width: `${score.value}%` }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
