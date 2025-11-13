"use client";
import { HeroSection } from "@/components/sections/hero-section";
import { StatsSection } from "@/components/sections/stats-section";
import { AchievementsPreview } from "@/components/sections/achievements-preview";
import { NewsSection } from "@/components/sections/news-section";
import { SponsorsSection } from "@/components/sections/sponsors-section";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.hello.queryOptions());
  console.log({ data });

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <StatsSection />
      <AchievementsPreview />
      {/* <NewsSection /> */}
      <SponsorsSection />
    </div>
  );
}
