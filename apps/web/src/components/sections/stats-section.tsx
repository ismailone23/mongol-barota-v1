"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import { Trophy, Users, Zap, Globe } from "lucide-react";
import { ScrollAnimation } from "@/components/scroll-animation";
import { useEffect, useState, useRef } from "react";

const stats = [
  {
    icon: Trophy,
    value: "1st",
    label: "URC 2021 Global Champions",
    description: "First team from Bangladesh to win URC",
  },
  {
    icon: Users,
    value: "40+",
    label: "Active Team Members",
    description: "Multidisciplinary engineering students",
  },
  {
    icon: Zap,
    value: "90.15%",
    label: "Highest SAR Score",
    description: "Best performance among South Asian teams",
  },
  {
    icon: Globe,
    value: "8+",
    label: "International Competitions",
    description: "Representing Bangladesh globally",
  },
];

function useCountUp(end: string, duration = 2000) {
  const [count, setCount] = useState("0");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const numericEnd = Number.parseFloat(end.replace(/[^\d.]/g, ""));
    if (isNaN(numericEnd)) {
      setCount(end);
      return;
    }

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const currentValue = progress * numericEnd;
      const suffix = end.replace(/[\d.]/g, "");
      setCount(Math.floor(currentValue) + suffix);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return { count, setIsVisible };
}

function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const { count, setIsVisible } = useCountUp(stat.value);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.5 },
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [setIsVisible]);

  return (
    <ScrollAnimation delay={index * 100}>
      <Card
        ref={cardRef}
        className="group h-full cursor-pointer rounded-2xl border border-border/70 bg-card/80 text-center shadow-[0_12px_32px_-22px_hsl(var(--foreground)/0.45)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_-20px_hsl(var(--foreground)/0.5)]"
      >
        <CardContent className="p-6 sm:p-7">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
            <stat.icon className="w-6 h-6 text-primary transition-all duration-300 group-hover:scale-110" />
          </div>
          <div className="mb-2 text-3xl font-bold text-primary transition-all duration-300 group-hover:text-accent">
            {count}
          </div>
          <div className="font-semibold mb-2 transition-colors duration-300 group-hover:text-foreground">
            {stat.label}
          </div>
          <div className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-muted-foreground/80">
            {stat.description}
          </div>
        </CardContent>
      </Card>
    </ScrollAnimation>
  );
}

export function StatsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-linear-to-b from-muted/30 via-background to-muted/20">
      <div className="container mx-auto max-w-7xl px-4">
        <ScrollAnimation>
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Leading Mars Rover Innovation
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Our achievements speak to our commitment to excellence in robotics
              and space exploration
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
