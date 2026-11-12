import { ScoreDimension } from "@/components/analyzer/ScoreDimension"
import type { DimensionScore } from "@/lib/prompt-analyzer"

export function ScoreBreakdown({ dimensions }: { dimensions: DimensionScore[] }) {
  return (
    <section aria-labelledby="breakdown-heading">
      <h2 id="breakdown-heading" className="text-lg font-semibold tracking-tight">
        What Lumi noticed
      </h2>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {dimensions.map((dimension) => (
          <li key={dimension.id}>
            <ScoreDimension dimension={dimension} />
          </li>
        ))}
      </ul>
    </section>
  )
}
