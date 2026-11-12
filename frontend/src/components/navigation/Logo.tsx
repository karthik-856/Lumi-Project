import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn("flex items-center gap-2.5 rounded-lg", className)}
      aria-label="Lumi, home"
    >
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 3.2c.45 2.35 1.75 4.05 3.95 4.8-2.2.75-3.5 2.55-3.95 4.95-.45-2.4-1.75-4.2-3.95-4.95 2.2-.75 3.5-2.45 3.95-4.8Z"
          />
          <circle cx="12" cy="18.2" r="1.45" fill="currentColor" />
        </svg>
      </span>
      <span className="text-[1.05rem] font-semibold tracking-tight">Lumi</span>
    </Link>
  )
}
