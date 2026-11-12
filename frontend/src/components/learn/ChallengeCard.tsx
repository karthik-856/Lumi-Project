import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import type { Challenge } from "@/data/curriculum"
import { useLearning } from "@/hooks/useLearning"

const kindLabel = {
  choose: "Choose the better prompt",
  missing: "Find what's missing",
  improve: "Improve the prompt",
}

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const learning = useLearning()
  const saved = learning.state.challenges[challenge.id]

  return (
    <article className="rounded-2xl border border-border bg-elevated p-4 shadow-soft">
      <h3 className="font-semibold tracking-tight">{challenge.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{kindLabel[challenge.kind]}</p>
      <p className="mt-2 text-sm">{saved ? (saved.correct ? "Answered · held up" : "Answered · keep exploring") : "Not answered"}</p>
      <Button asChild className="mt-4 h-11 rounded-xl px-4">
        <Link to={`/learn/challenges/${challenge.id}`}>{saved ? "Review" : "Practice"}</Link>
      </Button>
    </article>
  )
}
