"use client";

import { ScrollAnimation } from "@/components/scroll-animation";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Calendar, ExternalLink, FileText, Users } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function ResearchPapersPage() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.research.getActive.queryOptions());
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    if (!data) return ["All"];
    return ["All", ...Array.from(new Set(data.map((paper) => paper.category)))];
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return selectedCategory === "All"
      ? data
      : data.filter((paper) => paper.category === selectedCategory);
  }, [data, selectedCategory]);

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-linear-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollAnimation>
              <Badge variant="outline" className="mb-6">
                Research & Publications
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                Research <span className="text-primary block">Papers</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 text-pretty">
                Explore our published research contributions to Mars exploration
                technology, rover development, and autonomous systems.
              </p>

              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground mb-8">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  {data?.length ?? 0} Publications
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Research Team
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      <section id="papers" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-12">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={
                    category === selectedCategory ? "default" : "outline"
                  }
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>

            {isLoading ? (
              <div className="space-y-8">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-8 space-y-4">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center text-muted-foreground">
                  No research papers found.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {filtered.map((paper, index) => (
                  <ScrollAnimation key={paper.id} delay={index * 100}>
                    <Card className="hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="text-xs">
                              {paper.category}
                            </Badge>
                            {paper.isOpenAccess && (
                              <Badge
                                variant="outline"
                                className="text-xs text-green-600 border-green-600"
                              >
                                Open Access
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3 mr-1" />
                            {paper.year}
                          </div>
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors">
                          {paper.title}
                        </h2>

                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                          <span className="font-medium">Authors:</span>
                          {paper.authors.join(", ")}
                        </div>

                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-foreground">
                              Published in:
                            </span>
                            <span className="ml-2 text-muted-foreground">
                              {paper.venue || paper.journal}
                            </span>
                          </div>
                          {paper.doi && (
                            <div>
                              <span className="font-medium text-foreground">
                                DOI:
                              </span>
                              <span className="ml-2 text-muted-foreground font-mono text-xs">
                                {paper.doi}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="mb-6">
                          <h4 className="font-semibold mb-2">Abstract</h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {paper.abstract}
                          </p>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-semibold mb-2">Keywords</h4>
                          <div className="flex flex-wrap gap-2">
                            {paper.keywords.map((keyword, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs"
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button asChild className="w-full sm:w-auto">
                          <Link
                            href={paper.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Paper
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </ScrollAnimation>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
