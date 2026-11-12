import { chooseSession, evaluationStorageKey, isEvaluationSession, questionnaireItems } from "@/lib/evaluation"
import { ApiError, request } from "@/services/api"
import type { EvaluationSession, QuestionnaireId, TaskRecord } from "@/types/evaluation"
import type { StudioDraft } from "@/types/studio"

type ApiTask = {
  prompt: string
  started_at: string
  completed_at: string
  duration_ms: number
  revisions: number
  score: number
  breakdown: { id: string; label: string; score: number }[]
  confidence: number | null
  steps_used: string[]
}

type ApiEvaluation = {
  id: string
  phase: EvaluationSession["phase"]
  created_at: string
  updated_at: string
  unaided_draft: string
  unaided_started_at: string | null
  unaided_last_edit_ms: number | null
  unaided_revisions: number
  unaided: ApiTask | null
  guided_draft: StudioDraft | null
  guided_step: number
  guided_ready: boolean
  guided_started_at: string | null
  guided_last_edit_ms: number | null
  guided_revisions: number
  guided: ApiTask | null
  questionnaire: Partial<Record<QuestionnaireId, number>>
}

function taskToApi(task: TaskRecord): ApiTask {
  return {
    prompt: task.prompt,
    started_at: task.startedAt,
    completed_at: task.completedAt,
    duration_ms: task.durationMs,
    revisions: task.revisions,
    score: task.score,
    breakdown: task.breakdown,
    confidence: task.confidence,
    steps_used: task.stepsUsed,
  }
}

function taskFromApi(task: ApiTask): TaskRecord {
  return {
    prompt: task.prompt,
    startedAt: task.started_at,
    completedAt: task.completed_at,
    durationMs: task.duration_ms,
    revisions: task.revisions,
    score: task.score,
    breakdown: task.breakdown ?? [],
    confidence: task.confidence,
    stepsUsed: task.steps_used ?? [],
  }
}

export function toEvaluationBody(session: EvaluationSession): ApiEvaluation {
  return {
    id: session.id,
    phase: session.phase,
    created_at: session.createdAt,
    updated_at: session.updatedAt,
    unaided_draft: session.unaidedDraft,
    unaided_started_at: session.unaidedStartedAt,
    unaided_last_edit_ms: session.unaidedLastEditAt,
    unaided_revisions: session.unaidedRevisions,
    unaided: session.unaided ? taskToApi(session.unaided) : null,
    guided_draft: session.guidedDraft,
    guided_step: session.guidedStep,
    guided_ready: session.guidedReady,
    guided_started_at: session.guidedStartedAt,
    guided_last_edit_ms: session.guidedLastEditAt,
    guided_revisions: session.guidedRevisions,
    guided: session.guided ? taskToApi(session.guided) : null,
    questionnaire: session.questionnaire,
  }
}

export function fromEvaluationBody(row: ApiEvaluation): EvaluationSession {
  return {
    id: row.id,
    phase: row.phase,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    unaidedDraft: row.unaided_draft ?? "",
    unaidedStartedAt: row.unaided_started_at,
    unaidedLastEditAt: row.unaided_last_edit_ms,
    unaidedRevisions: row.unaided?.revisions ?? row.unaided_revisions ?? 0,
    unaided: row.unaided ? taskFromApi(row.unaided) : null,
    guidedDraft: row.guided_draft,
    guidedStep: row.guided_step ?? 0,
    guidedReady: Boolean(row.guided_ready),
    guidedStartedAt: row.guided_started_at,
    guidedLastEditAt: row.guided_last_edit_ms,
    guidedRevisions: row.guided?.revisions ?? row.guided_revisions ?? 0,
    guided: row.guided ? taskFromApi(row.guided) : null,
    questionnaire: ratings(row.questionnaire),
  }
}

function ratings(value: Partial<Record<QuestionnaireId, number | null>> | null): EvaluationSession["questionnaire"] {
  const next: EvaluationSession["questionnaire"] = {}
  if (!value) return next
  for (const item of questionnaireItems) {
    const score = value[item.id]
    if (typeof score === "number") next[item.id] = score
  }
  return next
}

export function readLocalEvaluation(): EvaluationSession | null {
  try {
    const raw = localStorage.getItem(evaluationStorageKey)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    return isEvaluationSession(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function writeLocalEvaluation(session: EvaluationSession) {
  localStorage.setItem(evaluationStorageKey, JSON.stringify(session))
}

export async function fetchEvaluation(): Promise<EvaluationSession | null> {
  try {
    const row = await request<ApiEvaluation>("/api/evaluation")
    return fromEvaluationBody(row)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

export async function saveEvaluation(session: EvaluationSession) {
  const row = await request<ApiEvaluation>("/api/evaluation", {
    method: "PUT",
    body: JSON.stringify(toEvaluationBody(session)),
  })
  return fromEvaluationBody(row)
}

export async function deleteEvaluation() {
  await request<void>("/api/evaluation", { method: "DELETE" })
}

export function reconcileEvaluation(local: EvaluationSession, remote: EvaluationSession | null) {
  return chooseSession(local, remote) ?? local
}
