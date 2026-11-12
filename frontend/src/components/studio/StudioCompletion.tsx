import { useState, type Ref } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { SavedResult } from "@/components/prompt/SavedResult"
import { BeforeAfter } from "@/components/studio/BeforeAfter"
import { Button } from "@/components/ui/button"
import { useBackend } from "@/hooks/useBackend"
import { useLibrary } from "@/hooks/useLibrary"
import type { StudioRecord } from "@/hooks/useStudio"
import { downloadFile, promptToMarkdown, slugifyTitle } from "@/lib/export"
import { draftIntent, titleFromIdea, toLibraryPrompt } from "@/lib/prompt-engine"
import { latestPromptText } from "@/lib/prompt-record"
import { sendPromptToAnalyzer } from "@/lib/studio-handoff"
import type { BuiltPrompt, StudioDraft } from "@/types/studio"

export function StudioCompletion({
  draft,
  prompt,
  saved,
  savedId,
  confirmReset,
  headingRef,
  record,
  ensureId,
  onEdit,
  onRestart,
  onRequestReset,
  onSaved,
}: {
  draft: StudioDraft
  prompt: BuiltPrompt
  saved: boolean
  savedId: string | null
  confirmReset: boolean
  headingRef?: Ref<HTMLHeadingElement>
  record: StudioRecord
  ensureId: () => string
  onEdit: () => void
  onRestart: () => void
  onRequestReset: () => void
  onSaved: (id: string) => void
}) {
  const navigate = useNavigate()
  const { prompts, upsertPrompt } = useLibrary()
  const { mode } = useBackend()
  const [copying, setCopying] = useState(false)
  const [panelId, setPanelId] = useState<string | null>(null)

  async function copyPrompt() {
    setCopying(true)
    try {
      await navigator.clipboard.writeText(prompt.text)
      toast.success("Prompt copied.")
    } catch {
      toast.error("Could not copy. Select the prompt and copy it manually.")
    } finally {
      setCopying(false)
    }
  }

  function analyzeBuiltPrompt() {
    const id = ensureId()
    sendPromptToAnalyzer({
      text: prompt.text,
      promptId: id,
      idea: draft.idea.trim(),
      title: record.title || titleFromIdea(draft.idea),
      intent: draftIntent(draft),
      templateId: record.templateId,
      templateCategory: record.templateCategory,
      favorite: record.favorite,
      answers: prompt.sections.filter((section) => section.id !== "task").map((section) => ({ label: section.label, value: section.body })),
    })
    navigate("/analyze")
  }

  async function savePrompt() {
    if (saved) {
      setPanelId(savedId || record.promptId)
      toast(mode === "api" ? "Already saved." : "Already saved in this browser.")
      return
    }
    const id = ensureId()
    const existing = prompts.find((item) => item.id === id)
    const sameText = existing ? latestPromptText(existing) === prompt.text : false
    const now = new Date().toISOString()
    const place = await upsertPrompt({
      ...toLibraryPrompt(draft, prompt, id),
      title: record.title || titleFromIdea(draft.idea),
      favorite: existing?.favorite ?? record.favorite,
      templateId: record.templateId ?? existing?.templateId,
      templateCategory: record.templateCategory ?? existing?.templateCategory,
      improvedText: prompt.text,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      score: sameText ? existing?.score : undefined,
      analysisSummary: sameText ? existing?.analysisSummary : undefined,
      breakdown: sameText ? existing?.breakdown : undefined,
      improvements: sameText ? existing?.improvements : undefined,
    })
    onSaved(id)
    setPanelId(id)
    if (place === "fallback") {
      toast.error("Couldn't save this prompt right now. Your local copy is still available.")
    }
  }

  function exportMarkdown() {
    const id = savedId || record.promptId || "studio-draft"
    const item = {
      ...toLibraryPrompt(draft, prompt, id),
      title: record.title || titleFromIdea(draft.idea),
      improvedText: prompt.text,
    }
    downloadFile(`${slugifyTitle(item.title)}.md`, promptToMarkdown(item), "text/markdown;charset=utf-8")
    toast.success("Prompt exported as Markdown.")
  }

  return (
    <section aria-labelledby="studio-ready-title" className="mt-6 rounded-3xl border border-border bg-elevated p-5 shadow-soft md:p-8">
      <h1 id="studio-ready-title" ref={headingRef} tabIndex={-1} className="type-h2 scroll-mt-24 text-balance outline-none">
        Your prompt is ready
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">Now you know what made it stronger.</p>
      <pre className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed whitespace-pre-wrap">
        {prompt.text}
      </pre>
      {panelId ? (
        <div className="mt-4">
          <SavedResult promptId={panelId} />
        </div>
      ) : null}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button type="button" className="h-11 rounded-xl px-4" onClick={analyzeBuiltPrompt}>
          Analyze prompt
        </Button>
        <Button type="button" variant="outline" className="h-11 rounded-xl px-4" onClick={savePrompt}>
          {saved ? "Saved" : "Save prompt"}
        </Button>
        <Button type="button" variant="outline" className="h-11 rounded-xl px-4" onClick={copyPrompt} disabled={copying}>
          Copy prompt
        </Button>
        <Button type="button" variant="outline" className="h-11 rounded-xl px-4" onClick={exportMarkdown}>
          Download (.md)
        </Button>
        <Button type="button" variant="outline" className="h-11 rounded-xl px-4" onClick={onEdit}>
          Edit prompt
        </Button>
        <Button type="button" variant="ghost" className="h-11 rounded-xl px-4" onClick={confirmReset ? onRestart : onRequestReset}>
          {confirmReset ? "Clear and start over" : "Start another"}
        </Button>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Tip: Adding context and audience usually makes AI responses more relevant.
      </p>
      <div className="mt-8">
        <BeforeAfter idea={draft.idea} prompt={prompt} />
      </div>
    </section>
  )
}
