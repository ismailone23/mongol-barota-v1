"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Target, Trophy, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const trpc = useTRPC();
  const { data: sponsors } = useQuery(trpc.team.getSponsors.queryOptions());

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-background via-background to-muted/20 py-8 sm:py-12 lg:py-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-size-[60px_60px]" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        <div className="sm:grid items-center gap-8 lg:gap-12 xl:grid-cols-2">
          {/* Content */}
          <div
            className={`space-y-7 text-center lg:text-left transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="space-y-4 sm:space-y-5">
              <Badge
                variant="secondary"
                className={`mx-auto rounded-full border border-primary/20 bg-primary px-4 py-1.5 text-primary-foreground transition-all duration-700 delay-200 lg:mx-0 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <Trophy className="w-4 h-4 mr-2" />
                URC 2021 Global Champions
              </Badge>

              <h1
                className={`mx-auto max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:mx-0 lg:max-w-none lg:text-6xl xl:text-[4.2rem] transition-all duration-700 delay-300 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                Pioneering
                <span className="block animate-gradient bg-linear-to-r from-primary via-accent to-primary bg-size-[200%_100%] bg-clip-text text-transparent">
                  Mars Exploration
                </span>
                from Bangladesh
              </h1>

              <p
                className={`mx-auto max-w-xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg transition-all duration-700 delay-500 lg:mx-0 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                MIST Mongol Barota is Bangladesh's premier Mars rover team,
                pushing the boundaries of space exploration through innovative
                engineering and unwavering determination.
              </p>
            </div>

            {/* Key Achievements */}
            <div
              className={`flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 lg:justify-start transition-all duration-700 delay-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {[
                "URC 2021 Champions",
                "ARC 2024 Runners-up",
                "Highest Scoring South Asian Team",
              ].map((achievement, index) => (
                <div
                  key={achievement}
                  className={`flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-3 py-1.5 text-xs font-medium text-foreground/90 sm:text-sm transition-all duration-500 hover:-translate-y-0.5 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: `${800 + index * 100}ms` }}
                >
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  {achievement}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-3 justify-center lg:justify-start transition-all duration-700 delay-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <Button
                asChild
                size="lg"
                className="w-full rounded-full bg-primary px-6 hover:bg-primary/90 transition-all duration-300 hover:shadow-md group sm:w-auto"
              >
                <Link href="/rovers">
                  Explore Our Rovers
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full rounded-full px-6 transition-all duration-300 hover:bg-accent/50 group bg-transparent sm:w-auto"
              >
                <Link href="/join">
                  <Users className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  Join Our Team
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div
              className={`grid grid-cols-3 gap-3 border-t border-border/70 pt-6 transition-all duration-700 delay-1200 sm:gap-5 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {[
                { value: "12+", label: "Years Experience" },
                { value: "40+", label: "Team Members" },
                { value: "8+", label: "Competitions" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className={`text-center lg:text-left group cursor-pointer transition-all duration-500 hover:scale-105 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${1300 + index * 100}ms` }}
                >
                  <div className="text-xl sm:text-2xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-[11px] sm:text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {sponsors && sponsors.length > 0 && (
              <div
                className={`space-y-4 pt-7 transition-all duration-700 delay-[1450ms] ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="text-sm font-medium text-muted-foreground text-center lg:text-left">
                  Trusted by our sponsors
                </div>
                <div className="overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 pr-4">
                    {sponsors.map((sponsor) => (
                      <Link
                        key={sponsor.id}
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-16 w-28 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-card/80 px-3 py-2 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                      >
                        <div className="relative h-10 w-full">
                          <Image
                            src={sponsor.logo || "/placeholder.svg"}
                            alt={`${sponsor.name} logo`}
                            fill
                            sizes="112px"
                            className="object-contain"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hero Image */}
          <div
            className={`relative w-full transition-all duration-700 delay-400 ${
              isVisible
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-0 translate-x-8 scale-95"
            }`}
          >
            <div className="relative mx-auto aspect-5/4 w-full max-w-xl overflow-hidden rounded-3xl border border-border/70 shadow-[0_16px_50px_-24px_hsl(var(--foreground)/0.35)] sm:aspect-4/3 xl:aspect-square">
              {/* Rover Image Placeholder */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-accent/20 animate-pulse-slow" />
              <Image
                src="/rover_1.webp"
                alt="Aurora X Mars Rover"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />

              {/* Floating Elements */}
              <div
                className={`hidden xl:block absolute top-4 right-4 bg-card border rounded-lg p-3 shadow-lg animate-float transition-all duration-700 delay-1500 hover:scale-105 cursor-pointer ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4"
                }`}
              >
                <Target className="w-6 h-6 text-primary" />
                <div className="text-xs font-medium mt-1">
                  Precision Navigation
                </div>
              </div>

              <div
                className={`hidden sm:block absolute bottom-4 left-4 bg-card border rounded-lg p-3 shadow-lg animate-float transition-all duration-700 delay-1700 hover:scale-105 cursor-pointer ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ animationDelay: "1s" }}
              >
                <Trophy className="w-6 h-6 text-primary" />
                <div className="text-xs font-medium mt-1">Award Winning</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
