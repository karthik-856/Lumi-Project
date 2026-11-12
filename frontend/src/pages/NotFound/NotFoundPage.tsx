import { Link } from "react-router-dom"
import { Container } from "@/components/common/Container"
import { Button } from "@/components/ui/button"
import { usePageTitle } from "@/hooks/usePageTitle"

export default function NotFoundPage() {
  usePageTitle("Page not found")

  return (
    <Container className="py-20">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="type-h2 mt-2">That page is not part of Lumi.</h1>
      <p className="mt-3 max-w-md text-muted-foreground">The address may be mistyped. You can go home, or start from an idea.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="h-11 rounded-xl px-4">
          <Link to="/">Go home</Link>
        </Button>
        <Button asChild variant="outline" className="h-11 rounded-xl px-4">
          <Link to="/create/studio">Start creating</Link>
        </Button>
      </div>
    </Container>
  )
}
