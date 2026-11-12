import type { TemplateItem } from "@/types/library"

export function filterTemplates(items: TemplateItem[], category: string, search: string) {
  const query = search.trim().toLowerCase()
  const words = query ? query.split(/\s+/) : []
  return items.filter((item) => {
    if (category !== "All" && item.category.toLowerCase() !== category.toLowerCase()) return false
    if (words.length === 0) return true
    const haystack = [item.title, item.description, item.category, item.startingIdea, item.bestFor, item.whyItWorks, item.difficulty]
      .join(" ")
      .toLowerCase()
    return words.every((word) => haystack.includes(word))
  })
}
