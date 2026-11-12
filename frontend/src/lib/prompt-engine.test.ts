/// <reference types="node" />
import assert from "node:assert/strict"
import { createStudioDraft } from "../data/studio-options.ts"
import { buildPrompt, ideaToTask } from "./prompt-engine.ts"
import type { StudioDraft } from "../types/studio.ts"

function draft(partial: Partial<StudioDraft>): StudioDraft {
  return { ...createStudioDraft(), ...partial, advanced: { ...createStudioDraft().advanced, ...partial.advanced } }
}

assert.equal(
  ideaToTask("I want AI to help me prepare for my machine learning exam."),
  "Help me prepare for my machine learning exam.",
)
assert.equal(ideaToTask("I want help improving my resume."), "Help me improve my resume.")
assert.equal(ideaToTask("I want this code explained in plain language."), "Explain this code in plain language.")

const study = buildPrompt(
  draft({
    idea: "I want AI to help me prepare for my machine learning exam.",
    goal: "learn",
    audience: "me",
    context: "Third-year CS student",
    tone: "simple",
    output: "steps",
  }),
)

assert.match(study.text, /helpful study assistant/)
assert.match(study.text, /Help me prepare for my machine learning exam\./)
assert.match(study.text, /Write this for me\./)
assert.match(study.text, /Third-year CS student/)
assert.match(study.text, /minimal jargon/)
assert.match(study.text, /sequence of steps/)
assert.deepEqual(
  study.sections.map((section) => section.id),
  ["task", "goal", "audience", "context", "tone", "output"],
)
assert.equal(study.sections.find((section) => section.id === "audience")?.body, "Me")
assert.equal(study.sections.find((section) => section.id === "task")?.body, "Help me prepare for my machine learning exam.")

const resume = buildPrompt(
  draft({
    idea: "I want help improving my resume.",
    goal: "write",
    audience: "professional",
    tone: "professional",
    output: "bullets",
  }),
)

assert.notEqual(study.text, resume.text)
assert.match(resume.text, /clear writing assistant/)
assert.match(resume.text, /Help me improve my resume\./)
assert.match(resume.text, /Write this for a professional\./)
assert.match(resume.text, /professional tone/)
assert.match(resume.text, /bullet points/)
assert.equal(resume.sections.some((section) => section.id === "context"), false)

const minimal = buildPrompt(draft({ idea: "I want AI to help me prepare for my machine learning exam." }))
assert.deepEqual(
  minimal.sections.map((section) => section.id),
  ["task"],
)
assert.equal(minimal.additions.length, 0)
assert.doesNotMatch(minimal.text, /student|professional|bullet|jargon|assistant/i)
assert.equal(minimal.text, "Help me prepare for my machine learning exam.")

const edited = buildPrompt(
  draft({
    idea: "I want AI to help me prepare for my machine learning exam.",
    goal: "learn",
    audience: "teacher",
    context: "Third-year CS student",
    tone: "simple",
    output: "steps",
  }),
)
assert.match(edited.text, /Write this for a teacher\./)
assert.notEqual(edited.text, study.text)
assert.equal(edited.sections.find((section) => section.id === "audience")?.body, "Teacher")

const withAdvanced = buildPrompt(
  draft({
    idea: "Explain photosynthesis.",
    advanced: {
      constraints: "Stay under 150 words",
      length: "",
      language: "English",
      examples: "",
      requiredSections: "",
    },
  }),
)
assert.match(withAdvanced.text, /Explain photosynthesis\./)
assert.match(withAdvanced.text, /Stay under 150 words/)
assert.match(withAdvanced.text, /Write in English/)
assert.equal(withAdvanced.sections.some((section) => section.id === "length"), false)

console.log("prompt engine checks passed")
