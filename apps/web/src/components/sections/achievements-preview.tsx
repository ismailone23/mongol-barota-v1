import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";
import { Trophy, Medal, Award, ArrowRight } from "lucide-react";
import { ScrollAnimation } from "@/components/scroll-animation";

const achievements = [
  {
    year: "2021",
    title: "URC Global Champions",
    description: "First place in University Rover Challenge with Phoenix rover",
    icon: Trophy,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    year: "2024",
    title: "ARC Runners-up",
    description: "Second place in Anatolian Rover Challenge with Aurora X",
    icon: Medal,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
  {
    year: "2024",
    title: "Highest SAR Score",
    description: "90.15% - Best performance among South Asian teams in URC",
    icon: Award,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

export function AchievementsPreview() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Our Journey
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              A Legacy of Excellence
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              From our first participation in 2014 to becoming global champions,
              our journey represents Bangladesh's growing presence in space
              exploration
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {achievements.map((achievement, index) => (
            <ScrollAnimation key={index} delay={index * 150}>
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 group cursor-pointer hover-lift">
                <CardContent className="p-6">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 ${achievement.bgColor} rounded-lg mb-4 transition-all duration-300 group-hover:scale-110`}
                  >
                    <achievement.icon
                      className={`w-6 h-6 ${achievement.color} transition-all duration-300 group-hover:scale-110`}
                    />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground mb-2 transition-colors duration-300 group-hover:text-primary">
                    {achievement.year}
                  </div>
                  <h3 className="text-xl font-bold mb-3 transition-colors duration-300 group-hover:text-primary">
                    {achievement.title}
                  </h3>
                  <p className="text-muted-foreground text-sm transition-colors duration-300 group-hover:text-foreground">
                    {achievement.description}
                  </p>
                </CardContent>
              </Card>
            </ScrollAnimation>
          ))}
        </div>

        <ScrollAnimation delay={500}>
          <div className="text-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="transition-all duration-300 hover:scale-105 hover:bg-primary hover:text-primary-foreground group bg-transparent"
            >
              <Link href="/achievements">
                View All Achievements
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
