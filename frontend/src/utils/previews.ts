import { templates } from "@/data/templates"
import type { GuidedPreview, PromptItem } from "@/types/library"

export function findPreview(id: string, prompts: PromptItem[]): GuidedPreview | undefined {
  const prompt = prompts.find((item) => item.id === id)
  if (prompt) {
    return {
      id: prompt.id,
      title: prompt.title,
      idea: prompt.idea,
      answers: prompt.answers,
      sections: prompt.sections,
      source: "library",
    }
  }

  const template = templates.find((item) => item.id === id)
  if (!template) return undefined

  return {
    id: template.id,
    title: template.title,
    idea: template.idea,
    answers: template.answers,
    sections: template.sections,
    source: "template",
  }
}
