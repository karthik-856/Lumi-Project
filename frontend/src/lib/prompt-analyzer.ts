import { hasClearAction } from "@/lib/prompt-engine"

export const SCORE_WEIGHTS = {
  clarity: 0.2,
  context: 0.15,
  specificity: 0.2,
  audience: 0.15,
  output: 0.15,
  constraints: 0.1,
  examples: 0.05,
} as const

export type DimensionId = keyof typeof SCORE_WEIGHTS

export type PromptFlags = {
  hasAction: boolean
  hasContext: boolean
  hasAudience: boolean
  hasOutput: boolean
  hasConstraints: boolean
  hasExamples: boolean
  hasSpecifics: boolean
  explanatory: boolean
  broadTopic: boolean
  email: boolean
  studyPlan: boolean
  simpleLanguage: boolean
}

export type DimensionScore = {
  id: DimensionId
  label: string
  score: number
  status: string
  explanation: string
}

export type Suggestion = {
  id: string
  title: string
  detail: string
  why: string
}

export type Analysis = {
  overall: number
  overallLabel: string
  dimensions: DimensionScore[]
  strengths: string[]
  suggestions: Suggestion[]
  missing: string[]
  flags: PromptFlags
}

const labels: Record<DimensionId, string> = {
  clarity: "Clarity",
  context: "Context",
  specificity: "Specificity",
  audience: "Audience",
  output: "Output",
  constraints: "Constraints",
  examples: "Examples",
}

const audiencePattern =
  /\b(beginners?|students?|teachers?|developers?|managers?|customers?|professionals?|child|children|experts?|third-year|non-technical|professors?|classmates?|hiring managers?)\b|\b(for|to)\s+(a|an|my|someone)\s+(beginner|student|teacher|developer|manager|customer|professional|professor|child|expert|person)\b|\bfor someone new\b|\bfor a presentation\b/i

const outputPattern =
  /\b(bullet points?|bullets|table|tables|steps|step-by-step|checklist|paragraphs?|json|code|summary|sections|headings|outline)\b/i

