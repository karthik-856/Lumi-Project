import { analyzePrompt, type Analysis, type DimensionId } from "@/lib/prompt-analyzer"
import { breakdownFrom, improvementsBetween } from "@/lib/prompt-record"
import type { EvaluationPhase, EvaluationSession, QuestionnaireId, TaskRecord } from "@/types/evaluation"
import type { StudioDraft } from "@/types/studio"

export const evaluationStorageKey = "lumi-evaluation"
export const revisionGapMs = 1500

export const evaluationTask = {
  id: "explain-machine-learning",
  title: "Explain machine learning",
  brief: "Write a prompt asking an AI assistant to explain machine learning to a beginner using simple examples.",
}

export const questionnaireItems: { id: QuestionnaireId; statement: string }[] = [
  { id: "easy", statement: "I found it easy to create a prompt with Lumi." },
  { id: "clear", statement: "Lumi made it clear what information I should provide." },
  { id: "why", statement: "I understood why Lumi asked for each detail." },
  { id: "confident", statement: "I felt confident using Lumi." },
  { id: "again", statement: "I would use Lumi again when writing prompts." },
]

export const hciPrinciples = [
  { title: "Learnability", text: "Users can learn prompting through guided steps." },
  { title: "Recognition over recall", text: "Users choose options instead of remembering prompt-engineering terminology." },
  { title: "Affordances", text: "Interactive cards and controls communicate what users can do." },
  { title: "Visibility of system status", text: "The live prompt canvas and score show immediate feedback." },
  { title: "Feedback", text: "Analyzer results explain how the prompt can improve." },
  { title: "Progressive disclosure", text: "Advanced controls remain hidden until needed." },
  { title: "User control", text: "Users can edit, go back, change answers, and continue." },
]

const declinePhrases: Record<DimensionId, string> = {
  audience: "Audience was clearer without Lumi",
  output: "Output structure was clearer without Lumi",
  constraints: "Constraints were clearer without Lumi",
  context: "Context was clearer without Lumi",
  specificity: "The task was more specific without Lumi",
  examples: "Examples were stronger without Lumi",
  clarity: "The request was clearer without Lumi",
}

const phases = new Set<EvaluationPhase>([
  "intro",
  "unaided",
  "unaided-confidence",
  "guided",
  "guided-confidence",
  "questionnaire",
  "results",
])

export function createEvaluationSession(now = new Date().toISOString()): EvaluationSession {
  return {
    id: crypto.randomUUID(),
    phase: "intro",
    createdAt: now,
    updatedAt: now,
    unaidedDraft: "",
    unaidedStartedAt: null,
    unaidedLastEditAt: null,
    unaidedRevisions: 0,
    unaided: null,
    guidedDraft: null,
    guidedStep: 0,
    guidedReady: false,
    guidedStartedAt: null,
    guidedLastEditAt: null,
    guidedRevisions: 0,
    guided: null,
    questionnaire: {},
  }
}

export function nextRevision(state: { count: number; lastAt: number | null }, nowMs: number) {
  if (state.lastAt == null || nowMs - state.lastAt < revisionGapMs) {
    return { count: state.count, lastAt: nowMs }
  }
  return { count: state.count + 1, lastAt: nowMs }
}

export function formatDuration(ms: number) {
  const seconds = Math.max(0, Math.round(ms / 1000))
  if (seconds < 60) return seconds === 1 ? "1 second" : `${seconds} seconds`
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  const minuteLabel = minutes === 1 ? "1 minute" : `${minutes} minutes`
  if (rest === 0) return minuteLabel
  const padded = rest < 10 ? `0${rest}` : String(rest)
  return `${minuteLabel} ${padded} seconds`
}

export function qualityHeadline(delta: number) {
  if (delta > 0) return `Prompt quality improved by ${delta} points`
  if (delta < 0) return `Prompt quality was ${Math.abs(delta)} points lower with Lumi`
  return "Prompt quality stayed the same"
}

