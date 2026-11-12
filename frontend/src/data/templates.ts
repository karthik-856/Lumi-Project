import raw from "./templates.json"
import { audienceOptions, goalOptions, outputOptions, toneOptions } from "@/data/studio-options"
import type { GuidanceAnswer, PromptSection, TemplateCategory, TemplateItem } from "@/types/library"

export type TemplateSeed = {
  id: string
  title: string
  description: string
  category: TemplateCategory
  difficulty: TemplateItem["difficulty"]
  icon: string
  startingIdea: string
  bestFor: string
  whyItWorks: string
  suggestedGoal: string
  suggestedAudience: string
  suggestedContext: string
  suggestedTone: string
  suggestedOutput: string
  position: number
}

function choiceTitle(options: { id: string; title: string }[], id: string) {
  return options.find((option) => option.id === id)?.title ?? id
}

export function hydrateTemplate(seed: TemplateSeed): TemplateItem {
  const goal = choiceTitle(goalOptions, seed.suggestedGoal)
  const audience = choiceTitle(audienceOptions, seed.suggestedAudience)
  const tone = choiceTitle(toneOptions, seed.suggestedTone)
  const output = choiceTitle(outputOptions, seed.suggestedOutput)
  const answers: GuidanceAnswer[] = [
    { label: "Goal", value: goal },
    { label: "Audience", value: audience },
    { label: "Context", value: seed.suggestedContext },
    { label: "Tone", value: tone },
    { label: "Output", value: output },
  ]
  const sections: PromptSection[] = [
    { label: "Task", body: seed.startingIdea },
    { label: "Context", body: seed.suggestedContext },
    { label: "Output", body: `Respond in this format: ${output}.` },
  ]

  return {
    ...seed,
    idea: seed.startingIdea,
    answers,
    sections,
  }
}

export const templateCategories: TemplateCategory[] = [
  "Education",
  "Career",
  "Coding",
  "Writing",
  "Research",
  "Productivity",
  "Creative",
  "Data",
]

export const templates: TemplateItem[] = (raw as TemplateSeed[])
  .map(hydrateTemplate)
  .sort((a, b) => a.position - b.position)
