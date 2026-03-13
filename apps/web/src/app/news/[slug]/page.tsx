"use client";

import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function NewsArticlePage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const trpc = useTRPC();

  const { data: article, isLoading } = useQuery(
    trpc.news.getBySlug.queryOptions({ slug }),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-5xl space-y-6">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <h2 className="text-2xl font-semibold mb-2">Article not found</h2>
              <p className="text-muted-foreground mb-6">
                This news article does not exist or is no longer available.
              </p>
              <Button asChild>
                <Link href="/news">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to News
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const images = article.images?.length
    ? article.images
    : article.image
      ? [article.image]
      : ["/placeholder.svg?height=600&width=1200&text=News"];
  const heroImage =
    images[0] ?? "/placeholder.svg?height=600&width=1200&text=News";

  return (
    <div className="min-h-screen">
      <div className="relative h-[420px] w-full overflow-hidden">
        <Image
          src={heroImage}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-background/20" />

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-4xl">
              <Badge className="mb-4 bg-primary text-primary-foreground">
                {article.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance text-white drop-shadow-lg">
                {article.title}
              </h1>
              <div className="flex items-center gap-3 text-white/90 text-sm">
                <Calendar className="w-4 h-4" />
                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {images.length > 1 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((img, idx) => (
                <div
                  key={`${img}-${idx}`}
                  className="relative h-48 rounded-lg overflow-hidden border"
                >
                  <Image
                    src={img}
                    alt={`${article.title} image ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 md:p-12">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {article.excerpt}
              </p>

              {article.body && (
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                    {article.body}
                  </p>
                </div>
              )}

              <Separator className="my-10" />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/news">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to News
                  </Link>
                </Button>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
