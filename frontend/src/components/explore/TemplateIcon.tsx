import {
  BookOpen,
  Briefcase,
  Bug,
  Calendar,
  ChartColumn,
  Code,
  GraduationCap,
  Lightbulb,
  ListChecks,
  ListTodo,
  Mail,
  PenLine,
  Presentation,
  Puzzle,
  Scale,
  Search,
  Sparkles,
  Table,
  Users,
  type LucideIcon,
} from "lucide-react"

const icons: Record<string, LucideIcon> = {
  BookOpen,
  Briefcase,
  Bug,
  Calendar,
  ChartColumn,
  Code,
  GraduationCap,
  Lightbulb,
  ListChecks,
  ListTodo,
  Mail,
  PenLine,
  Presentation,
  Puzzle,
  Scale,
  Search,
  Sparkles,
  Table,
  Users,
}

export function TemplateIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name] ?? Sparkles
  return <Icon aria-hidden="true" className={className} />
}
