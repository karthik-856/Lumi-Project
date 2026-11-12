import { NavLink } from "react-router-dom"
import { primaryNav } from "@/data/navigation"
import { cn } from "@/lib/utils"

export function DesktopNav() {
  return (
    <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
      {primaryNav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors",
              isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted hover:text-foreground",
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
