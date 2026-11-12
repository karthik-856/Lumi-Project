import { Link } from "react-router-dom"
import { Container } from "@/components/common/Container"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <Container className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Lumi · Make AI easier to understand.</p>
        <nav aria-label="Footer" className="flex gap-4 text-sm font-medium">
          <Link to="/learn" className="rounded-md text-muted-foreground hover:text-foreground">
            Learn
          </Link>
          <Link to="/explore/templates" className="rounded-md text-muted-foreground hover:text-foreground">
            Templates
          </Link>
          <Link to="/settings" className="rounded-md text-muted-foreground hover:text-foreground">
            Settings
          </Link>
        </nav>
      </Container>
    </footer>
  )
}
