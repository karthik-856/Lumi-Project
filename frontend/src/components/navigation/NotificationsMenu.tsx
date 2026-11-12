import { Bell } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useLearning } from "@/hooks/useLearning"
import { nextLesson } from "@/lib/learning-progress"

export function NotificationsMenu() {
  const [seen, setSeen] = useState(false)
  const learning = useLearning()
  const next = nextLesson(learning.state)
  const notices = [
    next
      ? {
          title: `Next lesson: ${next.title}`,
          body: next.description,
          to: `/learn/lessons/${next.id}`,
        }
      : {
          title: "Practice a challenge",
          body: "The lesson path is complete. Challenges are there when you want more practice.",
          to: "/learn/challenges",
        },
    {
      title: "Sample prompts are ready",
      body: "Open one to see how a guided prompt is structured.",
      to: "/my-work",
    },
  ]

  return (
    <DropdownMenu onOpenChange={(open) => open && setSeen(true)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative size-10 rounded-xl"
              aria-label={seen ? "Notifications" : "Notifications, new items"}
            >
              <Bell aria-hidden="true" />
              {seen ? null : (
                <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" aria-hidden="true" />
              )}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Notifications</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notices.map((notice) => (
          <DropdownMenuItem key={notice.title} asChild className="items-start py-2">
            <Link to={notice.to}>
              <span className="flex flex-col gap-0.5">
                <span className="font-medium">{notice.title}</span>
                <span className="text-xs leading-relaxed text-muted-foreground">{notice.body}</span>
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
