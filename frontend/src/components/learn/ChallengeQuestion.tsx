import { useState } from "react"
import { ChallengeFeedback } from "@/components/learn/ChallengeFeedback"
import { Button } from "@/components/ui/button"
import type { Challenge } from "@/data/curriculum"
import { useLearning } from "@/hooks/useLearning"
import { cn } from "@/lib/utils"

export function ChallengeQuestion({ challenge }: { challenge: Challenge }) {
  const learning = useLearning()
  const saved = learning.state.challenges[challenge.id]
  const [choice, setChoice] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const revealed = challenge.kind === "missing" ? submitted : choice !== null
  const correct =
    challenge.kind === "missing"
      ? sameSet(selected, challenge.correctIds)
      : choice === challenge.correctId

  function choose(id: string) {
    if (challenge.kind === "missing") {
      setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
      setSubmitted(false)
      return
    }
    setChoice(id)
    learning.recordChallenge(challenge.id, id === challenge.correctId, id)
  }

  function checkMissing() {
    if (challenge.kind !== "missing" || selected.length === 0) return
    setSubmitted(true)
    learning.recordChallenge(challenge.id, sameSet(selected, challenge.correctIds), selected.slice().sort().join(","))
  }

  return (
    <div>
      <p className="rounded-2xl border border-border bg-surface p-4 text-base leading-relaxed">{challenge.prompt}</p>
      <h2 className="mt-6 text-lg font-semibold tracking-tight">{challenge.question}</h2>
      <div className="mt-4 grid gap-3" role="group" aria-label={challenge.question}>
        {challenge.options.map((option) => {
          const pressed = challenge.kind === "missing" ? selected.includes(option.id) : choice === option.id
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={pressed}
              onClick={() => choose(option.id)}
              className={cn(
                "min-h-11 rounded-2xl border p-4 text-left text-base leading-relaxed",
                pressed ? "border-primary bg-accent" : "border-border bg-surface hover:border-primary/40",
              )}
            >
              {option.text}
              {pressed ? <span className="mt-2 block text-sm font-medium">Selected</span> : null}
            </button>
          )
        })}
      </div>
      {challenge.kind === "missing" ? (
        <Button type="button" className="mt-4 h-11 rounded-xl px-4" disabled={selected.length === 0} onClick={checkMissing}>
          Check answer
        </Button>
      ) : null}
      {revealed ? (
        <div className="mt-4">
          <ChallengeFeedback correct={correct} explanation={challenge.explanation} />
        </div>
      ) : saved ? (
        <p className="mt-4 text-sm text-muted-foreground">
          You answered this earlier. {saved.correct ? "That answer held up." : "You can try a different option."}
        </p>
      ) : null}
    </div>
  )
}

function sameSet(selected: string[], expected: string[]) {
  if (selected.length !== expected.length) return false
  return expected.every((id) => selected.includes(id))
}
