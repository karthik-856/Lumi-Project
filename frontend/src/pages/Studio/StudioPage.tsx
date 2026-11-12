import { useSearchParams } from "react-router-dom"
import { StudioExperience } from "@/components/studio/StudioExperience"
import StudioPreview from "@/pages/Studio/StudioPreview"

export default function StudioPage() {
  const [params] = useSearchParams()
  if (params.get("preview")) return <StudioPreview />
  return <StudioExperience />
}
