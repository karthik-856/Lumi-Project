import { useState } from "react"

export function WhyExplanation({ text, label = "Why did Lumi add this?" }: { text: string; label?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-2">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="text-sm font-medium text-primary"
      >
        {label}
      </button>
      {open ? <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p> : null}
    </div>
  )
}
