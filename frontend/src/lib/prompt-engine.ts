import { audienceOptions, goalOptions, outputOptions, toneOptions } from "@/data/studio-options"
import type { AudienceId, BuiltPrompt, BuiltSection, GoalId, OutputId, StudioDraft, ToneId } from "@/types/studio"
import type { PromptIntent, PromptItem } from "@/types/library"

const actionVerbs = [
  "help",
  "explain",
  "write",
  "create",
  "analyze",
  "analyse",
  "compare",
  "summarize",
  "summarise",
  "generate",
  "solve",
  "design",
  "review",
  "improve",
  "list",
  "describe",
  "prepare",
  "make",
  "draft",
  "show",
  "give",
  "build",
  "teach",
  "fix",
  "debug",
  "rewrite",
  "plan",
  "turn",
]

const instructionStarts = new RegExp(`^(${actionVerbs.join("|")})\\b`, "i")
const actionPattern = new RegExp(`\\b(${actionVerbs.join("|")})\\b`, "i")

export function hasClearAction(text: string): boolean {
  return actionPattern.test(text)
}

const gerunds: Record<string, string> = {
  improving: "improve",
  writing: "write",
  learning: "learn",
  preparing: "prepare",
  creating: "create",
  analyzing: "analyze",
  analysing: "analyse",
  solving: "solve",
  debugging: "debug",
  explaining: "explain",
  making: "make",
  building: "build",
  understanding: "understand",
  rewriting: "rewrite",
}

const goalRole: Record<GoalId, string> = {
  learn: "You are a helpful study assistant.",
  create: "You are a thoughtful creative partner.",
  analyze: "You are a careful analyst.",
  write: "You are a clear writing assistant.",
  solve: "You are a practical problem-solving assistant.",
  brainstorm: "You are an open-minded thinking partner.",
}

const goalLine: Record<GoalId, string> = {
  learn: "Help me understand this and build my knowledge.",
  create: "Make something new from this idea.",
  analyze: "Break this down and find what matters.",
  write: "Create or improve the writing.",
  solve: "Work through the problem step by step.",
  brainstorm: "Explore ideas and possibilities with me.",
}

const audienceSentence: Record<AudienceId, string> = {
  me: "Write this for me.",
  student: "Write this for a student.",
  teacher: "Write this for a teacher.",
  customer: "Write this for a customer.",
  professional: "Write this for a professional.",
  general: "Write this for a general audience.",
  "someone-else": "Write this for the person I have in mind.",
}

const toneSentence: Record<ToneId, string> = {
  friendly: "Use a warm, encouraging tone.",
  academic: "Use a structured, formal tone suitable for academic work.",
  professional: "Use a professional tone.",
  creative: "Use a creative, imaginative tone.",
  simple: "Use clear language with minimal jargon.",
  persuasive: "Use a persuasive, confident tone.",
}

const outputSentence: Record<Exclude<OutputId, "custom">, string> = {
  paragraph: "Present the answer as a paragraph.",
  bullets: "Present the answer as structured bullet points.",
  table: "Present the answer as a table with rows and columns.",
  steps: "Present the answer as a sequence of steps.",
  checklist: "Present the answer as a checklist.",
  code: "Present the answer with code where it helps, plus a short explanation.",
}

const why: Record<string, string> = {
  task: "This keeps your original request at the center of the prompt.",
  goal: "This tells AI the kind of help you want.",
  audience: "Helps AI choose the right level of detail.",
  context: "Gives AI the situation it needs to produce a more relevant answer.",
  tone: "Sets the voice so the answer feels right for you.",
  output: "Tells AI how you want the information organized.",
  constraints: "Helps prevent unwanted or overly broad answers.",
  length: "Gives AI a size so the answer is not too long or too short.",
  language: "Tells AI which language to use.",
  examples: "Asks AI to show the idea, not only describe it.",
  required: "Names the parts you want to see in the answer.",
}

function titleOf<T extends string>(options: { id: T; title: string }[], id: T): string {
  return options.find((option) => option.id === id)?.title ?? id
}

function ensurePeriod(text: string): string {
  const trimmed = text.trim()
  if (!trimmed) return ""
  return /[.?!]$/.test(trimmed) ? trimmed : `${trimmed}.`
}

