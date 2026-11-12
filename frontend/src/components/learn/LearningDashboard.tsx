import { Link } from "react-router-dom"
import { AchievementCard } from "@/components/learn/AchievementCard"
import { LearningPath } from "@/components/learn/LearningPath"
import { LearningProgress } from "@/components/learn/LearningProgress"
import { PageIntro } from "@/components/common/PageIntro"
import { Button } from "@/components/ui/button"
import { useLearning } from "@/hooks/useLearning"
import { nextLesson } from "@/lib/learning-progress"

export function LearningDashboard() {
  const learning = useLearning()
  const next = nextLesson(learning.state)

  return (
    <>
      <PageIntro
        eyebrow="Learn"
        title="Learn prompting, one idea at a time."
        description="You don't need to become a prompt expert. Lumi will help you understand the few things that make your instructions clearer."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          {next ? (
            <Button asChild className="h-11 rounded-xl px-4">
              <Link to={`/learn/lessons/${next.id}`}>Continue learning</Link>
            </Button>
          ) : null}
          <Button asChild variant="outline" className="h-11 rounded-xl px-4">
            <Link to="/learn/challenges">Practice with a challenge</Link>
          </Button>
        </div>
      </PageIntro>

      <div className="mt-10">
        <LearningProgress />
      </div>

      <div className="mt-10">
        <LearningPath />
      </div>

      <section aria-labelledby="achievements-heading" className="mt-12">
        <h2 id="achievements-heading" className="text-lg font-semibold tracking-tight">
          Quiet milestones
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          These note what you have practiced on this device. They do not unlock or lock any lesson.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {learning.earned.map((achievement) => (
            <li key={achievement.id}>
              <AchievementCard achievement={achievement} />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
