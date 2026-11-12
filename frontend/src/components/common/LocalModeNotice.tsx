import { useBackend } from "@/hooks/useBackend"

export function LocalModeNotice() {
  const { mode } = useBackend()
  if (mode !== "local") return null

  return (
    <p role="status" className="border-b border-border bg-surface px-4 py-2 text-center text-sm text-muted-foreground">
      Lumi is currently running in local mode. Prompts and progress stay in this browser.
    </p>
  )
}
