import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { audienceOptions, createStudioDraft, goalOptions, outputOptions, toneOptions } from "@/data/studio-options"
import { analyzePrompt } from "@/lib/prompt-analyzer"
import { buildPrompt } from "@/lib/prompt-engine"
import { sendDraftToStudio, sendPromptToAnalyzer } from "@/lib/studio-handoff"
import { cn } from "@/lib/utils"
import type { AudienceId, GoalId, OutputId, StudioDraft, ToneId } from "@/types/studio"

type Preset = {
  id: string
  label: string
  draft: Partial<StudioDraft>
}

const presets: Preset[] = [
  {
    id: "study",
    label: "Academic study",
    draft: {
      idea: "I want AI to help me prepare for my database systems exam.",
      goal: "learn",
      audience: "student",
      context: "Second-year CS student; I know tables and keys, but struggle with SQL joins.",
      tone: "academic",
      output: "steps",
    },
  },
  {
    id: "presentation",
    label: "Project presentation",
    draft: {
      idea: "Help me structure a 5-minute project presentation on Lumi.",
      goal: "create",
      audience: "teacher",
      context: "Final academic viva explaining the problem, how we guide prompts, and our results.",
      tone: "professional",
      output: "bullets",
    },
  },
  {
    id: "code",
    label: "Code explanation",
    draft: {
      idea: "Explain Python recursion with a small working example.",
      goal: "learn",
      audience: "me",
      context: "I know loops and functions, but recursion trace calls confuse me.",
      tone: "simple",
      output: "code",
    },
  },
]

function makeDraft(preset: Preset): StudioDraft {
  return { ...createStudioDraft(), ...preset.draft }
}

export function PromptWorkbench() {
  const navigate = useNavigate()
  const [activePreset, setActivePreset] = useState(presets[0].id)
  const [draft, setDraft] = useState<StudioDraft>(() => makeDraft(presets[0]))

  const built = useMemo(() => buildPrompt(draft), [draft])
  const analysis = useMemo(() => (built.text ? analyzePrompt(built.text) : null), [built.text])

  function applyPreset(preset: Preset) {
    setActivePreset(preset.id)
    setDraft(makeDraft(preset))
  }

  function updateField<K extends keyof StudioDraft>(key: K, value: StudioDraft[K]) {
    setActivePreset("")
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  async function copyResult() {
    if (!built.text) return
    try {
      await navigator.clipboard.writeText(built.text)
      toast.success("Prompt copied.")
    } catch {
      toast.error("Could not copy. Select the prompt and copy it manually.")
    }
  }

  function openInStudio() {
    sendDraftToStudio({
      idea: draft.idea,
      goal: draft.goal ?? undefined,
      audience: draft.audience ?? undefined,
      context: draft.context,
      tone: draft.tone ?? undefined,
      output: draft.output ?? undefined,
      note: "Pre-filled from the home workbench. Adjust any step or add constraints.",
    })
    navigate("/create/studio")
  }

  function openInAnalyzer() {
    if (!built.text) return
    sendPromptToAnalyzer({ text: built.text, idea: draft.idea })
    navigate("/analyze")
  }

  return (
    <section
      aria-labelledby="workbench-heading"
      className="rounded-3xl border border-border bg-elevated p-4 shadow-soft sm:p-5 lg:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="workbench-heading" className="text-sm font-semibold tracking-tight">
            Interactive Prompt Builder
          </h2>
          <p className="text-xs text-muted-foreground">Idea, goal, audience, context, tone, and output — live.</p>
        </div>
        {analysis ? (
          <span
            aria-label={`Prompt score ${analysis.overall} out of 100`}
            className="inline-flex items-center rounded-full border border-primary/30 bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground tabular-nums"
          >
            Score {analysis.overall} / 100 · {analysis.overallLabel}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Example scenarios">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => applyPreset(preset)}
            className={cn(
              "min-h-8 cursor-pointer rounded-lg border px-2.5 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              activePreset === preset.id
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border bg-surface text-muted-foreground hover:text-foreground",
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <label htmlFor="wb-idea" className="text-xs font-medium text-primary">
            1. Idea (What you want)
          </label>
          <input
            id="wb-idea"
            type="text"
            value={draft.idea}
            onChange={(e) => updateField("idea", e.target.value)}
            placeholder="Describe what you want AI to help with..."
            className="mt-1 h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <div>
            <label htmlFor="wb-goal" className="text-xs font-medium text-primary">
              2. Goal
            </label>
            <select
              id="wb-goal"
              value={draft.goal ?? ""}
              onChange={(e) => updateField("goal", (e.target.value || null) as GoalId | null)}
              className="mt-1 h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">Choose goal</option>
              {goalOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="wb-audience" className="text-xs font-medium text-primary">
              3. Audience
            </label>
            <select
              id="wb-audience"
              value={draft.audience ?? ""}
              onChange={(e) => updateField("audience", (e.target.value || null) as AudienceId | null)}
              className="mt-1 h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">Choose audience</option>
              {audienceOptions
                .filter((item) => item.id !== "someone-else")
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="wb-context" className="text-xs font-medium text-primary">
            4. Context (Situation &amp; background)
          </label>
          <input
            id="wb-context"
            type="text"
            value={draft.context}
            onChange={(e) => updateField("context", e.target.value)}
            placeholder="Add background, level, or what you already tried..."
            className="mt-1 h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <div>
            <label htmlFor="wb-tone" className="text-xs font-medium text-primary">
              5. Tone
            </label>
            <select
              id="wb-tone"
              value={draft.tone ?? ""}
              onChange={(e) => updateField("tone", (e.target.value || null) as ToneId | null)}
              className="mt-1 h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">Choose tone</option>
              {toneOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="wb-output" className="text-xs font-medium text-primary">
              6. Output (How to present)
            </label>
            <select
              id="wb-output"
              value={draft.output ?? ""}
              onChange={(e) => updateField("output", (e.target.value || null) as OutputId | null)}
              className="mt-1 h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">Choose output</option>
              {outputOptions
                .filter((item) => item.id !== "custom")
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-background p-3.5">
        <p className="text-xs font-medium text-primary">Generated prompt</p>
        <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
          {built.text || "Enter an idea above to assemble a structured prompt."}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" size="sm" className="h-9 rounded-xl px-3" onClick={() => void copyResult()} disabled={!built.text}>
          Copy prompt
        </Button>
        <Button type="button" size="sm" variant="outline" className="h-9 rounded-xl px-3" onClick={openInStudio}>
          Continue in Studio
        </Button>
        <Button type="button" size="sm" variant="ghost" className="h-9 rounded-xl px-3" onClick={openInAnalyzer} disabled={!built.text}>
          Analyze score
        </Button>
      </div>
    </section>
  )
}
