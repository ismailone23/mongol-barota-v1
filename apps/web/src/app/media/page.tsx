"use client";

import { ScrollAnimation } from "@/components/scroll-animation";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Calendar, ExternalLink, Globe, Newspaper, Tv } from "lucide-react";
import { useMemo, useState } from "react";

type MediaType = "all" | "tv" | "print" | "online";

export default function MediaPage() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.media.getActive.queryOptions());
  const [selectedYear, setSelectedYear] = useState("all");

  const years = useMemo(() => {
    if (!data) return ["all"];
    return ["all", ...Array.from(new Set(data.map((item) => item.year)))];
  }, [data]);

  const filteredMedia = useMemo(() => {
    if (!data) return [];
    return selectedYear === "all"
      ? data
      : data.filter((item) => item.year === selectedYear);
  }, [data, selectedYear]);

  return (
    <div className="min-h-screen">
      <section className="relative py-20 bg-linear-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="fade-up">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Media Coverage & Press
              </h1>
              <p className="text-xl text-muted-foreground">
                Showcasing our journey through national and international media
                recognition
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <TabsList className="grid grid-cols-4 w-full md:w-auto">
                <TabsTrigger value="all" className="gap-2">
                  <Globe className="h-4 w-4" />
                  All
                </TabsTrigger>
                <TabsTrigger value="tv" className="gap-2">
                  <Tv className="h-4 w-4" />
                  TV
                </TabsTrigger>
                <TabsTrigger value="print" className="gap-2">
                  <Newspaper className="h-4 w-4" />
                  Print
                </TabsTrigger>
                <TabsTrigger value="online" className="gap-2">
                  <Globe className="h-4 w-4" />
                  Online
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
                {years.map((year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedYear(year)}
                    className="whitespace-nowrap"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {year === "all" ? "All Years" : year}
                  </Button>
                ))}
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              <MediaGrid items={filteredMedia} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="tv" className="mt-0">
              <MediaGrid
                items={filteredMedia.filter((item) => item.type === "tv")}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="print" className="mt-0">
              <MediaGrid
                items={filteredMedia.filter((item) => item.type === "print")}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="online" className="mt-0">
              <MediaGrid
                items={filteredMedia.filter((item) => item.type === "online")}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

function MediaGrid({
  items,
  isLoading,
}: {
  items: Array<{
    id: string;
    year: string;
    type: string;
    title: string;
    outlet: string;
    date: string;
    description: string | null;
    image: string | null;
    images: string[];
    link: string | null;
  }>;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Card key={idx} className="overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No media coverage found for the selected filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => {
        const images = item.images?.length
          ? item.images
          : item.image
            ? [item.image]
            : ["/placeholder.svg?height=400&width=600&text=Media"];
        return (
          <ScrollAnimation
            key={item.id}
            animation="fade-up"
            delay={index * 0.1}
          >
            <div className="group bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs font-medium">
                    {item.year}
                  </span>
                  <span className="px-3 py-1 bg-primary/90 text-primary-foreground backdrop-blur-sm rounded-full text-xs font-medium flex items-center gap-1">
                    {item.type === "tv" && <Tv className="h-3 w-3" />}
                    {item.type === "print" && <Newspaper className="h-3 w-3" />}
                    {item.type === "online" && <Globe className="h-3 w-3" />}
                    {item.type.toUpperCase()}
                  </span>
                </div>
                {images.length > 1 && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">+{images.length - 1}</Badge>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="text-sm text-muted-foreground mb-2">
                  {item.outlet}
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {item.date}
                  </span>
                  {item.link ? (
                    <Button asChild variant="ghost" size="sm" className="gap-2">
                      <a href={item.link} target="_blank" rel="noreferrer">
                        Read More
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      disabled
                    >
                      Read More
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </ScrollAnimation>
        );
      })}
    </div>
  );
}
