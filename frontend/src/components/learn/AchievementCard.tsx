import { Check } from "lucide-react"
import type { Achievement } from "@/lib/learning-progress"
import { cn } from "@/lib/utils"

export function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <article className={cn("rounded-2xl border border-border p-4", achievement.earned ? "bg-surface" : "bg-elevated")}>
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-border"
          aria-hidden="true"
        >
          {achievement.earned ? <Check className="size-3.5" /> : null}
        </span>
        <div>
          <h3 className="text-sm font-semibold">{achievement.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{achievement.detail}</p>
          <p className="mt-2 text-sm">{achievement.earned ? "Earned" : "Not yet"}</p>
        </div>
      </div>
    </article>
  )
}
