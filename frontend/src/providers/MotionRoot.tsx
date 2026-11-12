import type { ReactNode } from "react"
import { MotionConfig } from "framer-motion"
import { usePreferences } from "@/hooks/usePreferences"

export function MotionRoot({ children }: { children: ReactNode }) {
  const { motion } = usePreferences()
  const reducedMotion = motion === "reduce" ? "always" : motion === "full" ? "never" : "user"

  return <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>
}
