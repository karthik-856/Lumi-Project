import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

type Props = { children: ReactNode }
type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error.message, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div role="alert" className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="type-h3">Something went wrong while loading this page.</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Please try again. If it keeps happening, refresh Lumi.
        </p>
        <Button className="mt-6 h-11 px-4" type="button" onClick={() => this.setState({ hasError: false })}>
          Try again
        </Button>
      </div>
    )
  }
}
