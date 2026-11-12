import { audienceOptions, goalOptions, outputOptions, toneOptions } from "@/data/studio-options"
import type { AnalyzerHandoff, StudioHandoff } from "@/lib/studio-handoff"
import { scoreBand, type Analysis, type DimensionId } from "@/lib/prompt-analyzer"
import type { PromptItem } from "@/types/library"

const improvementPhrases: Record<DimensionId, string> = {
  audience: "Added a clearer audience",
  output: "Added output structure",
  constraints: "Added useful constraints",
  context: "Added more context",
  specificity: "Made the request more specific",
  examples: "Added an example",
  clarity: "Made the request clearer",
}

export function latestPromptText(prompt: PromptItem) {
  const improved = prompt.improvedText?.trim()
  if (improved) return improved
  if (prompt.sections.length > 0) return prompt.sections.map((section) => section.body).join("\n\n")
  return prompt.idea
}

export function analysisSummary(score?: number, label?: string) {
  if (score == null) return "Lumi has not scored this prompt yet."
  return `${score} out of 100. ${label ?? scoreBand(score)}.`
}

export function promptCategory(prompt: PromptItem) {
  return prompt.templateCategory || prompt.intent
}

export function improvementsBetween(before: Analysis, after: Analysis) {
  const earlier = new Map(before.dimensions.map((item) => [item.id, item.score]))
  return after.dimensions
    .filter((item) => item.score - (earlier.get(item.id) ?? 0) >= 8)
    .map((item) => improvementPhrases[item.id])
}

export function breakdownFrom(analysis: Analysis) {
  return analysis.dimensions.map((item) => ({ id: item.id, label: item.label, score: item.score }))
}

export function formatPromptDate(iso?: string) {
  if (!iso) return ""
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(date)
}

function choiceId(options: { id: string; title: string }[], value: string | undefined) {
  if (!value) return undefined
  const match = options.find((option) => option.id === value || option.title.toLowerCase() === value.toLowerCase())
  return match?.id
}

export function promptToStudioSeed(prompt: PromptItem): StudioHandoff {
  const answers = new Map(prompt.answers.map((answer) => [answer.label.toLowerCase(), answer.value]))
  return {
    idea: prompt.idea.trim() || latestPromptText(prompt),
    goal: choiceId(goalOptions, answers.get("goal")),
    audience: choiceId(audienceOptions, answers.get("audience")),
    context: answers.get("context") ?? "",
    tone: choiceId(toneOptions, answers.get("tone")),
    output: choiceId(outputOptions, answers.get("output")),
    note: "Your saved prompt is the starting idea. Change any answer.",
    promptId: prompt.id,
    templateId: prompt.templateId,
    templateCategory: prompt.templateCategory,
    title: prompt.title,
    favorite: prompt.favorite,
  }
}

export function promptToAnalyzerSeed(prompt: PromptItem): AnalyzerHandoff {
  return {
    text: latestPromptText(prompt),
    promptId: prompt.id,
    idea: prompt.idea,
    title: prompt.title,
    intent: prompt.intent,
    templateId: prompt.templateId,
    templateCategory: prompt.templateCategory,
    favorite: prompt.favorite,
    answers: prompt.answers,
  }
}

export function promptMatchesSearch(prompt: PromptItem, search: string) {
  const query = search.trim().toLowerCase()
  if (!query) return true
  const haystack = [prompt.title, prompt.excerpt, prompt.idea, prompt.intent, prompt.improvedText ?? "", latestPromptText(prompt)]
    .join(" ")
    .toLowerCase()
  return query.split(/\s+/).every((word) => haystack.includes(word))
}