const constraintPattern =
  /\b(under|less than|no more than|at most|exactly)\s+\d+\b|\b\d+\s+words\b|\b(do not|don't|avoid|without)\b|\bsimple (english|language)\b|\b(no|minimal|without) jargon\b|\bkeep it (under|short|brief)\b|\b(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+(simple\s+|real-world\s+|practical\s+)?(examples|points|steps|paragraphs)\b/i

const examplePattern = /\b(for example|e\.g\.|such as|a sample|sample answer|examples?)\b/i

const contextPattern =
  /\b(i am|i'm|i’m)\b|\bpreparing for\b|\b(my exam|my class|my course|my project|my presentation)\b|\bthis is for\b|\bi (understand|know|struggle|have)\b|\bbeginner-level\b|\bfor my exam\b/i

const specificPattern =
  /\b(functions?|loops?|classes|supervised|unsupervised|normalization|regression|classification|joins?|sql|api|algorithm|email|study plan|presentation)\b|\b(comparison|compare|versus|vs\.?|difference between)\b|\b(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\b/i

const broadTopicPattern =
  /^(help me\s+)?(explain|describe|tell me about|teach me|write about|help me with)\s+(python|javascript|ai|machine learning|coding|programming|math|maths|history|science)\.?$/i

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function scoreBand(score: number): string {
  if (score >= 90) return "Excellent"
  if (score >= 75) return "Strong"
  if (score >= 60) return "Good foundation"
  if (score >= 40) return "Could be clearer"
  return "Needs more guidance"
}

function clarityScore(text: string, hasAction: boolean): number {
  if (!hasAction) return text.split(/\s+/).filter(Boolean).length <= 6 ? 28 : 36
  const words = text.split(/\s+/).filter(Boolean)
  return words.length >= 2 ? 88 : 74
}

function contextScore(text: string, hasContext: boolean): number {
  if (!hasContext) return 32
  let score = 70
  if (/\b(i am|i'm|i’m)\b/i.test(text)) score += 12
  if (/\b(preparing for|my exam|for my exam)\b/i.test(text)) score += 10
  return clamp(score)
}

function specificityScore(text: string, broadTopic: boolean): number {
  if (broadTopic) return 34
  let score = 28
  if (specificPattern.test(text)) score += 28
  if (/\b(comparison|compare|versus|vs\.?|difference between)\b/i.test(text)) score += 14
  if (/\b(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\b/i.test(text)) score += 16
  if (/\b(email|study plan|presentation|functions?|supervised)\b/i.test(text)) score += 12
  return clamp(score)
}

function audienceScore(hasAudience: boolean): number {
  return hasAudience ? 92 : 34
}

function outputScore(hasOutput: boolean): number {
  return hasOutput ? 94 : 30
}

function constraintScore(text: string, hasConstraints: boolean): number {
  if (!hasConstraints) return 62
  let score = 78
  if (/\b(under|less than|no more than|at most)\s+\d+\b|\b\d+\s+words\b/i.test(text)) score += 10
  if (/\bsimple (english|language)\b|\bno jargon\b|\bminimal jargon\b/i.test(text)) score += 8
  return clamp(score)
}

function exampleScore(hasExamples: boolean): number {
  return hasExamples ? 94 : 60
}

function detectFlags(text: string): PromptFlags {
  const explanatory = /\b(explain|describe|teach|summarize|summarise)\b/i.test(text)
  const hasExamples = examplePattern.test(text)
  const hasConstraints = constraintPattern.test(text)
  const hasSpecifics = specificPattern.test(text) && !broadTopicPattern.test(text)
  return {
    hasAction: hasClearAction(text),
    hasContext: contextPattern.test(text),
    hasAudience: audiencePattern.test(text),
    hasOutput: outputPattern.test(text),
    hasConstraints,
    hasExamples,
    hasSpecifics,
    explanatory,
    broadTopic: broadTopicPattern.test(text),
    email: /\bemail\b/i.test(text),
    studyPlan: /\bstudy plan\b/i.test(text),
    simpleLanguage: /\bsimple (english|language)\b|\b(no|minimal|without) jargon\b/i.test(text),
  }
}

function explanation(id: DimensionId, score: number, flags: PromptFlags): string {
  if (id === "clarity") {
    return flags.hasAction
      ? "Your request clearly tells AI what you want it to do."
      : "Try starting with a clear action, such as 'Explain...' or 'Compare...'"
  }
  if (id === "context") {
    return flags.hasContext
      ? "You included background that helps AI understand the situation."
      : "Your goal is clear. Adding a little background could help AI give a more relevant response."
  }
  if (id === "specificity") {
    return score >= 70
      ? "The request names a specific subject and the details that matter."
      : "The topic is broad. Naming the part you care about would make the answer more useful."
  }
  if (id === "audience") {
    return flags.hasAudience
      ? "You named who the response is for."
      : "You haven't specified who the response is for."
  }
  if (id === "output") {
    return flags.hasOutput
      ? "You said how the answer should be organized."
      : "Consider specifying how you want the answer structured."
  }
  if (id === "constraints") {
    return flags.hasConstraints
      ? "You set a boundary the answer should respect."
      : "No limit yet, which is fine. Add one only if you want to shape the length or language."
  }
  return flags.hasExamples
    ? "You asked for examples, which helps the answer stay concrete."
    : "Examples are optional here. Add one if you want the idea shown in practice."
}

function buildStrengths(scores: Record<DimensionId, number>, flags: PromptFlags): string[] {
  const strengths: string[] = []
  if (scores.clarity >= 70) strengths.push("Clear task")
  if (scores.specificity >= 70) strengths.push("Specific topic")
  if (scores.context >= 70) strengths.push("Useful background")
  if (scores.audience >= 70) strengths.push("Named audience")
  if (scores.output >= 70) strengths.push("Requested a format")
  if (flags.hasExamples && scores.examples >= 75) strengths.push("Requested examples")
  if (flags.hasConstraints && scores.constraints >= 75) strengths.push("Set a helpful limit")
  return strengths
}

function buildSuggestions(scores: Record<DimensionId, number>, flags: PromptFlags): Suggestion[] {
  const suggestions: Suggestion[] = []
  if (!flags.hasAction) {
    suggestions.push({
      id: "action",
      title: "Start with a clear action",
      detail: "Try starting with a clear action, such as 'Explain...' or 'Compare...'",
      why: "A clear verb tells AI what to do instead of guessing the task.",
    })
  }
  if (scores.specificity < 70) {
    suggestions.push({
      id: "specificity",
      title: "Name the part you care about",
      detail: "A narrower subject keeps the answer on the piece you actually need.",
      why: "A specific subject gives AI a boundary, so the answer is less likely to stay general.",
    })
  }
  if (!flags.hasAudience) {
    suggestions.push({
      id: "audience",
      title: "Add your audience",
      detail: "Tell AI who the response is for so it can adjust its language and level of detail.",
      why: "AI can adjust vocabulary, depth, and examples when it knows who will read the response.",
    })
  }
  if (!flags.hasContext && flags.hasAction) {
    suggestions.push({
      id: "context",
      title: "Explain your situation",
      detail: "Your goal is clear. Adding a little background could help AI give a more relevant response.",
      why: "Background gives AI the situation it needs, such as an exam, a class, or what you already know.",
    })
  }
  if (!flags.hasOutput) {
    suggestions.push({
      id: "output",
      title: "Specify the desired output format",
      detail: "Consider specifying how you want the answer structured.",
      why: "A format tells AI how you want the information organized, such as steps, bullets, or a short paragraph.",
    })
  }
  if (flags.explanatory && !flags.hasExamples) {
    suggestions.push({
      id: "examples",
      title: "Ask for an example",
      detail: "An example is useful when you want the idea shown, not only described.",
      why: "Examples make an explanation easier to recognize in a real situation.",
    })
  }
  if (!flags.hasConstraints && flags.broadTopic) {
    suggestions.push({
      id: "constraints",
      title: "Add a limit, if you want one",
      detail: "A length, a language level, or a number of items can keep a broad answer in bounds.",
      why: "A limit helps prevent an answer that is too long or too broad. Many prompts do not need one.",
    })
  }
  return suggestions
}

export function overallFromScores(scores: Record<DimensionId, number>): number {
  const total = (Object.keys(SCORE_WEIGHTS) as DimensionId[]).reduce(
    (sum, id) => sum + scores[id] * SCORE_WEIGHTS[id],
    0,
  )
  return Math.round(total)
}

export function analyzePrompt(prompt: string): Analysis {
  const text = prompt.trim().replace(/\s+/g, " ")
  const flags = detectFlags(text)
  const scores: Record<DimensionId, number> = {
    clarity: clarityScore(text, flags.hasAction),
    context: contextScore(text, flags.hasContext),
    specificity: specificityScore(text, flags.broadTopic),
    audience: audienceScore(flags.hasAudience),
    output: outputScore(flags.hasOutput),
    constraints: constraintScore(text, flags.hasConstraints),
    examples: exampleScore(flags.hasExamples),
  }

  const dimensions = (Object.keys(scores) as DimensionId[]).map((id) => ({
    id,
    label: labels[id],
    score: scores[id],
    status: scoreBand(scores[id]),
    explanation: explanation(id, scores[id], flags),
  }))

  const suggestions = buildSuggestions(scores, flags)

  return {
    overall: overallFromScores(scores),
    overallLabel: scoreBand(overallFromScores(scores)),
    dimensions,
    strengths: buildStrengths(scores, flags),
    suggestions,
    missing: suggestions.map((item) => item.title),
    flags,
  }
}
