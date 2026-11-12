import { useContext } from "react"
import { BackendContext } from "@/providers/backend-context"

export function useBackend() {
  const value = useContext(BackendContext)
  if (!value) throw new Error("useBackend must be used within BackendProvider")
  return value
}
