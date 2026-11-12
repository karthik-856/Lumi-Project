import { Link } from "react-router-dom"
import { Container } from "@/components/common/Container"
import { PageIntro } from "@/components/common/PageIntro"
import { LearningPath } from "@/components/learn/LearningPath"
import { usePageTitle } from "@/hooks/usePageTitle"

export default function LessonsPage() {
  usePageTitle("Lessons")

  return (
    <Container className="py-10 md:py-14">
      <PageIntro
        eyebrow="Lessons"
        title="Eight short ideas"
        description="Each lesson is one idea: what it is, why it matters, a before and after, and a small try-it."
      >
        <Link to="/learn" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          Back to Learn
        </Link>
      </PageIntro>
      <div className="mt-10">
        <LearningPath />
      </div>
    </Container>
  )
}
