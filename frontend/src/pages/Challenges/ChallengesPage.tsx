import { Container } from "@/components/common/Container"
import { ChallengeDashboard } from "@/components/learn/ChallengeDashboard"
import { usePageTitle } from "@/hooks/usePageTitle"

export default function ChallengesPage() {
  usePageTitle("Challenges")

  return (
    <Container className="py-10 md:py-14">
      <ChallengeDashboard />
    </Container>
  )
}
