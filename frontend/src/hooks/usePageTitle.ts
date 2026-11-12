import { useEffect } from "react"

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title =
      title === "Home" ? "Lumi — Make AI easier to understand." : `${title} — Lumi`
  }, [title])
}
