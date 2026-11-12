import type { PromptIntent, PromptItem, PromptSection, GuidanceAnswer } from "@/types/library"
import type { LearningState, LessonStatus } from "@/types/learning"

const SAVE_FAILED = "Couldn't save this prompt right now. Your local copy is still available."

export { SAVE_FAILED }

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

function baseUrl() {
  const configured = import.meta.env.VITE_API_URL
  return (configured && configured.length > 0 ? configured : "http://127.0.0.1:8000").replace(/\/$/, "")
}

export async function request<T>(path: string, init?: RequestInit, timeout = 8000): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${baseUrl()}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
      signal: AbortSignal.timeout(timeout),
    })
  } catch {
    throw new ApiError(0, "Lumi is currently running in local mode.")
  }

  if (response.status === 204) return undefined as T

  if (!response.ok) {
    let detail = fallbackMessage(response.status)
    try {
      const body = (await response.json()) as { detail?: unknown }
      if (typeof body.detail === "string" && body.detail.length < 180 && !body.detail.includes("Traceback")) {
        detail = body.detail
      }
    } catch {
      /* The status already has a friendly message. */
    }
    throw new ApiError(response.status, detail)
  }

  return (await response.json()) as T
}

function fallbackMessage(status: number) {
  if (status === 400) return "Some of that information needs another look."
  if (status === 404) return "That item is not available right now."
  if (status === 409) return "That prompt is already saved."
  if (status === 503) return "Lumi could not read that prompt just now."
  return "Something went wrong on Lumi's side. Your work on this device is still here."
}

export type ApiPrompt = {
  id: string
  title: string
  original_text: string
  improved_text: string | null
  category: PromptIntent
  score: number | null
  created_at: string
  updated_at: string
  is_favorite: boolean
  excerpt: string
  idea: string
  saved: boolean
  sections: PromptSection[]
  answers: GuidanceAnswer[]
  template_id?: string | null
  template_category?: string | null
  analysis_summary?: string | null
  analysis_breakdown?: { id: string; label: string; score: number }[] | null
  improvements?: string[] | null
}

export type ApiLessonProgress = {
  lesson_id: string
  status: "not_started" | "in_progress" | "completed"
  completed_at: string | null
}

export type ApiChallengeResult = {
  challenge_id: string
  selected_answer: string
  is_correct: boolean
  completed_at: string
}

export type ApiAchievement = {
  achievement_key: string
  title: string
  detail: string
  unlocked_at: string | null
}

export type ApiUser = {
  id: string
  name: string
  level: string
  created_at: string
}

export function formatUpdatedLabel(iso: string) {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return "Earlier"
  const elapsed = Date.now() - then
  if (elapsed < 60_000) return "Just now"
  const days = Math.floor(elapsed / 86_400_000)
  if (days <= 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 14) return "Last week"
  return "Earlier"
}

export type ApiTemplate = {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  icon: string
  starting_idea: string
  suggested_goal: string
  suggested_audience: string
  suggested_context: string
  suggested_tone: string
  suggested_output: string
  why_it_works: string
  best_for: string
  position: number
  created_at: string
}

export function toPromptItem(row: ApiPrompt): PromptItem {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    intent: row.category,
    updatedLabel: formatUpdatedLabel(row.updated_at),
    saved: row.saved,
    favorite: row.is_favorite,
    idea: row.idea,
    answers: row.answers ?? [],
    sections: row.sections ?? [],
    score: row.score ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    improvedText: row.improved_text ?? undefined,
    templateId: row.template_id ?? undefined,
    templateCategory: row.template_category ?? undefined,
    analysisSummary: row.analysis_summary ?? undefined,
    breakdown: row.analysis_breakdown ?? undefined,
    improvements: row.improvements ?? undefined,
  }
}

