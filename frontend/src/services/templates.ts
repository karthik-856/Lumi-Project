import { hydrateTemplate, templates as localTemplates, type TemplateSeed } from "@/data/templates"
import { filterTemplates } from "@/lib/template-catalog"
import type { TemplateItem } from "@/types/library"
import { api, ApiError, type ApiTemplate } from "@/services/api"

export function toTemplateItem(row: ApiTemplate): TemplateItem {
  const seed: TemplateSeed = {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category as TemplateItem["category"],
    difficulty: row.difficulty === "Intermediate" ? "Intermediate" : "Beginner",
    icon: row.icon,
    startingIdea: row.starting_idea,
    bestFor: row.best_for,
    whyItWorks: row.why_it_works,
    suggestedGoal: row.suggested_goal,
    suggestedAudience: row.suggested_audience,
    suggestedContext: row.suggested_context,
    suggestedTone: row.suggested_tone,
    suggestedOutput: row.suggested_output,
    position: row.position,
  }
  return hydrateTemplate(seed)
}

export async function getTemplates() {
  try {
    const rows = await api.getTemplates()
    if (rows.length === 0) return localTemplates
    return rows.map(toTemplateItem).sort((left, right) => left.position - right.position)
  } catch {
    return localTemplates
  }
}

export async function getTemplate(id: string) {
  try {
    return toTemplateItem(await api.getTemplate(id))
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return undefined
    return localTemplates.find((item) => item.id === id)
  }
}

export async function searchTemplates(category?: string, search?: string) {
  try {
    const rows = await api.searchTemplates(category, search)
    return rows.map(toTemplateItem)
  } catch {
    return filterTemplates(localTemplates, category ?? "All", search ?? "")
  }
}