export function usabilityAverage(answers: Partial<Record<QuestionnaireId, number>>) {
  const values = questionnaireItems.map((item) => answers[item.id])
  if (values.some((value) => value == null || value < 1 || value > 5)) return null
  const total = values.reduce<number>((sum, value) => sum + (value ?? 0), 0)
  return Math.round((total / values.length) * 10) / 10
}

export function stepsFromDraft(draft: StudioDraft) {
  const steps: string[] = []
  if (draft.goal) steps.push("Goal")
  if (draft.audience) steps.push("Audience")
  if (draft.context.trim()) steps.push("Context")
  if (draft.tone) steps.push("Tone")
  if (draft.output) steps.push("Output")
  const more = draft.advancedOpen && Object.values(draft.advanced).some((value) => value.trim().length > 0)
  if (more) steps.push("More control")
  return steps
}

export function evaluationShifts(before: Analysis, after: Analysis) {
  const later = new Map(after.dimensions.map((item) => [item.id, item.score]))
  const declined = before.dimensions
    .filter((item) => item.score - (later.get(item.id) ?? 0) >= 8)
    .map((item) => declinePhrases[item.id])
  return { improved: improvementsBetween(before, after), declined }
}

export function scorePrompt(prompt: string) {
  const analysis = analyzePrompt(prompt)
  return { score: analysis.overall, breakdown: breakdownFrom(analysis), analysis }
}

function stamp(session: EvaluationSession, now: string, patch: Partial<EvaluationSession>): EvaluationSession {
  return { ...session, ...patch, updatedAt: now }
}

export function beginUnaided(session: EvaluationSession, now: string): EvaluationSession {
  if (session.phase === "unaided" && session.unaidedStartedAt) return session
  return stamp(session, now, { phase: "unaided", unaidedStartedAt: session.unaidedStartedAt ?? now })
}

export function editUnaided(session: EvaluationSession, text: string, nowMs: number): EvaluationSession {
  const revision = nextRevision({ count: session.unaidedRevisions, lastAt: session.unaidedLastEditAt }, nowMs)
  return {
    ...session,
    unaidedDraft: text,
    unaidedRevisions: revision.count,
    unaidedLastEditAt: revision.lastAt,
    unaidedStartedAt: session.unaidedStartedAt ?? new Date(nowMs).toISOString(),
    updatedAt: new Date(nowMs).toISOString(),
  }
}

export function finishUnaided(session: EvaluationSession, now: string): EvaluationSession {
  const prompt = session.unaidedDraft.trim()
  if (!prompt) return session
  const startedAt = session.unaidedStartedAt ?? now
  const scored = scorePrompt(prompt)
  const record: TaskRecord = {
    prompt,
    startedAt,
    completedAt: now,
    durationMs: Math.max(0, Date.parse(now) - Date.parse(startedAt)),
    revisions: session.unaidedRevisions,
    score: scored.score,
    breakdown: scored.breakdown,
    confidence: null,
    stepsUsed: [],
  }
  return stamp(session, now, { phase: "unaided-confidence", unaided: record, unaidedDraft: prompt })
}

export function setTaskConfidence(session: EvaluationSession, part: "unaided" | "guided", confidence: number): EvaluationSession {
  if (confidence < 1 || confidence > 5) return session
  const now = new Date().toISOString()
  if (part === "unaided") {
    if (!session.unaided) return session
    return { ...session, unaided: { ...session.unaided, confidence }, updatedAt: now }
  }
  if (!session.guided) return session
  return { ...session, guided: { ...session.guided, confidence }, updatedAt: now }
}

export function rateUnaided(session: EvaluationSession, confidence: number, now: string): EvaluationSession {
  if (!session.unaided || confidence < 1 || confidence > 5) return session
  return stamp(session, now, {
    phase: "guided",
    unaided: { ...session.unaided, confidence },
    guidedStartedAt: session.guidedStartedAt ?? now,
  })
}

