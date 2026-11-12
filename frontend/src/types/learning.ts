export type LessonStatus = "not-started" | "in-progress" | "completed"

export type LessonRecord = {
  status: LessonStatus
}

export type ChallengeRecord = {
  correct: boolean
  selected?: string
}

export type LearningState = {
  version: 1
  lessons: Record<string, LessonRecord>
  challenges: Record<string, ChallengeRecord>
}
