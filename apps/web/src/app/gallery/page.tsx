"use client";

import RenderIcon from "@/components/render-icon";
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
import { Calendar, ExternalLink, MapPin, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function GalleryPage() {
  const trpc = useTRPC();
  const { data: categories = [], isLoading: loadingCategories } = useQuery(
    trpc.gallery.getCategories.queryOptions(),
  );
  const { data: images = [], isLoading: loadingImages } = useQuery(
    trpc.gallery.getAllImages.queryOptions(),
  );
  const { data: videos = [], isLoading: loadingVideos } = useQuery(
    trpc.gallery.getVideos.queryOptions(),
  );

  const isLoading = loadingCategories || loadingImages || loadingVideos;
  const defaultTab = categories[0]?.slug ?? "all";

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-linear-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6">
              Gallery
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Capturing Our
              <span className="text-primary block">Journey to Mars</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Explore our visual journey from competitions around the world to
              behind-the-scenes rover development.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-10 w-full" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <Card key={idx}>
                    <Skeleton className="aspect-video w-full" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : categories.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center text-muted-foreground">
                No gallery categories found.
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-12">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.slug}
                    className="text-sm"
                  >
                    <RenderIcon
                      name={category.icon || "Image"}
                      className="w-4 h-4 mr-2"
                    />
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => {
                const categoryImages = images.filter(
                  (img) => img.categoryId === category.id,
                );
                return (
                  <TabsContent
                    key={category.id}
                    value={category.slug}
                    className="space-y-8"
                  >
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-4">
                        {category.name}
                      </h2>
                      <p className="text-muted-foreground max-w-2xl mx-auto">
                        {category.description}
                      </p>
                    </div>

                    {categoryImages.length === 0 ? (
                      <Card className="border-dashed">
                        <CardContent className="py-12 text-center text-muted-foreground">
                          No images in this category yet.
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryImages.map((image) => (
                          <Card
                            key={image.id}
                            className="overflow-hidden hover:shadow-lg transition-all duration-300 group"
                          >
                            <div className="relative aspect-video">
                              <Image
                                src={image.src}
                                alt={image.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {image.tag && (
                                <div className="absolute top-2 right-2">
                                  <Badge
                                    variant="secondary"
                                    className="bg-background/90 text-xs"
                                  >
                                    {image.tag}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-semibold mb-2 line-clamp-1">
                                {image.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {image.description}
                              </p>
                              <div className="flex items-center justify-between text-xs text-muted-foreground gap-2">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {image.date || "-"}
                                </div>
                                <div className="flex items-center gap-1 line-clamp-1">
                                  <MapPin className="w-3 h-3" />
                                  {image.location || "-"}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Video Gallery
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Watch our journey through competitions, rover development, and
              team achievements
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Card key={idx}>
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : videos.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center text-muted-foreground">
                No videos found.
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card
                  key={video.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={
                        video.thumbnail ||
                        "/placeholder.svg?height=200&width=300&text=Video"
                      }
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      <Button
                        asChild
                        size="lg"
                        className="bg-primary/90 hover:bg-primary text-white rounded-full w-16 h-16 p-0"
                      >
                        <Link
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Play className="w-6 h-6 ml-1" />
                        </Link>
                      </Button>
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-2 right-2">
                        <Badge
                          variant="secondary"
                          className="bg-black/70 text-white text-xs"
                        >
                          {video.duration}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{video.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {video.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        {video.date || "-"}
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Watch
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
