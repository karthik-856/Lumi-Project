import { useContext } from "react"
import { LibraryContext } from "@/providers/library-context"

export function useLibrary() {
  const value = useContext(LibraryContext)
  if (!value) {
    throw new Error("useLibrary must be used within LibraryProvider")
  }
  return value
}
