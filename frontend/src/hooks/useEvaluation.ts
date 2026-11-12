import { useCallback, useEffect, useRef, useState } from "react"
import { useBackend } from "@/hooks/useBackend"
import { createEvaluationSession } from "@/lib/evaluation"
import type { EvaluationSession } from "@/types/evaluation"
import { deleteEvaluation, fetchEvaluation, readLocalEvaluation, reconcileEvaluation, saveEvaluation, writeLocalEvaluation } from "@/services/evaluation"
import { ApiError } from "@/services/api"

export function useEvaluation() {
  const backend = useBackend()
  const [session, setSession] = useState<EvaluationSession>(() => readLocalEvaluation() ?? createEvaluationSession())
  const [synced, setSynced] = useState(false)
  const ready = backend.mode === "local" || synced
  const sessionRef = useRef(session)

  useEffect(() => {
    sessionRef.current = session
  }, [session])

  useEffect(() => {
    writeLocalEvaluation(session)
  }, [session])

  useEffect(() => {
    if (backend.mode !== "api") return
    let active = true
    const local = readLocalEvaluation() ?? sessionRef.current
    fetchEvaluation()
      .then((remote) => {
        if (!active) return
        const chosen = reconcileEvaluation(local, remote)
        setSession((current) => (current.updatedAt === chosen.updatedAt && current.id === chosen.id ? current : chosen))
        if (!remote || remote.updatedAt !== chosen.updatedAt || remote.id !== chosen.id) {
          void saveEvaluation(chosen).catch((error: unknown) => {
            if (error instanceof ApiError && error.status === 0) backend.markLocal()
          })
        }
        setSynced(true)
      })
      .catch((error: unknown) => {
        if (!active) return
        if (error instanceof ApiError && error.status === 0) backend.markLocal()
        setSynced(true)
      })
    return () => {
      active = false
    }
  }, [backend])

  useEffect(() => {
    if (!ready || backend.mode !== "api") return
    const handle = window.setTimeout(() => {
      void saveEvaluation(session).catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 0) backend.markLocal()
      })
    }, 350)
    return () => window.clearTimeout(handle)
  }, [session, ready, backend])

  const update = useCallback((next: EvaluationSession) => {
    setSession(next)
  }, [])

  const change = useCallback((recipe: (current: EvaluationSession) => EvaluationSession) => {
    setSession((current) => recipe(current))
  }, [])

  const reset = useCallback(() => {
    const fresh = createEvaluationSession()
    setSession(fresh)
    writeLocalEvaluation(fresh)
    if (backend.mode === "api") {
      void deleteEvaluation()
        .then(() => saveEvaluation(fresh))
        .catch((error: unknown) => {
          if (error instanceof ApiError && error.status === 0) backend.markLocal()
        })
    }
  }, [backend])

  return { session, ready, update, change, reset }
}
