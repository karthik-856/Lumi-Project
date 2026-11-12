import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { toast } from "sonner"
import { defaultPrompts, libraryStorageKey } from "@/data/library"
import { useBackend } from "@/hooks/useBackend"
import { LibraryContext } from "@/providers/library-context"
import { api, ApiError, toPromptItem } from "@/services/api"
import { loadPrompts, savePromptRemote } from "@/services/persistence"
import type { PromptItem } from "@/types/library"

function isPromptItem(value: unknown): value is PromptItem {
  if (!value || typeof value !== "object") return false
  const item = value as Partial<PromptItem>
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.excerpt === "string" &&
    Array.isArray(item.sections) &&
    Array.isArray(item.answers)
  )
}

function readPrompts(): PromptItem[] {
  try {
    const raw = localStorage.getItem(libraryStorageKey)
    if (!raw) return defaultPrompts
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed) || !parsed.every(isPromptItem)) return defaultPrompts
    return parsed
  } catch {
    return defaultPrompts
  }
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const backend = useBackend()
  const modeRef = useRef(backend.mode)
  const [prompts, setPrompts] = useState<PromptItem[]>(readPrompts)

  useEffect(() => {
    modeRef.current = backend.mode
  }, [backend.mode])

  useEffect(() => {
    localStorage.setItem(libraryStorageKey, JSON.stringify(prompts))
  }, [prompts])

  useEffect(() => {
    if (backend.mode !== "api") return
    let active = true
    loadPrompts(readPrompts()).then((result) => {
      if (!active) return
      if (result.online) setPrompts(result.prompts)
      else backend.markLocal()
    })
    return () => {
      active = false
    }
  }, [backend.mode, backend])

  const value = useMemo(() => {
    function rememberFailure() {
      backend.markLocal()
    }

    async function persist(item: PromptItem): Promise<"api" | "local" | "fallback"> {
      if (modeRef.current === "local") return "local"
      try {
        const saved = toPromptItem(await savePromptRemote(item))
        setPrompts((current) => [saved, ...current.filter((entry) => entry.id !== saved.id)])
        return "api"
      } catch (error) {
        if (error instanceof ApiError || error instanceof Error) rememberFailure()
        return "fallback"
      }
    }

    return {
      prompts,
      duplicatePrompt: (id: string) => {
        const source = prompts.find((item) => item.id === id)
        if (!source) return undefined
        const suffix = " — Copy"
        const title =
          source.title.length + suffix.length <= 160
            ? `${source.title}${suffix}`
            : `${source.title.slice(0, 160 - suffix.length).trimEnd()}${suffix}`
        const token = crypto.randomUUID().replace(/-/g, "").slice(0, 8)
        const copy: PromptItem = {
          ...source,
          id: `copy-${token}-${source.id}`.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 80),
          title,
          updatedLabel: "Just now",
          favorite: false,
          saved: true,
          createdAt: undefined,
          updatedAt: undefined,
        }
        setPrompts((current) => [copy, ...current])
        void persist(copy)
        return copy
      },
      toggleFavorite: (id: string) => {
        const currentItem = prompts.find((item) => item.id === id)
        if (!currentItem) return
        const next = !currentItem.favorite
        setPrompts((current) => current.map((item) => (item.id === id ? { ...item, favorite: next } : item)))
        if (modeRef.current === "local") return
        void api.favoritePrompt(id, next).catch(() => backend.markLocal())
      },
      toggleSaved: (id: string) => {
        const currentItem = prompts.find((item) => item.id === id)
        if (!currentItem) return
        const next = !currentItem.saved
        setPrompts((current) => current.map((item) => (item.id === id ? { ...item, saved: next } : item)))
        if (modeRef.current === "local") return
        void api.patchPrompt(id, { saved: next }).catch(() => backend.markLocal())
      },
      deletePrompt: (id: string) => {
        const existing = prompts.find((item) => item.id === id)
        setPrompts((current) => current.filter((item) => item.id !== id))
        if (modeRef.current !== "local") {
          void api.deletePrompt(id).catch(() => {
            backend.markLocal()
            toast.error("Couldn't delete this prompt on the server. It is removed on this device.")
          })
        }
        return existing
      },
      restorePrompt: (prompt: PromptItem) => {
        setPrompts((current) => [prompt, ...current.filter((item) => item.id !== prompt.id)])
        void persist(prompt)
      },
      restoreSamples: () => {
        setPrompts(defaultPrompts)
        if (modeRef.current === "local") return
        void Promise.all(defaultPrompts.map((item) => savePromptRemote(item))).catch(() => backend.markLocal())
      },
      upsertPrompt: async (prompt: PromptItem) => {
        setPrompts((current) => [prompt, ...current.filter((item) => item.id !== prompt.id)])
        return persist(prompt)
      },
    }
  }, [prompts, backend])

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}
