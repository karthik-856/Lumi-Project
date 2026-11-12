/// <reference types="node" />
import assert from "node:assert/strict"
import { analyzePrompt } from "./prompt-analyzer.ts"
import { improvementsBetween } from "./prompt-record.ts"
import { parseAnalyzerHandoff, parseStudioHandoff } from "./studio-handoff.ts"

const vague = analyzePrompt("Help me study.")
const clearer = analyzePrompt(
  "Help me prepare for my databases exam on Friday. Write this for a student. Give me a step-by-step study plan in under 200 words.",
)
const changes = improvementsBetween(vague, clearer)
assert.ok(changes.includes("Added a clearer audience"))
assert.ok(changes.includes("Added output structure"))
assert.equal(improvementsBetween(clearer, clearer).length, 0)

const idea = analyzePrompt("I need help preparing for a databases exam on Friday.")
const studioPrompt = analyzePrompt(
  "You are a helpful study assistant. Help me prepare for a databases exam on Friday. Write this for a student. Present the answer as a sequence of steps.",
)
const journey = improvementsBetween(idea, studioPrompt)
assert.ok(journey.includes("Added a clearer audience"))
assert.ok(journey.includes("Added output structure"))

const studio = parseStudioHandoff(
  JSON.stringify({
    idea: "I need help preparing for an exam.",
    promptId: "prompt-exam",
    templateId: "exam-study-planner",
    templateCategory: "Education",
    title: "Exam Study Planner",
  }),
)
assert.equal(studio.promptId, "prompt-exam")
assert.equal(studio.templateCategory, "Education")

const analyzed = parseAnalyzerHandoff(
  JSON.stringify({ text: "Help me study.", promptId: "prompt-exam", idea: "I need help preparing for an exam." }),
)
assert.equal(analyzed.promptId, "prompt-exam")
assert.equal(analyzed.idea, "I need help preparing for an exam.")
assert.equal(parseAnalyzerHandoff("Explain Python.").text, "Explain Python.")
