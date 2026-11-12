import { ContinueLearning } from "@/components/home/ContinueLearning"
import { ContinueWhereYouLeftOff } from "@/components/home/ContinueWhereYouLeftOff"
import { Hero } from "@/components/home/Hero"
import { QuickStart } from "@/components/home/QuickStart"
import { RecentWork } from "@/components/home/RecentWork"
import { usePageTitle } from "@/hooks/usePageTitle"

export default function HomePage() {
  usePageTitle("Home")

  return (
    <>
      <Hero />
      <QuickStart />
      <ContinueWhereYouLeftOff />
      <ContinueLearning />
      <RecentWork />
    </>
  )
}
