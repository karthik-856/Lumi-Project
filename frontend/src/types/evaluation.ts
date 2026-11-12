import type { StudioDraft } from "@/types/studio"

export type EvaluationPhase =
  | "intro"
  | "unaided"
  | "unaided-confidence"
  | "guided"
  | "guided-confidence"
  | "questionnaire"
  | "results"

export type ScoreBreakdown = {
  id: string
  label: string
  score: number
}

export type TaskRecord = {
  prompt: string
  startedAt: string
  completedAt: string
  durationMs: number
  revisions: number
  score: number
  breakdown: ScoreBreakdown[]
  confidence: number | null
  stepsUsed: string[]
}

export type QuestionnaireId = "easy" | "clear" | "why" | "confident" | "again"

export type EvaluationSession = {
  id: string
  phase: EvaluationPhase
  createdAt: string
  updatedAt: string
  unaidedDraft: string
  unaidedStartedAt: string | null
  unaidedLastEditAt: number | null
  unaidedRevisions: number
  unaided: TaskRecord | null
  guidedDraft: StudioDraft | null
  guidedStep: number
  guidedReady: boolean
  guidedStartedAt: string | null
  guidedLastEditAt: number | null
  guidedRevisions: number
  guided: TaskRecord | null
  questionnaire: Partial<Record<QuestionnaireId, number>>
}