export function mergeGuidedProgress(
  session: EvaluationSession,
  progress: {
    draft: StudioDraft
    step: number
    ready: boolean
    revisions: number
    lastEditAt: number | null
    startedAt: string
  },
): EvaluationSession {
  if (session.phase !== "guided") return session
  const same =
    session.guidedStep === progress.step &&
    session.guidedReady === progress.ready &&
    session.guidedRevisions === progress.revisions &&
    session.guidedLastEditAt === progress.lastEditAt &&
    session.guidedStartedAt === progress.startedAt &&
    JSON.stringify(session.guidedDraft) === JSON.stringify(progress.draft)
  if (same) return session
  return {
    ...session,
    guidedDraft: progress.draft,
    guidedStep: progress.step,
    guidedReady: progress.ready,
    guidedRevisions: progress.revisions,
    guidedLastEditAt: progress.lastEditAt,
    guidedStartedAt: progress.startedAt,
    updatedAt: new Date().toISOString(),
  }
}

export function finishGuided(session: EvaluationSession, promptText: string, steps: string[], now: string): EvaluationSession {
  const prompt = promptText.trim()
  if (!prompt) return session
  const startedAt = session.guidedStartedAt ?? now
  const scored = scorePrompt(prompt)
  const record: TaskRecord = {
    prompt,
    startedAt,
    completedAt: now,
    durationMs: Math.max(0, Date.parse(now) - Date.parse(startedAt)),
    revisions: session.guidedRevisions,
    score: scored.score,
    breakdown: scored.breakdown,
    confidence: session.guided?.confidence ?? null,
    stepsUsed: steps,
  }
  return stamp(session, now, { phase: "guided-confidence", guided: record, guidedReady: true })
}

export function rateGuided(session: EvaluationSession, confidence: number, now: string): EvaluationSession {
  if (!session.guided || confidence < 1 || confidence > 5) return session
  return stamp(session, now, { phase: "questionnaire", guided: { ...session.guided, confidence } })
}

export function answerQuestion(session: EvaluationSession, id: QuestionnaireId, value: number): EvaluationSession {
  if (value < 1 || value > 5) return session
  return { ...session, questionnaire: { ...session.questionnaire, [id]: value }, updatedAt: new Date().toISOString() }
}

export function completeQuestionnaire(session: EvaluationSession, now: string): EvaluationSession {
  if (usabilityAverage(session.questionnaire) == null) return session
  return stamp(session, now, { phase: "results" })
}

export function compareTasks(unaided: TaskRecord, guided: TaskRecord) {
  const before = analyzePrompt(unaided.prompt)
  const after = analyzePrompt(guided.prompt)
  const delta = guided.score - unaided.score
  return {
    delta,
    headline: qualityHeadline(delta),
    shifts: evaluationShifts(before, after),
    unaidedScore: unaided.score,
    guidedScore: guided.score,
    rescoredUnaided: before.overall,
    rescoredGuided: after.overall,
  }
}

export function chooseSession(local: EvaluationSession | null, remote: EvaluationSession | null) {
  if (!local) return remote
  if (!remote) return local
  const localTime = Date.parse(local.updatedAt)
  const remoteTime = Date.parse(remote.updatedAt)
  if (Number.isNaN(remoteTime)) return local
  if (Number.isNaN(localTime)) return remote
  return localTime >= remoteTime ? local : remote
}

function isTask(value: unknown): value is TaskRecord {
  if (!value || typeof value !== "object") return false
  const task = value as Partial<TaskRecord>
  return typeof task.prompt === "string" && typeof task.score === "number" && typeof task.durationMs === "number"
}

export function isEvaluationSession(value: unknown): value is EvaluationSession {
  if (!value || typeof value !== "object") return false
  const session = value as Partial<EvaluationSession>
  return (
    typeof session.id === "string" &&
    typeof session.phase === "string" &&
    phases.has(session.phase) &&
    typeof session.createdAt === "string" &&
    typeof session.updatedAt === "string" &&
    typeof session.unaidedDraft === "string" &&
    (session.unaided == null || isTask(session.unaided)) &&
    (session.guided == null || isTask(session.guided))
  )
}
