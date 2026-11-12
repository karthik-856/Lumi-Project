import { ChallengeCard } from "@/components/learn/ChallengeCard"
import { PageIntro } from "@/components/common/PageIntro"
import { challenges } from "@/data/curriculum"
import { useLearning } from "@/hooks/useLearning"

const categories = ["Clarity", "Context", "Audience", "Specificity", "Output", "Constraints", "Examples", "Mixed"]

export function ChallengeDashboard() {
  const learning = useLearning()

  return (
    <>
      <PageIntro
        eyebrow="Challenges"
        title="Practice what you've learned."
        description="Short comparisons. Each one explains the reason, so the answer is something you can reuse."
      />
      <p className="mt-6 text-sm text-muted-foreground">
        {learning.challengeCount} of {challenges.length} challenges answered on this device.
      </p>
      <div className="mt-8 space-y-10">
        {categories.map((category) => {
          const items = challenges.filter((challenge) => challenge.category === category)
          if (items.length === 0) return null
          return (
            <section key={category} aria-labelledby={`category-${category}`}>
              <h2 id={`category-${category}`} className="text-lg font-semibold tracking-tight">
                {category}
              </h2>
              <ul className="mt-4 grid gap-3">
                {items.map((challenge) => (
                  <li key={challenge.id}>
                    <ChallengeCard challenge={challenge} />
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </>
  )
}
