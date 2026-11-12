import { useState } from "react"
import { Container } from "@/components/common/Container"
import { PageIntro } from "@/components/common/PageIntro"
import { Button } from "@/components/ui/button"
import { useBackend } from "@/hooks/useBackend"
import { useLearning } from "@/hooks/useLearning"
import { usePreferences } from "@/hooks/usePreferences"
import { usePageTitle } from "@/hooks/usePageTitle"
import { cn } from "@/lib/utils"
import type { ContrastPreference, FontScalePreference, MotionPreference } from "@/types/preferences"

type Choice<T extends string> = { id: T; label: string; detail: string }

const themes: Choice<"light" | "dark" | "system">[] = [
  { id: "light", label: "Light", detail: "Warm paper and soft violet." },
  { id: "dark", label: "Dark", detail: "Deep neutral, with the same violet kept quiet." },
  { id: "system", label: "Match device", detail: "Follow the appearance of this device." },
]

const contrasts: Choice<ContrastPreference>[] = [
  { id: "default", label: "Standard", detail: "The designed palette." },
  { id: "high", label: "High contrast", detail: "Stronger text, borders, and focus." },
  { id: "system", label: "Match device", detail: "Follow this device’s contrast setting." },
]

const sizes: Choice<FontScalePreference>[] = [
  { id: "default", label: "Default", detail: "16px body text." },
  { id: "large", label: "Large", detail: "18px. Easier for longer reading." },
  { id: "larger", label: "Larger", detail: "20px. The whole interface scales." },
]

const motions: Choice<MotionPreference>[] = [
  { id: "system", label: "Match device", detail: "Use this device’s motion setting." },
  { id: "reduce", label: "Reduce motion", detail: "Keep changes instant." },
  { id: "full", label: "Allow motion", detail: "Use Lumi’s gentle transitions." },
]

export default function SettingsPage() {
  usePageTitle("Settings")
  const { theme, setTheme, contrast, fontScale, motion, setContrast, setFontScale, setMotion, resetPreferences } =
    usePreferences()
  const learning = useLearning()
  const backend = useBackend()
  const [status, setStatus] = useState("")
  const [confirmLearningReset, setConfirmLearningReset] = useState(false)

  return (
    <Container className="py-10 md:py-14">
      <PageIntro
        eyebrow="Settings"
        title="Make Lumi easier to use"
        description="Appearance, contrast, text size, and motion stay on this device. They apply everywhere in Lumi."
      />
      <p className="sr-only" aria-live="polite">
        {status}
      </p>

      <div className="mt-10 space-y-10">
        <ChoiceGroup
          legend="Appearance"
          value={theme ?? "system"}
          options={themes}
          onChange={(value) => {
            setTheme(value)
            setStatus(`Appearance set to ${labelOf(themes, value)}.`)
          }}
        />
        <ChoiceGroup
          legend="Contrast"
          value={contrast}
          options={contrasts}
          onChange={(value) => {
            setContrast(value)
            setStatus(`Contrast set to ${labelOf(contrasts, value)}.`)
          }}
        />
        <ChoiceGroup
          legend="Text size"
          value={fontScale}
          options={sizes}
          onChange={(value) => {
            setFontScale(value)
            setStatus(`Text size set to ${labelOf(sizes, value)}.`)
          }}
        />
        <p className="max-w-xl rounded-2xl border border-border bg-surface px-4 py-3 text-base leading-relaxed">
          This is how lessons and prompts will read.
        </p>
        <ChoiceGroup
          legend="Motion"
          value={motion}
          options={motions}
          onChange={(value) => {
            setMotion(value)
            setStatus(`Motion set to ${labelOf(motions, value)}.`)
          }}
        />
      </div>

      <Button
        type="button"
        variant="outline"
        className="mt-10 h-11 rounded-xl px-4"
        onClick={() => {
          resetPreferences()
          setStatus("Settings returned to the recommendations.")
        }}
      >
        Use recommended settings
      </Button>

      <section aria-labelledby="storage-heading" className="mt-12 max-w-xl border-t border-border pt-10">
        <h2 id="storage-heading" className="text-lg font-semibold tracking-tight">
          Where your work stays
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {backend.mode === "local"
            ? "Lumi is in local mode. Prompts, learning, and evaluations stay in this browser until the library is available again."
            : backend.mode === "checking"
              ? "Lumi is checking whether the library on this computer is available."
              : "Prompts, learning, and evaluations stay in Lumi's library on this computer. There is no account to sign in to."}
        </p>
      </section>

      <section aria-labelledby="learning-reset-heading" className="mt-12 max-w-xl border-t border-border pt-10">
        <h2 id="learning-reset-heading" className="text-lg font-semibold tracking-tight">
          Learning progress
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Reset learning progress clears lessons and challenges on this device. Saved prompts stay.
        </p>
        {confirmLearningReset ? (
          <div className="mt-4 rounded-2xl border border-border bg-surface p-4" role="group" aria-label="Confirm reset learning progress">
            <p className="text-sm leading-relaxed">This clears lesson and challenge progress. It cannot be undone. Your saved prompts are not deleted.</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="outline" className="h-11 rounded-xl px-4" onClick={() => setConfirmLearningReset(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="h-11 rounded-xl px-4"
                onClick={() => {
                  learning.resetLearning()
                  setConfirmLearningReset(false)
                  setStatus("Learning progress reset. Saved prompts were kept.")
                }}
              >
                Reset learning progress
              </Button>
            </div>
          </div>
        ) : (
          <Button type="button" variant="outline" className="mt-4 h-11 rounded-xl px-4" onClick={() => setConfirmLearningReset(true)}>
            Reset learning progress
          </Button>
        )}
      </section>
    </Container>
  )
}

function labelOf<T extends string>(options: Choice<T>[], id: string) {
  return options.find((option) => option.id === id)?.label ?? id
}

function ChoiceGroup<T extends string>({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string
  value: string
  options: Choice<T>[]
  onChange: (value: T) => void
}) {
  return (
    <fieldset>
      <legend className="text-lg font-semibold tracking-tight">{legend}</legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const selected = option.id === value
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.id)}
              className={cn(
                "rounded-2xl border p-4 text-left transition-colors",
                selected ? "border-primary bg-accent" : "border-border bg-elevated hover:border-primary/40",
              )}
            >
              <span className="block font-medium">{option.label}</span>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{option.detail}</span>
              {selected ? <span className="mt-2 block text-sm font-medium text-primary">Selected</span> : null}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
