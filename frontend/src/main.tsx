import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"
import { BackendProvider } from "@/providers/BackendProvider"
import { LearningProvider } from "@/providers/LearningProvider"
import { LibraryProvider } from "@/providers/LibraryProvider"
import { MotionRoot } from "@/providers/MotionRoot"
import { PreferencesProvider } from "@/providers/PreferencesProvider"
import App from "@/App"
import "@/index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PreferencesProvider>
      <MotionRoot>
        <TooltipProvider delayDuration={350}>
          <BackendProvider>
            <LibraryProvider>
            <LearningProvider>
              <ErrorBoundary>
                <App />
              </ErrorBoundary>
            </LearningProvider>
            <Toaster position="top-center" closeButton />
          </LibraryProvider>
          </BackendProvider>
        </TooltipProvider>
      </MotionRoot>
    </PreferencesProvider>
  </StrictMode>,
)
