import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

export function ConfirmDelete({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const cancelAction = useRef(onCancel)

  useEffect(() => {
    cancelAction.current = onCancel
  }, [onCancel])

  useEffect(() => {
    const previously = document.activeElement instanceof HTMLElement ? document.activeElement : null
    cancelRef.current?.focus()
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        cancelAction.current()
        return
      }
      if (event.key !== "Tab") return
      const root = dialogRef.current
      if (!root) return
      const items = [...root.querySelectorAll<HTMLElement>("button, [href], input, select, textarea")]
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      previously?.focus()
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 sm:items-center">
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-prompt-title"
        aria-describedby="delete-prompt-description"
        className="w-full max-w-md rounded-2xl border border-border bg-elevated p-6 shadow-lift"
      >
        <h2 id="delete-prompt-title" className="text-lg font-semibold tracking-tight">
          Delete this prompt?
        </h2>
        <p id="delete-prompt-description" className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Your saved prompt will be removed from My Work.
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button ref={cancelRef} type="button" variant="outline" className="h-11 rounded-xl px-4" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" className="h-11 rounded-xl px-4" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
