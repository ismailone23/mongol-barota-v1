import { Sponsors } from "@workspace/db/schema";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { LoadingSpinner } from "@workspace/ui/components/loading-spinner";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function PrevSponser({
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

        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <LoadingSpinner />
          ) : !previousSponsors || previousSponsors.length < 1 ? (
            <div>
              <p>No data</p>
            </div>
          ) : (
            previousSponsors.map((sponsor, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow mb-8"
              >
                <CardContent className="p-8">
                  <div className="relative h-20 mb-6 flex items-center justify-center">
                    <Image
                      src={sponsor.logo || "/placeholder.svg"}
                      alt={`${sponsor.name} logo`}
                      width={160}
                      height={80}
                      className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <Badge variant="secondary" className="mb-3">
                    {/* {sponsor.tier} */}
                  </Badge>
                  <h3 className="font-semibold mb-3">{sponsor.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {sponsor.desctiption}
                  </p>
                  <Button asChild variant="ghost" size="sm">
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
            ))
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
