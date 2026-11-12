import { Container } from "@/components/common/Container"
import { DesktopNav } from "@/components/navigation/DesktopNav"
import { Logo } from "@/components/navigation/Logo"
import { NotificationsMenu } from "@/components/navigation/NotificationsMenu"
import { ProfileMenu } from "@/components/navigation/ProfileMenu"
import { ThemeMenu } from "@/components/navigation/ThemeMenu"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <DesktopNav />
        </div>
        <div className="flex items-center gap-1">
          <ThemeMenu />
          <NotificationsMenu />
          <ProfileMenu />
        </div>
      </Container>
    </header>
  )
}
