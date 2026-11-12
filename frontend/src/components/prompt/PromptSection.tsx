import { cn } from "@/lib/utils"

export function PromptSection({
  label,
  children,
  muted = false,
}: {
  label: string
  children: string
  muted?: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-xl px-3 py-2.5",
        muted ? "border border-dashed border-border" : "border border-border/80 bg-surface",
      )}
    >
      <p className="text-[13px] font-medium text-primary">{label}</p>
      <p className={cn("mt-1 text-sm leading-relaxed", muted ? "text-muted-foreground" : "text-foreground")}>
        {children}
      </p>
    </div>
  )
}
