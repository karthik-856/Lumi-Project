export type PromptSection = {
  label: string
  body: string
}

export type GuidanceAnswer = {
  label: string
  value: string
}

export type PromptIntent = "Write" | "Study" | "Code" | "Create" | "Work"

export type ScoreBreakdownItem = {
  id: string
  label: string
  score: number
}

export type PromptItem = {
  id: string
  title: string
  excerpt: string
  intent: PromptIntent
  updatedLabel: string
  saved: boolean
  favorite: boolean
  idea: string
  answers: GuidanceAnswer[]
  sections: PromptSection[]
  score?: number
  createdAt?: string
  updatedAt?: string
  improvedText?: string
  templateId?: string
  templateCategory?: string
  analysisSummary?: string
  breakdown?: ScoreBreakdownItem[]
  improvements?: string[]
}

export type TemplateCategory =
  | "Education"
  | "Career"
  | "Coding"
  | "Writing"
  | "Research"
  | "Productivity"
  | "Creative"
  | "Data"

export type TemplateDifficulty = "Beginner" | "Intermediate"

export type TemplateItem = {
  id: string
  title: string
  description: string
  category: TemplateCategory
  difficulty: TemplateDifficulty
  icon: string
  idea: string
  startingIdea: string
  bestFor: string
  whyItWorks: string
  suggestedGoal: string
  suggestedAudience: string
  suggestedContext: string
  suggestedTone: string
  suggestedOutput: string
  position: number
  answers: GuidanceAnswer[]
  sections: PromptSection[]
}

export type GuidedPreview = {
  id: string
  title: string
  idea: string
  answers: GuidanceAnswer[]
  sections: PromptSection[]
  source: "library" | "template"
}
