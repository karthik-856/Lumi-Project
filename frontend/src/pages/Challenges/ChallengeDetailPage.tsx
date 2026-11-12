import { Link, useParams } from "react-router-dom"
import { Container } from "@/components/common/Container"
import { ChallengeQuestion } from "@/components/learn/ChallengeQuestion"
import { challengeById } from "@/data/curriculum"
import { usePageTitle } from "@/hooks/usePageTitle"

export default function ChallengeDetailPage() {
  const { challengeId } = useParams()
  const challenge = challengeId ? challengeById(challengeId) : undefined
  usePageTitle(challenge?.title ?? "Challenge")

  return (
    <Container className="py-10 md:py-14">
      {challenge ? (
        <article className="mx-auto max-w-3xl">
          <p className="text-sm font-medium text-primary">{challenge.category}</p>
          <h1 className="type-h2 mt-2 text-balance">{challenge.title}</h1>
          <div className="mt-8">
            <ChallengeQuestion challenge={challenge} />
          </div>
          <p className="mt-8">
            <Link to="/learn/challenges" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
              Back to challenges
            </Link>
          </p>
        </article>
      ) : (
        <div className="max-w-xl">
          <h1 className="type-h2">That challenge is not here</h1>
          <p className="mt-3 text-muted-foreground">Choose one from the practice list.</p>
          <Link to="/learn/challenges" className="mt-6 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline">
            Back to challenges
          </Link>
        </div>
      )}
    </Container>
  )
}
