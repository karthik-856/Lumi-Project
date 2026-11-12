import type { Analysis } from "@/lib/prompt-analyzer"

function withPeriod(text: string): string {
  const trimmed = text.trim()
  if (!trimmed) return ""
  return /[.?!]$/.test(trimmed) ? trimmed : `${trimmed}.`
}

function joinUsing(parts: string[]): string {
  if (parts.length === 0) return ""
  if (parts.length === 1) return parts[0]
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`
  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`
}

export function improvePrompt(prompt: string, analysis: Analysis): string {
  const original = prompt.trim().replace(/\s+/g, " ")
  if (!original) return ""

  const flags = analysis.flags
  let text = original.replace(/[.?!]+$/, "")
  const madeExplanatory = !flags.hasAction
  if (madeExplanatory) {
    const cleaned = text.replace(/^(?:(?:please|could you|can you|would you)\s+)*(?:tell me(?:\s+about)?\s+)?/i, "").trim()
    const sourceBody = cleaned || text
    const body = sourceBody.charAt(0).toLowerCase() + sourceBody.slice(1)
    text = `Explain ${body}`
  }

  const explanatory = flags.explanatory || madeExplanatory
  const using: string[] = []
  let audience = ""

  if (flags.studyPlan && !flags.hasOutput) {
    text = text.replace(/\bstudy plan\b/i, "step-by-step study plan")
  } else if (!flags.hasOutput && !flags.studyPlan) {
    if (flags.email) using.push("a few short paragraphs")
    else if (explanatory) using.push("a step-by-step structure")
    else using.push("clear bullet points")
  }

  if (!flags.hasAudience && explanatory && !flags.email && !flags.studyPlan) {
    audience = " to a beginner"
  }
  if (!flags.hasAudience && flags.studyPlan) {
    audience = ", written for a student"
  }
  if (!flags.simpleLanguage && !/\bsimple\b/i.test(original) && explanatory && !flags.email && !flags.studyPlan) {
    using.unshift("simple language")
  }
  if (explanatory && !flags.hasExamples && !flags.email && !flags.studyPlan) {
    const structure = using.pop()
    using.push("three practical examples")
    if (structure) using.push(structure)
  }

  let improved = `${text}${audience}`
  if (using.length > 0 && !audience.startsWith(",")) improved += ` using ${joinUsing(using)}`
  else if (using.length > 0) improved += ` using ${joinUsing(using)}`

  if (flags.email && !/\b(polite|professional tone|warm)\b/i.test(original)) {
    improved += ". Use a polite, professional tone"
  }

  const unchanged = improved.replace(/[.?!]+$/, "") === text && audience === "" && using.length === 0
  if (unchanged) return withPeriod(original)
  return withPeriod(improved)
}
