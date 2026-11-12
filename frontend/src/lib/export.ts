import type { EvaluationSession } from "@/types/evaluation"
import type { PromptItem } from "@/types/library"
import { latestPromptText, promptCategory } from "@/lib/prompt-record"

/** Trigger a client-side file download with the given content and MIME type. */
export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

/** Format a filename-safe slug from a title. */
export function slugifyTitle(title: string, fallback = "lumi-prompt"): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
  return slug || fallback
}

/** Format a PromptItem as a clean Markdown document. */
export function promptToMarkdown(prompt: PromptItem): string {
  const lines: string[] = [
    `# ${prompt.title}`,
    "",
    `- **Category:** ${promptCategory(prompt)}`,
  ]
  if (prompt.score != null) {
    lines.push(`- **Score:** ${prompt.score} / 100`)
  }
  lines.push("", "## Original Idea", "", prompt.idea || "_None_")

  if (prompt.answers.length > 0) {
    lines.push("", "## Structured Guidance", "")
    for (const answer of prompt.answers) {
      lines.push(`- **${answer.label}:** ${answer.value}`)
    }
  }

  lines.push("", "## Final Prompt", "", "```text", latestPromptText(prompt), "```")

  if (prompt.breakdown && prompt.breakdown.length > 0) {
    lines.push("", "## Score Breakdown", "")
    for (const item of prompt.breakdown) {
      lines.push(`- **${item.label}:** ${item.score} / 100`)
    }
  }

  return `${lines.join("\n")}\n`
}

function csvCell(value: string | number | null | undefined): string {
  const text = value == null ? "" : String(value)
  return `"${text.replace(/"/g, '""')}"`
}

/** Format a completed EvaluationSession as a 2-row CSV comparing Part A and Part B. */
export function evaluationToCsv(session: EvaluationSession): string {
  const headers = [
    "session_id",
    "part",
    "prompt",
    "score",
    "confidence",
    "duration_ms",
    "revisions",
    "steps_used",
    "questionnaire_easy",
    "questionnaire_clear",
    "questionnaire_why",
    "questionnaire_confident",
    "questionnaire_again",
  ]
  const q = session.questionnaire
  const shared = [q.easy, q.clear, q.why, q.confident, q.again]

  const rows = [
    [
      session.id,
      "without_lumi",
      session.unaided?.prompt,
      session.unaided?.score,
      session.unaided?.confidence,
      session.unaided?.durationMs,
      session.unaided?.revisions,
      "",
      ...shared,
    ],
    [
      session.id,
      "with_lumi",
      session.guided?.prompt,
      session.guided?.score,
      session.guided?.confidence,
      session.guided?.durationMs,
      session.guided?.revisions,
      session.guided?.stepsUsed.join("; "),
      ...shared,
    ],
  ]

  return [headers.map(csvCell).join(","), ...rows.map((row) => row.map(csvCell).join(","))].join("\n")
}
