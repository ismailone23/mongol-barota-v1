"use client";

import { ScrollAnimation } from "@/components/scroll-animation";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NewsPage() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.news.getPublished.queryOptions());

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
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

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Card key={idx} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center text-muted-foreground">
              No news articles published yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((article, index) => {
              const images = article.images?.length
                ? article.images
                : article.image
                  ? [article.image]
                  : ["/placeholder.svg?height=400&width=600&text=News"];
              const coverImage =
                images[0] ?? "/placeholder.svg?height=400&width=600&text=News";
              return (
                <ScrollAnimation key={article.id} delay={index * 80}>
                  <Link
                    href={`/news/${article.slug}`}
                    className="group block h-full"
                  >
                    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={coverImage}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <Badge className="bg-primary text-primary-foreground">
                            {article.category}
                          </Badge>
                          {images.length > 1 && (
                            <Badge variant="secondary">
                              +{images.length - 1}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(article.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-balance group-hover:text-primary transition-colors line-clamp-2">
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
