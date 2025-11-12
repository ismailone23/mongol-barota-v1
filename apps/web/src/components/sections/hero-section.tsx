"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { ArrowRight, Target, Trophy, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:60px_60px]" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div
            className={`space-y-8 text-center lg:text-left transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="space-y-4">
              <Badge
                variant="secondary"
                className={`bg-primary text-primary-foreground border-primary/20 transition-all duration-700 delay-200 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <Trophy className="w-4 h-4 mr-2" />
                URC 2021 Global Champions
              </Badge>

              <h1
                className={`text-4xl md:text-6xl lg:text-7xl font-bold text-balance transition-all duration-1000 delay-300 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                Pioneering
                <span className="block animate-gradient bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] bg-clip-text text-transparent">
                  Mars Exploration
                </span>
                from Bangladesh
              </h1>

              <p
                className={`text-xl text-muted-foreground max-w-2xl text-pretty transition-all duration-1000 delay-500 ${
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
              className={`flex flex-wrap gap-4 justify-center lg:justify-start transition-all duration-1000 delay-700 ${
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
                  className={`flex items-center gap-2 text-sm font-medium transition-all duration-500 hover:scale-105 ${
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
              className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-1000 delay-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
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
                className="transition-all duration-300 hover:scale-105 hover:bg-accent/50 group bg-transparent"
              >
                <Link href="/join">
                  <Users className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  Join Our Team
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div
              className={`grid grid-cols-3 gap-8 pt-8 border-t transition-all duration-1000 delay-1200 ${
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
                  className={`text-center lg:text-left group cursor-pointer transition-all duration-500 hover:scale-110 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${1300 + index * 100}ms` }}
                >
                  <div className="text-2xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div
            className={`relative w-full transition-all duration-1200 delay-400 ${
              isVisible
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-0 translate-x-8 scale-95"
            }`}
          >
            <div className="relative aspect-square max-w-lg">
              {/* Rover Image Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl animate-pulse-slow" />
              <Image
                src="/rover_1.webp"
                alt="Aurora X Mars Rover"
                fill
                className="object-cover rounded-2xl transition-transform duration-700 hover:scale-105"
                priority
              />

              {/* Floating Elements */}
              <div
                className={`absolute -top-4 -right-4 bg-card border rounded-lg p-3 shadow-lg animate-float transition-all duration-1000 delay-1500 hover:scale-110 cursor-pointer ${
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
                className={`absolute -bottom-4 -left-4 bg-card border rounded-lg p-3 shadow-lg animate-float transition-all duration-1000 delay-1700 hover:scale-110 cursor-pointer ${
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
