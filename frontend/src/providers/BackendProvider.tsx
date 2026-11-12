import { useEffect, useMemo, useState, type ReactNode } from "react"
import { api } from "@/services/api"
import { BackendContext, type BackendMode } from "@/providers/backend-context"

export function BackendProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<BackendMode>("checking")

  useEffect(() => {
    let active = true
    api
      .getUser()
      .then(() => {
        if (active) setMode("api")
      })
      .catch(() => {
        if (active) setMode("local")
      })
    return () => {
      active = false
    }
  }, [])

  const value = useMemo(
    () => ({
      mode,
      markApi: () => setMode("api"),
      markLocal: () => setMode("local"),
    }),
    [mode],
  )

  return <BackendContext.Provider value={value}>{children}</BackendContext.Provider>
}
