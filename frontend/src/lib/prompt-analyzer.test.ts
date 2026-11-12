/// <reference types="node" />
import assert from "node:assert/strict"
import { analyzePrompt, scoreBand } from "./prompt-analyzer.ts"
import { improvePrompt } from "./prompt-improver.ts"
import { ideaToTask } from "./prompt-engine.ts"

const a = analyzePrompt("Explain Python.")
const b = analyzePrompt("Explain Python functions to a beginner using three simple examples and bullet points.")
const c = analyzePrompt(
  "I am a third-year CS student preparing for my machine learning exam. Explain supervised learning in simple language using three real-world examples and a comparison with traditional programming. Keep it under 500 words and use bullet points.",
)

assert.ok(a.dimensions.find((item) => item.id === "clarity")!.score >= 75, "A clarity")
assert.ok(a.dimensions.find((item) => item.id === "context")!.score < 50, "A context")
assert.ok(a.dimensions.find((item) => item.id === "audience")!.score < 50, "A audience")
assert.ok(a.dimensions.find((item) => item.id === "output")!.score < 50, "A output")
assert.ok(a.overall < 60 && a.overall >= 35, `A overall ${a.overall}`)

assert.ok(b.dimensions.find((item) => item.id === "clarity")!.score >= 75, "B clarity")
assert.ok(b.dimensions.find((item) => item.id === "audience")!.score >= 80, "B audience")
assert.ok(b.dimensions.find((item) => item.id === "output")!.score >= 80, "B output")
assert.ok(b.dimensions.find((item) => item.id === "examples")!.score >= 80, "B examples")
assert.ok(b.overall > a.overall + 20, `B overall ${b.overall} vs A ${a.overall}`)

assert.ok(c.overall >= 85, `C overall ${c.overall}`)
assert.ok(c.dimensions.every((item) => item.score >= 75), `C dimensions ${c.dimensions.map((item) => item.id + item.score).join(",")}`)

const noun = analyzePrompt("Supervised learning.")
const explained = analyzePrompt("Explain supervised learning.")
assert.ok(noun.dimensions.find((item) => item.id === "clarity")!.score < 50)
assert.ok(explained.dimensions.find((item) => item.id === "clarity")!.score > noun.dimensions.find((item) => item.id === "clarity")!.score)

const improvedA = improvePrompt("Explain Python.", a)
assert.equal(
  improvedA,
  "Explain Python to a beginner using simple language, three practical examples, and a step-by-step structure.",
)

const improvedB = improvePrompt(
  "Explain Python functions to a beginner using three simple examples and bullet points.",
  b,
)
assert.match(improvedB, /beginner/i)
assert.match(improvedB, /bullet points/i)
assert.doesNotMatch(improvedB, /three practical examples/i)

const email = improvePrompt("Help me write an email to my professor.", analyzePrompt("Help me write an email to my professor."))
assert.match(email, /professor/i)
assert.doesNotMatch(email, /three practical examples/i)
assert.match(email, /paragraph|tone/i)

const plan = improvePrompt("Give me a study plan for my exam.", analyzePrompt("Give me a study plan for my exam."))
assert.match(plan, /step-by-step/i)
assert.doesNotMatch(plan, /three practical examples/i)

assert.equal(scoreBand(92), "Excellent")
assert.equal(scoreBand(78), "Strong")
assert.equal(scoreBand(66), "Good foundation")
assert.equal(scoreBand(48), "Could be clearer")
assert.equal(scoreBand(20), "Needs more guidance")

assert.equal(ideaToTask("I want AI to help me prepare for my machine learning exam."), "Help me prepare for my machine learning exam.")

const polite = improvePrompt(
  "please tell me the indian politics in bullet points",
  analyzePrompt("please tell me the indian politics in bullet points"),
)
assert.doesNotMatch(polite, /Explain please tell me/i)
assert.match(polite, /^Explain the indian politics in bullet points/i)

console.log("analyzer checks passed", { a: a.overall, b: b.overall, c: c.overall, improvedA, email, plan })
