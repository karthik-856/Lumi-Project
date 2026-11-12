import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import {
  achievements,
  answeredChallenges,
  completedLessons,
  emptyLearningState,
  learningLevel,
  learningStorageKey,
  lessonStatus,
  readLearningState,
  recommendation,
} from "@/lib/learning-progress"
import { useBackend } from "@/hooks/useBackend"
import { LearningContext } from "@/providers/learning-context"
import { api } from "@/services/api"
import { loadLearning, resetPendingKey } from "@/services/persistence"
import type { LearningState } from "@/types/learning"

export function LearningProvider({ children }: { children: ReactNode }) {
  const backend = useBackend()
  const modeRef = useRef(backend.mode)
  const generation = useRef(0)
  const [state, setState] = useState<LearningState>(readLearningState)

  useEffect(() => {
    modeRef.current = backend.mode
  }, [backend.mode])

  useEffect(() => {
    localStorage.setItem(learningStorageKey, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    if (backend.mode !== "api") return
    const seen = generation.current
    let active = true
    loadLearning(readLearningState()).then((result) => {
      if (!active || generation.current !== seen) return
      if (!result.online) {
        backend.markLocal()
        return
      }
      setState(result.state)
    })
    return () => {
      active = false
    }
  }, [backend.mode, backend])

  const value = useMemo(() => {
    function syncLesson(id: string, status: LearningState["lessons"][string]["status"]) {
      generation.current += 1
      if (modeRef.current === "local") return
      void api.updateLessonProgress(id, status).catch(() => backend.markLocal())
    }

    const completed = completedLessons(state)
    return {
      state,
      statusFor: (id: string) => lessonStatus(state, id),
      completedCount: completed.length,
      challengeCount: answeredChallenges(state).length,
      level: learningLevel(completed.length),
      recommendationText: recommendation(state),
      earned: achievements(state),
      markStarted: (id: string) => {
        setState((current) => {
          const status = lessonStatus(current, id)
          if (status === "in-progress" || status === "completed") return current
          return { ...current, lessons: { ...current.lessons, [id]: { status: "in-progress" } } }
        })
        if (lessonStatus(state, id) === "not-started") syncLesson(id, "in-progress")
      },
      completeLesson: (id: string) => {
        setState((current) => ({
          ...current,
          lessons: { ...current.lessons, [id]: { status: "completed" } },
        }))
        syncLesson(id, "completed")
      },
      recordChallenge: (id: string, correct: boolean, selected?: string) => {
        generation.current += 1
        const answer = selected || (correct ? "correct" : "incorrect")
        setState((current) => ({
          ...current,
          challenges: { ...current.challenges, [id]: { correct, selected: answer } },
        }))
        if (modeRef.current === "local") return
        void api.submitChallengeResult(id, answer, correct).catch(() => backend.markLocal())
      },
      resetLearning: () => {
        generation.current += 1
        setState(emptyLearningState())
        if (modeRef.current === "local") {
          localStorage.setItem(resetPendingKey, "1")
          return
        }
        void api.resetLearning().catch(() => {
          localStorage.setItem(resetPendingKey, "1")
          backend.markLocal()
        })
      },
    }
  }, [state, backend])

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>
}
