import { Container } from "@/components/common/Container"
import { LearningDashboard } from "@/components/learn/LearningDashboard"
import { usePageTitle } from "@/hooks/usePageTitle"

export default function LearnPage() {
  usePageTitle("Learn")

  return (
    <Container className="py-10 md:py-14">
      <LearningDashboard />
    </Container>
  )
}
