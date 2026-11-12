import {
  Briefcase,
  Code2,
  GraduationCap,
  PenLine,
  SearchCheck,
  Shapes,
  type LucideIcon,
} from "lucide-react"

export type QuickStart = {
  id: string
  title: string
  description: string
  to: string
  icon: LucideIcon
}

export const quickStarts: QuickStart[] = [
  {
    id: "write",
    title: "Write",
    description: "Create clearer emails, essays, and documents.",
    to: "/create?intent=write",
    icon: PenLine,
  },
  {
    id: "study",
    title: "Study",
    description: "Turn a topic into a clear study plan.",
    to: "/create?intent=study",
    icon: GraduationCap,
  },
  {
    id: "code",
    title: "Code",
    description: "Explain, debug, or learn code step by step.",
    to: "/create?intent=code",
    icon: Code2,
  },
  {
    id: "create",
    title: "Create",
    description: "Shape a presentation, outline, or brief you can use.",
    to: "/create?intent=create",
    icon: Shapes,
  },
  {
    id: "analyze",
    title: "Analyze",
    description: "See what a prompt you already wrote is missing.",
    to: "/analyze",
    icon: SearchCheck,
  },
  {
    id: "work",
    title: "Work",
    description: "Prepare notes, updates, and the writing your week needs.",
    to: "/create?intent=work",
    icon: Briefcase,
  },
]

export const intentCopy: Record<string, string> = {
  write: "You want help with writing. Lumi will ask who it is for, how it should sound, and what shape the result should take.",
  study: "You want help studying. Lumi will ask what you are learning, who the explanation is for, and how you want to practice.",
  code: "You want help with code. Lumi will ask what you are trying to understand, your experience, and whether you want steps or an example.",
  create: "You want to make something. Lumi will ask what it is, who it is for, and the tone you want people to feel.",
  work: "You want help with everyday work. Lumi will ask for the situation, the reader, and what a useful result looks like.",
}
