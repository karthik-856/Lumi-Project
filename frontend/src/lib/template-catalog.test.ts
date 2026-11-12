/// <reference types="node" />
import assert from "node:assert/strict"
import { templates } from "../data/templates.ts"
import { filterTemplates } from "./template-catalog.ts"
import { parseStudioHandoff } from "./studio-handoff.ts"
import { searchTemplates } from "../services/templates.ts"

assert.ok(templates.length >= 12)
assert.ok(templates.every((item) => item.difficulty === "Beginner" || item.difficulty === "Intermediate"))
assert.equal(templates.find((item) => item.id === "exam-study-planner")?.startingIdea, "I need help preparing for an exam.")

const study = filterTemplates(templates, "All", "study")
assert.ok(study.some((item) => item.id === "exam-study-planner"))

const education = filterTemplates(templates, "Education", "study")
assert.ok(education.every((item) => item.category === "Education"))
assert.ok(education.some((item) => item.id === "exam-study-planner"))
assert.equal(filterTemplates(templates, "Data", "resume").length, 0)
assert.ok(filterTemplates(templates, "All", "Python").some((item) => item.category === "Coding"))
assert.ok(filterTemplates(templates, "All", "email").length >= 2)
assert.ok(filterTemplates(templates, "All", "presentation").some((item) => item.id === "prepare-presentation"))
assert.ok(filterTemplates(templates, "All", "research").every((item) => item.category === "Research" || item.description.toLowerCase().includes("research")))

assert.deepEqual(parseStudioHandoff("I need help preparing for an exam."), { idea: "I need help preparing for an exam." })
const seeded = parseStudioHandoff(
  JSON.stringify({ idea: "I need help preparing for an exam.", goal: "learn", note: "Starting point." }),
)
assert.equal(seeded.goal, "learn")
assert.equal(seeded.note, "Starting point.")

const remote = await searchTemplates("Education", "study")
assert.ok(remote.some((item) => item.id === "exam-study-planner"))
assert.ok(remote.every((item) => item.category === "Education"))
