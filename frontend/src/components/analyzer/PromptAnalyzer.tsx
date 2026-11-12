import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { AnalyzerEmptyState } from "@/components/analyzer/AnalyzerEmptyState"
import { AnalyzerInput } from "@/components/analyzer/AnalyzerInput"
import { analyzerExamples } from "@/data/analyzer-examples"
import { BeforeAfterComparison } from "@/components/analyzer/BeforeAfterComparison"
import { OverallScore } from "@/components/analyzer/OverallScore"
import { ScoreBreakdown } from "@/components/analyzer/ScoreBreakdown"
import { StrengthList } from "@/components/analyzer/StrengthList"
import { SuggestionList } from "@/components/analyzer/SuggestionList"
import { SavedResult } from "@/components/prompt/SavedResult"
import { Button } from "@/components/ui/button"
import { useLibrary } from "@/hooks/useLibrary"
import { analyzePrompt, type Analysis } from "@/lib/prompt-analyzer"
import { improvePrompt } from "@/lib/prompt-improver"
import { titleFromIdea } from "@/lib/prompt-engine"
import { analysisSummary, breakdownFrom, improvementsBetween, promptToStudioSeed } from "@/lib/prompt-record"
import { clearAnalyzerHandoff, peekAnalyzerHandoff, sendDraftToStudio, sendIdeaToStudio, type AnalyzerHandoff } from "@/lib/studio-handoff"
import type { PromptIntent, PromptItem } from "@/types/library"

type Result = {
  source: string
  analysis: Analysis
  improved: string
}

