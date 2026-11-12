import type { Ref } from "react"
import { Button } from "@/components/ui/button"
import { analyzerExamples } from "@/data/analyzer-examples"

export function AnalyzerInput({
  value,
  error,
  inputRef,
  onChange,
  onAnalyze,
  onTryExample,
  onUseExample,
}: {
  value: string
  error: string | null
  inputRef?: Ref<HTMLTextAreaElement>
  onChange: (value: string) => void
  onAnalyze: () => void
  onTryExample: () => void
  onUseExample: (example: string) => void
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onAnalyze()
      }}
    >
      <h2 id="improve-heading" className="text-lg font-semibold tracking-tight">
        What would you like to improve?
      </h2>
      <textarea
        ref={inputRef}
        id="analyzer-prompt"
        aria-labelledby="improve-heading"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={8}
        placeholder="Paste a prompt you've already written."
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "analyzer-error" : "analyzer-hint"}
        className="mt-3 min-h-44 w-full resize-y rounded-xl border border-border bg-surface px-3 py-3 text-base leading-relaxed outline-none placeholder:text-muted-foreground"
      />
      <p id="analyzer-hint" className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Lumi's guidance is based on the information in your prompt.
      </p>
      {error ? (
        <p id="analyzer-error" role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button type="submit" className="h-11 rounded-xl px-4 text-[15px]">
          Analyze my prompt
        </Button>
        <Button type="button" variant="outline" className="h-11 rounded-xl px-4 text-[15px]" onClick={onTryExample}>
          Try an example
        </Button>
      </div>
      <ul className="mt-4 space-y-2" aria-label="Example prompts">
        {analyzerExamples.map((example) => (
          <li key={example}>
            <button
              type="button"
              onClick={() => onUseExample(example)}
              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-left text-sm leading-relaxed hover:border-primary/45"
            >
              {example}
            </button>
          </li>
        ))}
      </ul>
    </form>
  )
}
