import { HeroSection } from "@/components/sections/hero-section"
import { StatsSection } from "@/components/sections/stats-section"
import { AchievementsPreview } from "@/components/sections/achievements-preview"
import { NewsSection } from "@/components/sections/news-section"
import { SponsorsSection } from "@/components/sections/sponsors-section"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <StatsSection />
      <AchievementsPreview />
      {/* <NewsSection /> */}
      <SponsorsSection />
    </div>
  )
}
