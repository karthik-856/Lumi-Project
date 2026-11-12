import { BookOpen, ClipboardCheck, Compass, FolderOpen, Home, PenLine, type LucideIcon } from "lucide-react"

export type NavItem = {
  to: string
  label: string
  shortLabel: string
  icon: LucideIcon
  end: boolean
}

export const primaryNav: NavItem[] = [
  { to: "/", label: "Home", shortLabel: "Home", icon: Home, end: true },
  { to: "/create", label: "Create", shortLabel: "Create", icon: PenLine, end: false },
  { to: "/learn", label: "Learn", shortLabel: "Learn", icon: BookOpen, end: false },
  { to: "/explore", label: "Explore", shortLabel: "Explore", icon: Compass, end: false },
  { to: "/my-work", label: "My Work", shortLabel: "Work", icon: FolderOpen, end: false },
  { to: "/evaluate", label: "Evaluate", shortLabel: "Evaluate", icon: ClipboardCheck, end: false },
]
