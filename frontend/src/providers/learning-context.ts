import { createContext } from "react"
import type { Achievement } from "@/lib/learning-progress"
import type { LearningState, LessonStatus } from "@/types/learning"

export type LearningContextValue = {
  state: LearningState
  statusFor: (id: string) => LessonStatus
  completedCount: number
  challengeCount: number
  level: string
  recommendationText: string
  earned: Achievement[]
  markStarted: (id: string) => void
  completeLesson: (id: string) => void
  recordChallenge: (id: string, correct: boolean, selected?: string) => void
  resetLearning: () => void
}

export const LearningContext = createContext<LearningContextValue | null>(null)
