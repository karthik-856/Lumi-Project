import { createContext } from "react"
import type { PromptItem } from "@/types/library"

export type LibraryContextValue = {
  prompts: PromptItem[]
  duplicatePrompt: (id: string) => PromptItem | undefined
  toggleFavorite: (id: string) => void
  toggleSaved: (id: string) => void
  deletePrompt: (id: string) => PromptItem | undefined
  restorePrompt: (prompt: PromptItem) => void
  restoreSamples: () => void
  upsertPrompt: (prompt: PromptItem) => Promise<"api" | "local" | "fallback">
}

export const LibraryContext = createContext<LibraryContextValue | null>(null)
