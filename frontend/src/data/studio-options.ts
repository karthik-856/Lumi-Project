import {
  AlignLeft,
  BookOpen,
  Briefcase,
  Code,
  GraduationCap,
  Handshake,
  Lightbulb,
  List,
  ListChecks,
  ListOrdered,
  Megaphone,
  MessageCircle,
  Palette,
  PenLine,
  Puzzle,
  Search,
  SlidersHorizontal,
  Smile,
  Table,
  User,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react"
import type { AdvancedOptions, AudienceId, GoalId, OutputId, StudioDraft, ToneId } from "@/types/studio"

export type StudioChoice<T extends string> = {
  id: T
  title: string
  description: string
  icon: LucideIcon
}

export const goalOptions: StudioChoice<GoalId>[] = [
  { id: "learn", title: "Learn", description: "Understand a topic or build your knowledge.", icon: BookOpen },
  { id: "create", title: "Create", description: "Generate something new from your idea.", icon: Lightbulb },
  { id: "analyze", title: "Analyze", description: "Break down information and find insights.", icon: Search },
  { id: "write", title: "Write", description: "Create or improve written content.", icon: PenLine },
  { id: "solve", title: "Solve", description: "Work through a problem step by step.", icon: Puzzle },
  { id: "brainstorm", title: "Brainstorm", description: "Explore ideas and possibilities.", icon: MessageCircle },
]

export const audienceOptions: StudioChoice<AudienceId>[] = [
  { id: "me", title: "Me", description: "You will read and use the answer.", icon: User },
  { id: "student", title: "Student", description: "Someone who is learning the topic.", icon: GraduationCap },
  { id: "teacher", title: "Teacher", description: "Someone who teaches or reviews the work.", icon: BookOpen },
  { id: "customer", title: "Customer", description: "A person deciding whether to trust or buy.", icon: Handshake },
  { id: "professional", title: "Professional", description: "A colleague or expert in the field.", icon: Briefcase },
  { id: "general", title: "General audience", description: "Anyone, without special background.", icon: Users },
  { id: "someone-else", title: "Someone else", description: "Name the person in a few words.", icon: UserRound },
]

export const toneOptions: StudioChoice<ToneId>[] = [
  { id: "friendly", title: "Friendly", description: "Warm and encouraging.", icon: Smile },
  { id: "academic", title: "Academic", description: "Structured and formal, suitable for academic work.", icon: GraduationCap },
  { id: "professional", title: "Professional", description: "Clear, respectful, and work-ready.", icon: Briefcase },
  { id: "creative", title: "Creative", description: "Imaginative, with room to explore.", icon: Palette },
  { id: "simple", title: "Simple", description: "Clear language with minimal jargon.", icon: MessageCircle },
  { id: "persuasive", title: "Persuasive", description: "Confident, and aimed at agreement.", icon: Megaphone },
]

export const outputOptions: StudioChoice<OutputId>[] = [
  { id: "paragraph", title: "Paragraph", description: "One flowing explanation.", icon: AlignLeft },
  { id: "bullets", title: "Bullet points", description: "Short points that are easy to scan.", icon: List },
  { id: "table", title: "Table", description: "Compare information in rows and columns.", icon: Table },
  { id: "steps", title: "Step-by-step", description: "Break the answer into a sequence of actions.", icon: ListOrdered },
  { id: "checklist", title: "Checklist", description: "A list of items to tick off.", icon: ListChecks },
  { id: "code", title: "Code", description: "Snippets with a short explanation.", icon: Code },
  { id: "custom", title: "Custom", description: "Describe the format you want.", icon: SlidersHorizontal },
]

export const studioStepCount = 6

export const studioStepNames = ["Idea", "Goal", "Audience", "Context", "Tone", "Output"] as const

export const emptyAdvanced: AdvancedOptions = {
  constraints: "",
  length: "",
  language: "",
  examples: "",
  requiredSections: "",
}

export function createStudioDraft(goal: GoalId | null = null): StudioDraft {
  return {
    idea: "",
    goal,
    audience: null,
    audienceOther: "",
    context: "",
    tone: null,
    output: null,
    outputCustom: "",
    advancedOpen: false,
    advanced: { ...emptyAdvanced },
  }
}

const goalIds = new Set<string>(goalOptions.map((option) => option.id))

export function parseGoal(value: string | null): GoalId | null {
  if (!value || !goalIds.has(value)) return null
  return value as GoalId
}

export const intentToGoal: Record<string, GoalId> = {
  write: "write",
  study: "learn",
  code: "solve",
  create: "create",
  work: "write",
}
