import { LessonCard } from "@/components/learn/LessonCard"
import { lessons } from "@/data/curriculum"

export function LearningPath() {
  return (
    <section aria-labelledby="learning-path-heading">
      <h2 id="learning-path-heading" className="text-lg font-semibold tracking-tight">
        Lumi's learning path
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Eight short ideas. Open any lesson. Nothing is locked.
      </p>
      <ol className="mt-5 space-y-3">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <LessonCard lesson={lesson} />
          </li>
        ))}
      </ol>
    </section>
  )
}
