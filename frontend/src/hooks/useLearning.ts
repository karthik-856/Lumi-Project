import { useContext } from "react"
import { LearningContext } from "@/providers/learning-context"

export function useLearning() {
  const value = useContext(LearningContext)
  if (!value) throw new Error("useLearning must be used within LearningProvider")
  return value
}
