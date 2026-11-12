/// <reference types="node" />
import assert from "node:assert/strict"
import { challenges, lessons } from "../data/curriculum.ts"
import {
  achievements,
  completedLessons,
  emptyLearningState,
  learningLevel,
  nextLesson,
  normalizeLearningState,
  recommendation,
  seedLearningState,
} from "./learning-progress.ts"

const seed = seedLearningState()
assert.equal(completedLessons(seed).length, 2)
assert.equal(nextLesson(seed)?.id, "audience")
assert.equal(learningLevel(2), "Building the basics")
assert.equal(learningLevel(5), "Prompt Explorer")
assert.match(recommendation(seed), /a clear goal and useful context/)
assert.match(recommendation(seed), /Tell AI who it's helping/)

const earned = achievements(seed)
assert.equal(earned.find((item) => item.id === "first-lesson")?.earned, true)
assert.equal(earned.find((item) => item.id === "first-challenge")?.earned, false)
assert.equal(earned.find((item) => item.id === "prompt-explorer")?.earned, false)

const reset = emptyLearningState()
assert.equal(completedLessons(reset).length, 0)
assert.equal(nextLesson(reset)?.id, "clear-goal")
assert.equal(Object.keys(reset.challenges).length, 0)

const repaired = normalizeLearningState({
  version: 1,
  lessons: { "clear-goal": { status: "completed" }, bad: { status: "nope" } },
  challenges: { "mixed-study": { correct: true }, bad: { correct: "yes" } },
})
assert.equal(repaired.lessons["clear-goal"]?.status, "completed")
assert.equal(repaired.lessons.bad, undefined)
assert.equal(repaired.challenges["mixed-study"]?.correct, true)
assert.equal(repaired.challenges.bad, undefined)

assert.equal(lessons.length, 8)
assert.equal(new Set(challenges.map((item) => item.category)).size, 8)
assert.ok(challenges.some((item) => item.kind === "choose"))
assert.ok(challenges.some((item) => item.kind === "missing"))
assert.ok(challenges.some((item) => item.kind === "improve"))

const study = challenges.find((item) => item.id === "mixed-study")
assert.ok(study && study.kind === "improve" && study.correctId === "situation")
const missing = challenges.find((item) => item.id === "audience-missing")
assert.ok(missing && missing.kind === "missing" && missing.correctIds.includes("context") && !missing.correctIds.includes("nothing"))

console.log("learning-progress tests passed")
