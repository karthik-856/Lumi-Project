export type GoalId = "learn" | "create" | "analyze" | "write" | "solve" | "brainstorm"

export type AudienceId = "me" | "student" | "teacher" | "customer" | "professional" | "general" | "someone-else"

export type ToneId = "friendly" | "academic" | "professional" | "creative" | "simple" | "persuasive"

export type OutputId = "paragraph" | "bullets" | "table" | "steps" | "checklist" | "code" | "custom"

export type AdvancedOptions = {
  constraints: string
  length: string
  language: string
  examples: string
  requiredSections: string
}

export type StudioDraft = {
  idea: string
  goal: GoalId | null
  audience: AudienceId | null
  audienceOther: string
  context: string
  tone: ToneId | null
  output: OutputId | null
  outputCustom: string
  advancedOpen: boolean
  advanced: AdvancedOptions
}

export type BuiltSection = {
  id: string
  label: string
  body: string
  why: string
}

export type BuiltPrompt = {
  task: string
  sections: BuiltSection[]
  text: string
  additions: string[]
}
