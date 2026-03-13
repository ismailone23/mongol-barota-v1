import { Sponsors } from "@workspace/db/schema";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PrevSponsor({
  previousSponsors,
  isLoading,
}: {
  previousSponsors: Sponsors[] | undefined;
  isLoading: boolean;
}) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Support Network
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            We're grateful for the institutional support that has helped us
            achieve international recognition. Now we're seeking industry
            partners to join us for the 2026 season.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <Card key={idx} className="text-center">
                  <CardContent className="p-8 space-y-4">
                    <Skeleton className="h-20 w-40 mx-auto" />
                    <Skeleton className="h-5 w-2/3 mx-auto" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !previousSponsors || previousSponsors.length < 1 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No sponsors found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {previousSponsors.map((sponsor) => (
                <Card
                  key={sponsor.id}
                  className="text-center hover:shadow-lg transition-shadow h-full"
                >
                  <CardContent className="p-8 h-full flex flex-col gap-4">
                    <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-md border bg-muted/20">
                      <Image
                        src={sponsor.logo || "/placeholder.svg"}
                        alt={`${sponsor.name} logo`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 320px"
                        className="object-contain p-2 opacity-70 hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <h3 className="font-semibold min-h-14 leading-snug line-clamp-2">
                      {sponsor.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
                      {sponsor.description}
                    </p>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="mt-auto"
                    >
                      <Link
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Website
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action for New Sponsors */}
        <div className="max-w-3xl mx-auto mt-12">
          <Card className="bg-linear-to-b from-primary/10 to-primary/5 border-2 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Your Logo Could Be Here
              </h3>
              <p className="text-muted-foreground mb-6">
                Join us as a sponsor and gain visibility across international
                competitions, media coverage, and direct access to thousands of
                students and professionals. Be part of Bangladesh's space
                exploration journey.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <Link href="#sponsorship-tiers">
                  Explore Sponsorship Packages
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
