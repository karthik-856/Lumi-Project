import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function StudioNav({
  canLeave,
  onBack,
  primaryLabel,
}: {
  canLeave: boolean
  onBack: () => void
  primaryLabel: string
}) {
  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:justify-between">
      {canLeave ? (
        <Button asChild variant="outline" className="h-11 rounded-xl px-4">
          <Link to="/create">Back</Link>
        </Button>
      ) : (
        <Button type="button" variant="outline" className="h-11 rounded-xl px-4" onClick={onBack}>
          Back
        </Button>
      )}
      <Button type="submit" className="h-11 rounded-xl px-4 sm:ml-auto">
        {primaryLabel}
      </Button>
    </div>
  )
}
