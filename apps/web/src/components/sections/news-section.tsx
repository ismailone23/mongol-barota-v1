import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";
import { Calendar, ArrowRight, ExternalLink } from "lucide-react";

const news = [
  {
    id: "urc-2025-results",
    date: "2025-06-01",
    title: "Team Achieves 14th Position in URC 2025",
    excerpt:
      "MIST Mongol Barota secures 14th position worldwide in University Rover Challenge 2025 held in Utah, USA.",
    category: "Achievement",
    isExternal: false,
  },
  {
    id: "arc-2024-runner-up",
    date: "2024-09-15",
    title: "Team Wins ARC 2024 Runner-up Position",
    excerpt:
      "MIST Mongol Barota secures second place in Anatolian Rover Challenge 2024 held in Ankara, Turkey.",
    category: "Achievement",
    isExternal: false,
  },
  {
    id: "urc-2026-announcement",
    date: "2025-01-10",
    title: "Preparing for URC 2026 with Aurora X-II",
    excerpt:
      "Team announces participation in URC 2026 with the new Aurora X-II rover, featuring advanced AI capabilities.",
    category: "Competition",
    isExternal: false,
  },
];

export function NewsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <Badge variant="outline" className="mb-4">
              Latest Updates
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              News & Announcements
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
              Stay updated with our latest achievements, competitions, and team
              developments
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="mt-6 md:mt-0 bg-transparent"
          >
            <Link href="/news">
              View All News
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {item.category}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </div>
                <h3 className="text-lg font-semibold leading-tight">
                  {item.title}
                </h3>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {item.excerpt}
                </p>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto"
                >
                  <Link href={`/news/${item.id}`}>
                    Read More
                    {item.isExternal ? (
                      <ExternalLink className="ml-1 h-3 w-3" />
                    ) : (
                      <ArrowRight className="ml-1 h-3 w-3" />
                    )}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
