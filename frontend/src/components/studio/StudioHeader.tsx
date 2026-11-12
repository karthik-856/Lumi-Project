import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { StudioProgress } from "@/components/studio/StudioProgress"
import { Button } from "@/components/ui/button"

export function StudioHeader({
  step,
  total,
  ready,
  canLeave,
  onBack,
}: {
  step: number
  total: number
  ready: boolean
  canLeave: boolean
  onBack: () => void
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        {canLeave ? (
          <Button asChild variant="outline" className="h-11 rounded-xl px-3">
            <Link to="/create">
              <ArrowLeft aria-hidden="true" />
              Back
            </Link>
          </Button>
        ) : (
          <Button type="button" variant="outline" className="h-11 rounded-xl px-3" onClick={onBack}>
            <ArrowLeft aria-hidden="true" />
            Back
          </Button>
        )}
        <div className="min-w-0">
          <p className="text-lg font-semibold tracking-tight">Lumi Studio</p>
          <p className="text-sm text-muted-foreground">Turn your idea into a prompt you understand.</p>
        </div>
      </div>
      <StudioProgress step={step} total={total} ready={ready} />
    </div>
  )
}
