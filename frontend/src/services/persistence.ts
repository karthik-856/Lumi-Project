import { api, ApiError, toLearningState, toPromptItem } from "@/services/api"
import type { PromptItem } from "@/types/library"
import { emptyLearningState } from "@/lib/learning-progress"
import type { LearningState, LessonStatus } from "@/types/learning"

export const resetPendingKey = "lumi-learning-reset-pending"

const rank: Record<LessonStatus, number> = {
  "not-started": 0,
  "in-progress": 1,
  completed: 2,
}

export async function loadPrompts(local: PromptItem[]): Promise<{ prompts: PromptItem[]; online: boolean }> {
  try {
    let remote = (await api.getPrompts()).map(toPromptItem)
    const known = new Set(remote.map((item) => item.id))
    const extras = local.filter((item) => !known.has(item.id))
    for (const extra of extras) {
      await savePromptRemote(extra)
    }
    if (extras.length > 0) remote = (await api.getPrompts()).map(toPromptItem)
    return { prompts: remote, online: true }
  } catch {
    return { prompts: local, online: false }
  }
}

export async function savePromptRemote(item: PromptItem) {
  try {
    return await api.updatePrompt(item.id, item)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return api.createPrompt(item)
    }
    throw error
  }
}

export async function loadLearning(local: LearningState): Promise<{ state: LearningState; online: boolean }> {
  try {
    if (localStorage.getItem(resetPendingKey) === "1") {
      await api.resetLearning()
      localStorage.removeItem(resetPendingKey)
      return { state: emptyLearningState(), online: true }
    }
    const remote = await readRemoteLearning()
    const merged = mergeLearning(remote, local)
    await pushLearningDelta(remote, merged)
    return { state: merged, online: true }
  } catch {
    return { state: local, online: false }
  }
}

async function readRemoteLearning() {
  const [lessons, challenges] = await Promise.all([api.getLearningProgress(), api.getChallengeResults()])
  return toLearningState(lessons, challenges)
}

function mergeLearning(remote: LearningState, local: LearningState): LearningState {
  const lessons = { ...local.lessons }
  for (const [id, entry] of Object.entries(remote.lessons)) {
    const current = lessons[id]?.status ?? "not-started"
    if (rank[entry.status] >= rank[current]) lessons[id] = entry
  }
  return {
    version: 1,
    lessons,
    challenges: { ...local.challenges, ...remote.challenges },
  }
}

async function pushLearningDelta(remote: LearningState, merged: LearningState) {
  for (const [id, entry] of Object.entries(merged.lessons)) {
    if (remote.lessons[id]?.status !== entry.status) {
      await api.updateLessonProgress(id, entry.status)
    }
  }
  for (const [id, entry] of Object.entries(merged.challenges)) {
    if (!remote.challenges[id]) {
      await api.submitChallengeResult(id, entry.selected || (entry.correct ? "correct" : "incorrect"), entry.correct)
    }
  }
}