export function PromptAnalyzer() {
  const navigate = useNavigate()
  const { prompts, upsertPrompt } = useLibrary()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [origin, setOrigin] = useState<AnalyzerHandoff | null>(() => peekAnalyzerHandoff())
  const [prompt, setPrompt] = useState(() => peekAnalyzerHandoff()?.text ?? "")
  const [error, setError] = useState<string | null>(null)
  const [exampleIndex, setExampleIndex] = useState(0)
  const [result, setResult] = useState<Result | null>(() => {
    const source = (peekAnalyzerHandoff()?.text ?? "").trim()
    if (!source) return null
    const analysis = analyzePrompt(source)
    return { source, analysis, improved: improvePrompt(source, analysis) }
  })

  useEffect(() => {
    clearAnalyzerHandoff()
  }, [])
  const [savedText, setSavedText] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(() => peekAnalyzerHandoff()?.promptId ?? null)
  const [panelId, setPanelId] = useState<string | null>(null)

  function analyze() {
    const source = prompt.trim()
    if (!source) {
      setError("Paste a prompt first and Lumi will take a look.")
      setResult(null)
      return
    }
    const analysis = analyzePrompt(source)
    setError(null)
    setResult({ source, analysis, improved: improvePrompt(source, analysis) })
  }

  function fillExample(example: string) {
    setPrompt(example)
    setError(null)
    setExampleIndex((analyzerExamples.indexOf(example) + 1) % analyzerExamples.length)
  }

  async function copyImproved() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.improved)
      toast.success("Suggestion copied.")
    } catch {
      toast.error("Could not copy. Select the suggestion and copy it manually.")
    }
  }

  function continueInStudio() {
    if (!result) return
    if (origin?.idea || origin?.promptId || savedId) {
      sendDraftToStudio(
        promptToStudioSeed({
          id: origin?.promptId ?? savedId ?? crypto.randomUUID(),
          title: origin?.title || titleFromIdea(origin?.idea || result.source),
          excerpt: result.improved.slice(0, 160),
          intent: origin?.intent ?? "Work",
          updatedLabel: "Just now",
          saved: true,
          favorite: origin?.favorite ?? false,
          idea: origin?.idea || result.source,
          answers: origin?.answers ?? [],
          sections: [],
          templateId: origin?.templateId,
          templateCategory: origin?.templateCategory,
        }),
      )
    } else {
      sendIdeaToStudio(result.improved)
    }
    navigate("/create/studio")
  }

  async function save() {
    if (!result) return
    const id = origin?.promptId ?? savedId ?? crypto.randomUUID()
    const place = await upsertPrompt(toSavedPrompt(result, id, origin, prompts.find((item) => item.id === id)))
    setSavedId(id)
    setSavedText(result.improved)
    setPanelId(id)
    if (place === "fallback") {
      toast.error("Couldn't save this prompt right now. Your local copy is still available.")
    }
  }

  function analyzeAnother() {
    setOrigin(null)
    setSavedId(null)
    setSavedText(null)
    setPanelId(null)
    setResult(null)
    setError(null)
    inputRef.current?.focus()
  }

  const saved = result !== null && savedText === result.improved

  return (
    <div>
      <p className="sr-only" aria-live="polite">
        {result ? `Lumi analysis: ${result.analysis.overall} out of 100. ${result.analysis.overallLabel}.` : ""}
      </p>
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <section aria-labelledby="improve-heading" className="rounded-3xl border border-border bg-elevated p-5 shadow-soft md:p-6">
          <AnalyzerInput
            value={prompt}
            error={error}
            inputRef={inputRef}
            onChange={setPrompt}
            onAnalyze={analyze}
            onTryExample={() => fillExample(analyzerExamples[exampleIndex] ?? analyzerExamples[0])}
            onUseExample={fillExample}
          />
        </section>
        {result ? (
          <div className="space-y-4">
            <OverallScore score={result.analysis.overall} label={result.analysis.overallLabel} />
            <StrengthList strengths={result.analysis.strengths} />
          </div>
        ) : (
          <AnalyzerEmptyState />
        )}
      </div>
      {result ? (
        <div className="mt-8 space-y-8">
          <ScoreBreakdown dimensions={result.analysis.dimensions} />
          <SuggestionList suggestions={result.analysis.suggestions} />
          <BeforeAfterComparison original={result.source} improved={result.improved} />
          {panelId ? <SavedResult promptId={panelId} /> : null}
          <p className="text-sm leading-relaxed text-muted-foreground">Save the suggestion, copy it, or keep shaping it in Studio.</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button type="button" className="h-11 rounded-xl px-4" onClick={save}>
              {saved ? "Saved" : "Save"}
            </Button>
            <Button type="button" variant="outline" className="h-11 rounded-xl px-4" onClick={copyImproved}>
              Copy improved prompt
            </Button>
            <Button type="button" variant="outline" className="h-11 rounded-xl px-4" onClick={continueInStudio}>
              Continue in Studio
            </Button>
            <Button type="button" variant="ghost" className="h-11 rounded-xl px-4" onClick={analyzeAnother}>
              Analyze another
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function toSavedPrompt(result: Result, id: string, origin: AnalyzerHandoff | null, existing?: PromptItem): PromptItem {
  const idea = origin?.idea?.trim() || result.source
  const latest = result.improved.trim()
  const latestAnalysis = analyzePrompt(latest)
  const improvements =
    idea !== latest ? improvementsBetween(analyzePrompt(idea), latestAnalysis) : (existing?.improvements ?? [])
  const intent: PromptIntent =
    origin?.intent ?? (result.analysis.flags.email ? "Write" : result.analysis.flags.explanatory || result.analysis.flags.studyPlan ? "Study" : "Work")
  const now = new Date().toISOString()
  return {
    id,
    title: origin?.title || existing?.title || titleFromIdea(idea),
    excerpt: result.improved.replace(/\s+/g, " ").slice(0, 160),
    intent,
    updatedLabel: "Just now",
    saved: true,
    favorite: origin?.favorite ?? existing?.favorite ?? false,
    idea,
    answers: origin?.answers?.length ? origin.answers : existing?.answers ?? [],
    sections: [{ label: "Prompt", body: result.improved }],
    score: latestAnalysis.overall,
    improvedText: latest,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    templateId: origin?.templateId ?? existing?.templateId,
    templateCategory: origin?.templateCategory ?? existing?.templateCategory,
    analysisSummary: analysisSummary(latestAnalysis.overall, latestAnalysis.overallLabel),
    breakdown: breakdownFrom(latestAnalysis),
    improvements,
  }
}
