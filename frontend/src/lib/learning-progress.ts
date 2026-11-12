import { challenges, lessons } from "@/data/curriculum"
import type { LearningState, LessonStatus } from "@/types/learning"

export const learningStorageKey = "lumi-learning"

export function seedLearningState(): LearningState {
  return {
    version: 1,
    lessons: {
      "clear-goal": { status: "completed" },
      context: { status: "completed" },
      audience: { status: "in-progress" },
    },
    challenges: {},
  }
}

export function emptyLearningState(): LearningState {
  return { version: 1, lessons: {}, challenges: {} }
}

function isStatus(value: unknown): value is LessonStatus {
  return value === "not-started" || value === "in-progress" || value === "completed"
}

export function normalizeLearningState(value: unknown): LearningState {
  if (!value || typeof value !== "object") return seedLearningState()
  const record = value as Partial<LearningState>
  const lessonsState: LearningState["lessons"] = {}
  if (record.lessons && typeof record.lessons === "object") {
    for (const [id, entry] of Object.entries(record.lessons)) {
      if (entry && typeof entry === "object" && isStatus((entry as { status?: unknown }).status)) {
        lessonsState[id] = { status: (entry as { status: LessonStatus }).status }
      }
    }
  }
  const challengesState: LearningState["challenges"] = {}
  if (record.challenges && typeof record.challenges === "object") {
    for (const [id, entry] of Object.entries(record.challenges)) {
      if (entry && typeof entry === "object" && typeof (entry as { correct?: unknown }).correct === "boolean") {
        const correct = (entry as { correct: boolean }).correct
        const selected = (entry as { selected?: unknown }).selected
        challengesState[id] = { correct, ...(typeof selected === "string" ? { selected } : {}) }
      }
    }
  }
  return { version: 1, lessons: lessonsState, challenges: challengesState }
}

export function readLearningState(): LearningState {
  try {
    const raw = localStorage.getItem(learningStorageKey)
    if (!raw) return seedLearningState()
    return normalizeLearningState(JSON.parse(raw) as unknown)
  } catch {
    return seedLearningState()
  }
}

export function lessonStatus(state: LearningState, id: string): LessonStatus {
  return state.lessons[id]?.status ?? "not-started"
}

export function completedLessons(state: LearningState) {
  return lessons.filter((lesson) => lessonStatus(state, lesson.id) === "completed")
}

export function nextLesson(state: LearningState) {
  return (
    lessons.find((lesson) => lessonStatus(state, lesson.id) === "in-progress") ??
    lessons.find((lesson) => lessonStatus(state, lesson.id) === "not-started")
  )
}

export function learningLevel(completed: number) {
  if (completed >= 5) return "Prompt Explorer"
  if (completed >= 1) return "Building the basics"
  return "Getting started"
}

const topics: Record<string, string> = {
  "clear-goal": "a clear goal",
  context: "useful context",
  audience: "audience",
  specificity: "specificity",
  output: "output format",
  constraints: "useful constraints",
  examples: "examples",
  refine: "refining a draft",
}

export function recommendation(state: LearningState) {
  const done = completedLessons(state)
  const next = nextLesson(state)
  if (!next) return "You have worked through the path. Challenges are there when you want more practice."
  if (done.length === 0) return `Lumi recommends starting with “${next.title}”.`
  const names = done.map((lesson) => topics[lesson.id] ?? lesson.title)
  const learned = names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`
  return `Based on your progress, you've learned about ${learned}. Next: ${next.title}.`
}

export function answeredChallenges(state: LearningState) {
  return challenges.filter((challenge) => state.challenges[challenge.id])
}

export type Achievement = {
  id: string
  title: string
  detail: string
  earned: boolean
}

export function achievements(state: LearningState): Achievement[] {
  const done = completedLessons(state).length
  const tried = answeredChallenges(state).length
  return [
    { id: "first-lesson", title: "First lesson", detail: "You finished a lesson.", earned: done >= 1 },
    { id: "first-challenge", title: "First challenge", detail: "You practiced with a challenge.", earned: tried >= 1 },
    {
      id: "clear-communicator",
      title: "Clear communicator",
      detail: "You finished the lesson on a clear goal.",
      earned: lessonStatus(state, "clear-goal") === "completed",
    },
    {
      id: "context-builder",
      title: "Context builder",
      detail: "You finished the lesson on useful context.",
      earned: lessonStatus(state, "context") === "completed",
    },
    { id: "prompt-explorer", title: "Prompt explorer", detail: "You have worked through five concepts.", earned: done >= 5 },
  ]
}
