import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ScrollAnimation } from "@/components/scroll-animation";

const newsArticles = [
  {
    id: "urc-2025-results",
    date: "2025-06-01",
    title: "Team Achieves 14th Position in URC 2025",
    excerpt:
      "MIST Mongol Barota successfully completed the University Rover Challenge 2025, securing 14th position worldwide among top international teams.",
    category: "Achievement",
    image: "/placeholder.svg?height=400&width=600&text=URC+2025",
  },
  {
    id: "arc-2024-runner-up",
    date: "2024-09-15",
    title: "Team Wins ARC 2024 Runner-up Position",
    excerpt:
      "MIST Mongol Barota achieved a remarkable 2nd place finish in the Anatolian Rover Challenge 2024, held in Ankara, Turkey.",
    category: "Achievement",
    image: "/placeholder.svg?height=400&width=600&text=ARC+2024",
  },
  {
    id: "urc-2026-announcement",
    date: "2025-01-10",
    title: "Preparing for URC 2026 with Aurora X-II",
    excerpt:
      "MIST Mongol Barota announces participation in URC 2026 with the next-generation rover Aurora X-II, featuring advanced AI capabilities.",
    category: "Competition",
    image: "/placeholder.svg?height=400&width=600&text=Aurora+X-II",
  },
];

export default function NewsPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <ScrollAnimation>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Latest News & Updates
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Stay updated with our latest achievements, competitions, and team
              announcements
            </p>
          </div>
        </ScrollAnimation>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article, index) => (
            <ScrollAnimation key={article.id} delay={index * 100}>
              <Link href={`/news/${article.id}`} className="group block h-full">
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-primary-foreground">
                        {article.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(article.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-balance group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-pretty line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </div>
  );
}
