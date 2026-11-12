import { Link } from "react-router-dom"
import { PromptAnalyzer } from "@/components/analyzer/PromptAnalyzer"
import { Container } from "@/components/common/Container"
import { Button } from "@/components/ui/button"
import { usePageTitle } from "@/hooks/usePageTitle"

export default function AnalyzerPage() {
  usePageTitle("Analyze")

  return (
    <Container className="py-8 md:py-10">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Analyze</p>
        <h1 className="type-h2 mt-2 text-balance">Understand your prompt. Improve it.</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Paste a prompt you've already written and Lumi will show what's working, what could be clearer, and how to improve it.
        </p>
        <div className="mt-5">
          <Button asChild variant="outline" className="h-11 rounded-xl px-4">
            <Link to="/create/studio">I would rather start from an idea</Link>
          </Button>
        </div>
      </header>
      <div className="mt-8">
        <PromptAnalyzer />
      </div>
    </Container>
  )
}