export function toPromptBody(item: PromptItem) {
  const sections = item.sections.length > 0 ? item.sections : [{ label: "Prompt", body: item.idea }]
  const improved = item.improvedText?.trim() || sections.map((section) => section.body).join("\n\n")
  return {
    id: item.id,
    title: item.title,
    original_text: item.idea,
    improved_text: improved,
    category: item.intent,
    score: item.score ?? null,
    is_favorite: item.favorite,
    excerpt: item.excerpt.slice(0, 400) || item.idea.slice(0, 160),
    idea: item.idea,
    saved: item.saved,
    sections,
    answers: item.answers,
    template_id: item.templateId ?? null,
    template_category: item.templateCategory ?? null,
    analysis_summary: item.analysisSummary ?? null,
    analysis_breakdown: item.breakdown ?? null,
    improvements: item.improvements ?? null,
  }
}

export function toUiStatus(status: ApiLessonProgress["status"]): LessonStatus {
  if (status === "in_progress") return "in-progress"
  if (status === "completed") return "completed"
  return "not-started"
}

export function toApiStatus(status: LessonStatus): ApiLessonProgress["status"] {
  if (status === "in-progress") return "in_progress"
  if (status === "completed") return "completed"
  return "not_started"
}

export function toLearningState(lessons: ApiLessonProgress[], challenges: ApiChallengeResult[]): LearningState {
  return {
    version: 1,
    lessons: Object.fromEntries(lessons.map((row) => [row.lesson_id, { status: toUiStatus(row.status) }])),
    challenges: Object.fromEntries(
      challenges.map((row) => [row.challenge_id, { correct: row.is_correct, selected: row.selected_answer }]),
    ),
  }
}

export const api = {
  getUser: () => request<ApiUser>("/api/user", undefined, 2000),
  getPrompts: () => request<ApiPrompt[]>("/api/prompts"),
  getPrompt: (id: string) => request<ApiPrompt>(`/api/prompts/${id}`),
  createPrompt: (item: PromptItem) =>
    request<ApiPrompt>("/api/prompts", { method: "POST", body: JSON.stringify(toPromptBody(item)) }),
  updatePrompt: (id: string, item: PromptItem) =>
    request<ApiPrompt>(`/api/prompts/${id}`, { method: "PUT", body: JSON.stringify(toPromptBody(item)) }),
  patchPrompt: (id: string, body: Record<string, unknown>) =>
    request<ApiPrompt>(`/api/prompts/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deletePrompt: (id: string) => request<void>(`/api/prompts/${id}`, { method: "DELETE" }),
  favoritePrompt: (id: string, isFavorite: boolean) =>
    request<ApiPrompt>(`/api/prompts/${id}/favorite`, {
      method: "PATCH",
      body: JSON.stringify({ is_favorite: isFavorite }),
    }),
  analyzePrompt: (text: string, promptId?: string) =>
    request<unknown>("/api/analyze", { method: "POST", body: JSON.stringify({ text, prompt_id: promptId ?? null }) }, 40000),
  improvePrompt: (text: string) =>
    request<{ improved_text: string }>("/api/improve", { method: "POST", body: JSON.stringify({ text }) }, 40000),
  getLearningProgress: () => request<ApiLessonProgress[]>("/api/learning/progress"),
  updateLessonProgress: (lessonId: string, status: LessonStatus) =>
    request<ApiLessonProgress>(`/api/learning/lessons/${lessonId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: toApiStatus(status) }),
    }),
  getChallengeResults: () => request<ApiChallengeResult[]>("/api/learning/challenges"),
  submitChallengeResult: (challengeId: string, selected: string, correct: boolean) =>
    request<ApiChallengeResult>(`/api/learning/challenges/${challengeId}/result`, {
      method: "POST",
      body: JSON.stringify({ selected_answer: selected, is_correct: correct }),
    }),
  getAchievements: () => request<ApiAchievement[]>("/api/learning/achievements"),
  resetLearning: () => request<ApiLessonProgress[]>("/api/learning/reset", { method: "POST" }),
  getTemplates: () => request<ApiTemplate[]>("/api/templates"),
  getTemplate: (id: string) => request<ApiTemplate>(`/api/templates/${encodeURIComponent(id)}`),
  searchTemplates: (category?: string, search?: string) => {
    const params = new URLSearchParams()
    if (category && category !== "All") params.set("category", category)
    if (search?.trim()) params.set("search", search.trim())
    const query = params.toString()
    return request<ApiTemplate[]>(`/api/templates${query ? `?${query}` : ""}`)
  },
}
