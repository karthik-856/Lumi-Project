import { Link, useParams } from "react-router-dom"
import { Container } from "@/components/common/Container"
import { LessonPage } from "@/components/learn/LessonPage"
import { lessonById } from "@/data/curriculum"
import { usePageTitle } from "@/hooks/usePageTitle"

export default function LessonDetailPage() {
  const { lessonId } = useParams()
  const lesson = lessonId ? lessonById(lessonId) : undefined
  usePageTitle(lesson?.title ?? "Lesson")

  return (
    <Container className="py-10 md:py-14">
      {lesson ? (
        <LessonPage lesson={lesson} />
      ) : (
        <div className="max-w-xl">
          <h1 className="type-h2">That lesson is not on the path</h1>
          <p className="mt-3 text-muted-foreground">Lumi's learning path has eight lessons. This address is not one of them.</p>
          <Link to="/learn" className="mt-6 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline">
            Back to Learn
          </Link>
        </div>
      )}
    </Container>
  )
}
