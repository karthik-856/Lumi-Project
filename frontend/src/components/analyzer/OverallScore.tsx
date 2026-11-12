import { motion, useReducedMotion } from "framer-motion"

export function OverallScore({ score, label }: { score: number; label: string }) {
  const reduce = useReducedMotion()
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <section aria-labelledby="overall-score-heading" className="rounded-3xl border border-border bg-elevated p-5 shadow-soft">
      <h2 id="overall-score-heading" className="text-sm font-medium text-muted-foreground">
        Guidance
      </h2>
      <div className="mt-4 flex items-center gap-5">
        <div className="relative size-32 shrink-0" role="img" aria-label={`Overall score ${score} out of 100. ${label}.`}>
          <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--muted)" strokeWidth="8" />
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={reduce ? false : { strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <p className="absolute inset-0 grid place-items-center text-center">
            <span>
              <span className="block text-3xl font-semibold tabular-nums tracking-tight">{score}</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </span>
          </p>
        </div>
        <div>
          <p className="text-xl font-semibold tracking-tight">{label}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            What is already working, and where a little more detail would help. This is guidance, not a grade.
          </p>
        </div>
      </div>
    </section>
  )
}
