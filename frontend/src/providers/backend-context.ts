import { createContext } from "react"

export type BackendMode = "checking" | "api" | "local"

export type BackendContextValue = {
  mode: BackendMode
  markApi: () => void
  markLocal: () => void
}

export const BackendContext = createContext<BackendContextValue | null>(null)
