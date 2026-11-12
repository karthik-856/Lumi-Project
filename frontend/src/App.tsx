import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"
import { LoadingScreen } from "@/components/common/LoadingScreen"
import { SiteFooter } from "@/components/common/SiteFooter"
import { AppHeader } from "@/components/navigation/AppHeader"
import { MobileTabBar } from "@/components/navigation/MobileTabBar"
import { LocalModeNotice } from "@/components/common/LocalModeNotice"
import { SkipLink } from "@/components/navigation/SkipLink"

const HomePage = lazy(() => import("@/pages/Home/HomePage"))
const CreatePage = lazy(() => import("@/pages/Create/CreatePage"))
const StudioPage = lazy(() => import("@/pages/Studio/StudioPage"))
const AnalyzerPage = lazy(() => import("@/pages/Analyzer/AnalyzerPage"))
const LearnPage = lazy(() => import("@/pages/Learn/LearnPage"))
const LessonsPage = lazy(() => import("@/pages/Learn/LessonsPage"))
const LessonDetailPage = lazy(() => import("@/pages/Learn/LessonDetailPage"))
const ChallengesPage = lazy(() => import("@/pages/Challenges/ChallengesPage"))
const ChallengeDetailPage = lazy(() => import("@/pages/Challenges/ChallengeDetailPage"))
const ExplorePage = lazy(() => import("@/pages/Explore/ExplorePage"))
const TemplatesPage = lazy(() => import("@/pages/Templates/TemplatesPage"))
const TemplateDetailPage = lazy(() => import("@/pages/Explore/TemplateDetailPage"))
const MyWorkPage = lazy(() => import("@/pages/MyWork/MyWorkPage"))
const PromptDetailPage = lazy(() => import("@/pages/MyWork/PromptDetailPage"))
const EvaluatePage = lazy(() => import("@/pages/Evaluate/EvaluatePage"))
const SettingsPage = lazy(() => import("@/pages/Settings/SettingsPage"))
const NotFoundPage = lazy(() => import("@/pages/NotFound/NotFoundPage"))

function PageFrame() {
  const location = useLocation()

  return (
    <div key={location.pathname} className="page-in">
      <ErrorBoundary key={location.pathname}>
        <Suspense fallback={<LoadingScreen />}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/create/studio" element={<StudioPage />} />
            <Route path="/analyze" element={<AnalyzerPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/learn/lessons" element={<LessonsPage />} />
            <Route path="/learn/lessons/:lessonId" element={<LessonDetailPage />} />
            <Route path="/learn/challenges" element={<ChallengesPage />} />
            <Route path="/learn/challenges/:challengeId" element={<ChallengeDetailPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/explore/templates" element={<TemplatesPage />} />
            <Route path="/explore/templates/:templateId" element={<TemplateDetailPage />} />
            <Route path="/my-work" element={<MyWorkPage />} />
            <Route path="/my-work/:promptId" element={<PromptDetailPage />} />
            <Route path="/evaluate" element={<EvaluatePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

function AppShell() {
  return (
    <div className="flex min-h-svh flex-col">
      <SkipLink />
      <AppHeader />
      <LocalModeNotice />
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col pb-24 outline-none lg:pb-0">
        <div className="flex-1">
          <PageFrame />
        </div>
        <SiteFooter />
      </main>
      <MobileTabBar />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