export function ideaToTask(idea: string): string {
  const original = idea.trim().replace(/\s+/g, " ")
  if (!original) return ""

  let text = original.replace(/[.?!]+$/, "")
  let stripped = false
  const replacements: Array<[RegExp, string]> = [
    [/^i want ai to /i, ""],
    [/^i want an ai to /i, ""],
    [/^i would like ai to /i, ""],
    [/^i'd like ai to /i, ""],
    [/^i need ai to /i, ""],
    [/^i want help /i, ""],
    [/^i need help /i, ""],
    [/^i want /i, ""],
  ]

  for (const [pattern, replacement] of replacements) {
    if (pattern.test(text)) {
      text = text.replace(pattern, replacement).trim()
      stripped = true
      break
    }
  }

  if (!text) return ensurePeriod(original)

  const firstWord = text.match(/^(\w+)\b/)?.[1]?.toLowerCase() ?? ""
  const passiveExplain = stripped ? text.match(/^(.+?)\s+explained(?:\s+(.*))?$/i) : null
  if (stripped && gerunds[firstWord]) {
    const rest = text.slice(firstWord.length).trim()
    text = `Help me ${gerunds[firstWord]}${rest ? ` ${rest}` : ""}`
  } else if (/^help me\b/i.test(text)) {
    text = `Help me${text.slice(text.toLowerCase().indexOf("help me") + "help me".length)}`
  } else if (passiveExplain) {
    const subject = passiveExplain[1].trim()
    const rest = passiveExplain[2]?.trim()
    text = `Explain ${subject.charAt(0).toLowerCase()}${subject.slice(1)}${rest ? ` ${rest}` : ""}`
  } else if (!instructionStarts.test(text)) {
    const body = text.charAt(0).toLowerCase() + text.slice(1)
    text = `Help me with this: ${body}`
  } else {
    text = text.charAt(0).toUpperCase() + text.slice(1)
  }

  return ensurePeriod(text)
}

function audienceBody(draft: StudioDraft): string | null {
  if (!draft.audience) return null
  if (draft.audience === "someone-else") return draft.audienceOther.trim() || "Someone else"
  return titleOf(audienceOptions, draft.audience)
}

function audienceProse(draft: StudioDraft): string | null {
  if (!draft.audience) return null
  if (draft.audience === "someone-else" && draft.audienceOther.trim()) {
    return ensurePeriod(`Write this for ${draft.audienceOther.trim()}`)
  }
  return audienceSentence[draft.audience]
}

function outputBody(draft: StudioDraft): string | null {
  if (!draft.output) return null
  if (draft.output === "custom") return draft.outputCustom.trim() || "A custom format"
  return titleOf(outputOptions, draft.output)
}

function outputProse(draft: StudioDraft): string | null {
  if (!draft.output) return null
  if (draft.output === "custom") {
    const custom = draft.outputCustom.trim()
    return custom ? ensurePeriod(`Present the answer in this format: ${custom}`) : "Present the answer in the format I will describe."
  }
  return outputSentence[draft.output]
}

function section(id: string, label: string, body: string): BuiltSection {
  return { id, label, body, why: why[id] ?? "This detail makes the request easier to follow." }
}

export function buildPrompt(draft: StudioDraft): BuiltPrompt {
  const task = ideaToTask(draft.idea)
  if (!task) return { task: "", sections: [], text: "", additions: [] }

  const sections: BuiltSection[] = [section("task", "Task", task)]
  const paragraphs: string[] = []

  if (draft.goal) {
    paragraphs.push(goalRole[draft.goal])
    sections.push(section("goal", "Goal", titleOf(goalOptions, draft.goal)))
  }
  paragraphs.push(task)

  if (draft.goal) paragraphs.push(goalLine[draft.goal])

  const audience = audienceBody(draft)
  const audienceText = audienceProse(draft)
  if (audience && audienceText) {
    sections.push(section("audience", "Audience", audience))
    paragraphs.push(audienceText)
  }

  const context = draft.context.trim()
  if (context) {
    sections.push(section("context", "Context", context))
    paragraphs.push(ensurePeriod(`Here is the situation: ${context.replace(/[.?!]+$/, "")}`))
  }

  if (draft.tone) {
    sections.push(section("tone", "Tone", titleOf(toneOptions, draft.tone)))
    paragraphs.push(toneSentence[draft.tone])
  }

  const output = outputBody(draft)
  const outputText = outputProse(draft)
  if (output && outputText) {
    sections.push(section("output", "Output", output))
    paragraphs.push(outputText)
  }

  const advanced: Array<[keyof StudioDraft["advanced"], string, string, (value: string) => string]> = [
    ["constraints", "constraints", "Constraints", (value) => ensurePeriod(`Follow these constraints: ${value.replace(/[.?!]+$/, "")}`)],
    ["length", "length", "Length", (value) => ensurePeriod(`Keep the length to ${value.replace(/[.?!]+$/, "")}`)],
    ["language", "language", "Language", (value) => ensurePeriod(`Write in ${value.replace(/[.?!]+$/, "")}`)],
    ["examples", "examples", "Examples", (value) => ensurePeriod(`Include these examples: ${value.replace(/[.?!]+$/, "")}`)],
    ["requiredSections", "required", "Required sections", (value) => ensurePeriod(`Include these sections: ${value.replace(/[.?!]+$/, "")}`)],
  ]

  for (const [key, id, label, toProse] of advanced) {
    const value = draft.advanced[key].trim()
    if (!value) continue
    sections.push(section(id, label, value))
    paragraphs.push(toProse(value))
  }

  return {
    task,
    sections,
    text: paragraphs.join("\n\n"),
    additions: sections.filter((item) => item.id !== "task").map((item) => item.label),
  }
}

const intentForGoal: Record<GoalId, PromptIntent> = {
  learn: "Study",
  create: "Create",
  analyze: "Work",
  write: "Write",
  solve: "Code",
  brainstorm: "Create",
}

export function draftIntent(draft: StudioDraft): PromptIntent {
  return draft.goal ? intentForGoal[draft.goal] : "Work"
}

export function titleFromIdea(idea: string): string {
  const task = ideaToTask(idea).replace(/[.?!]$/, "")
  const cleaned = task.replace(/^Help me with this:\s*/i, "").replace(/^Help me\s+/i, "")
  const sentence = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
  if (sentence.length <= 52) return sentence || "Untitled prompt"
  return `${sentence.slice(0, 49).trimEnd()}…`
}

export function toLibraryPrompt(draft: StudioDraft, built: BuiltPrompt, id: string): PromptItem {
  return {
    id,
    title: titleFromIdea(draft.idea),
    excerpt: built.text.replace(/\s+/g, " ").slice(0, 160),
    intent: draft.goal ? intentForGoal[draft.goal] : "Work",
    updatedLabel: "Just now",
    saved: true,
    favorite: false,
    idea: draft.idea.trim(),
    answers: built.sections
      .filter((item) => item.id !== "task")
      .map((item) => ({ label: item.label, value: item.body })),
    sections: built.sections.map((item) => ({ label: item.label, body: item.body })),
  }
}
