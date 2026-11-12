/// <reference types="node" />
import assert from "node:assert/strict"
import { analyzePrompt } from "./prompt-analyzer.ts"
import {
  answerQuestion,
  beginUnaided,
  chooseSession,
  compareTasks,
  completeQuestionnaire,
  createEvaluationSession,
  editUnaided,
  evaluationTask,
  finishGuided,
  finishUnaided,
  formatDuration,
  isEvaluationSession,
  nextRevision,
  qualityHeadline,
  rateGuided,
  rateUnaided,
  scorePrompt,
  setTaskConfidence,
  usabilityAverage,
} from "./evaluation.ts"

const start = "2026-11-12T09:00:00.000Z"
let session = beginUnaided(createEvaluationSession(start), start)
assert.equal(session.phase, "unaided")
assert.equal(session.unaidedStartedAt, start)

session = editUnaided(session, "Explain machine learning.", 1_000)
session = editUnaided(session, "Explain machine learning to me.", 2_000)
assert.equal(session.unaidedRevisions, 0)
session = editUnaided(session, "Explain machine learning to me please.", 4_000)
assert.equal(session.unaidedRevisions, 1)

session = finishUnaided(session, "2026-11-12T09:00:42.000Z")
assert.equal(session.phase, "unaided-confidence")
assert.ok(session.unaided)
assert.equal(session.unaided.score, analyzePrompt(session.unaided.prompt).overall)
assert.equal(session.unaided.score, scorePrompt(session.unaided.prompt).score)
assert.equal(session.unaided.durationMs, 42_000)
assert.equal(session.unaided.confidence, null)

const empty = finishUnaided({ ...session, phase: "unaided", unaidedDraft: "  ", unaided: null }, start)
assert.equal(empty.unaided, null)

session = setTaskConfidence(session, "unaided", 2)
assert.equal(session.unaided?.confidence, 2)
assert.equal(session.phase, "unaided-confidence")
session = rateUnaided(session, 2, "2026-11-12T09:01:00.000Z")
assert.equal(session.phase, "guided")
assert.equal(session.guidedStartedAt, "2026-11-12T09:01:00.000Z")

const guidedPrompt = "Explain machine learning to a beginner using three simple examples and a step-by-step structure."
session = {
  ...session,
  guidedRevisions: 2,
}
session = finishGuided(session, guidedPrompt, ["Goal", "Audience", "Output"], "2026-11-12T09:02:08.000Z")
assert.equal(session.phase, "guided-confidence")
assert.ok(session.guided)
assert.equal(session.guided.score, analyzePrompt(guidedPrompt).overall)
assert.equal(session.guided.revisions, 2)
assert.deepEqual(session.guided.stepsUsed, ["Goal", "Audience", "Output"])
session = rateGuided(session, 4, "2026-11-12T09:02:20.000Z")
assert.equal(session.phase, "questionnaire")
assert.equal(session.guided?.confidence, 4)

for (const [id, value] of [
  ["easy", 4],
  ["clear", 5],
  ["why", 4],
  ["confident", 4],
  ["again", 5],
] as const) {
  session = answerQuestion(session, id, value)
}
assert.equal(session.questionnaire.easy, 4)
assert.equal(usabilityAverage(session.questionnaire), 4.4)
session = completeQuestionnaire(session, "2026-11-12T09:03:00.000Z")
assert.equal(session.phase, "results")

const compared = compareTasks(session.unaided!, session.guided!)
assert.equal(compared.delta, session.guided!.score - session.unaided!.score)
assert.equal(compared.rescoredUnaided, session.unaided!.score)
assert.equal(compared.rescoredGuided, session.guided!.score)
assert.equal(compared.headline, qualityHeadline(compared.delta))
assert.equal(evaluationTask.brief.includes("machine learning"), true)
assert.equal(evaluationTask.brief.includes("beginner"), true)

const restored = JSON.parse(JSON.stringify(session)) as unknown
assert.equal(isEvaluationSession(restored), true)
if (isEvaluationSession(restored)) {
  assert.equal(restored.unaided?.confidence, 2)
  assert.equal(restored.guided?.confidence, 4)
  assert.equal(restored.questionnaire.again, 5)
}

const older = { ...session, updatedAt: "2026-11-12T08:00:00.000Z" }
const newer = createEvaluationSession("2026-11-12T12:00:00.000Z")
assert.equal(chooseSession(newer, older)?.id, newer.id)
assert.equal(chooseSession(older, null)?.id, older.id)

const reset = createEvaluationSession("2026-11-12T12:00:00.000Z")
assert.equal(reset.phase, "intro")
assert.equal(reset.unaided, null)
assert.equal(reset.guided, null)
assert.notEqual(reset.id, session.id)

assert.equal(formatDuration(42_000), "42 seconds")
assert.equal(formatDuration(68_000), "1 minute 08 seconds")
let burst = nextRevision({ count: 0, lastAt: null }, 0)
assert.equal(burst.count, 0)
burst = nextRevision(burst, revisionGap())
assert.equal(burst.count, 1)

function revisionGap() {
  return 1500
}

console.log("evaluation checks passed", {
  unaided: session.unaided?.score,
  guided: session.guided?.score,
  delta: compared.delta,
})
