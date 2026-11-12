import { NavLink } from "react-router-dom"
import { primaryNav } from "@/data/navigation"
import { cn } from "@/lib/utils"

export function MobileTabBar() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1">
        {primaryNav.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 text-[11px] leading-none whitespace-nowrap",
                  isActive ? "font-semibold text-primary" : "font-medium text-muted-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="size-5" aria-hidden="true" />
                  <span>{item.shortLabel}</span>
                  <span className={cn("h-0.5 w-4 rounded-full", isActive ? "bg-primary" : "bg-transparent")} aria-hidden="true" />
                  <span className="sr-only">{isActive ? ", current page" : ""}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
