import { competitionIcons } from "@/constants";
import { PlansSelect } from "@workspace/db/schema";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Check } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { renderIcon } from "./render-icon";

export default function SponsorTiers({
  isLoading,
  sponsorshipTiers,
}: {
  sponsorshipTiers: PlansSelect[] | undefined;
  isLoading: boolean;
}) {
  const [isPopular, setIsPopular] = useState(0);
  if (isLoading) {
    return (
      <div className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Card key={idx}>
                <CardHeader className="space-y-3">
                  <Skeleton className="h-12 w-12 rounded-lg mx-auto" />
                  <Skeleton className="h-6 w-2/3 mx-auto" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-10 w-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="sponsorship-tiers" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sponsorship Packages for 2026
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Choose the partnership level that aligns with your organization's
            goals and budget
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {!sponsorshipTiers || sponsorshipTiers.length < 1 ? (
            <div className="flex w-full">
              <p>No Rovers To Display</p>
            </div>
          ) : (
            sponsorshipTiers
              .filter((k) => k.isActive)
              .map((tier, index) => (
                <Card
                  onClick={() => setIsPopular(index)}
                  key={index}
                  className={`relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                    isPopular === index ? "ring-2 ring-primary" : ""
                  } ${tier.borderColor}`}
                >
                  {tier.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 ${tier.iconBgColor} rounded-lg mb-4`}
                    >
                      {renderIcon(tier.icon, tier.iconColor)}
                    </div>
                    <h3 className="text-xl font-bold">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tier.subtitle}
                    </p>
                    <div className="mt-4">
                      <div className="text-2xl font-bold text-primary">
                        {tier.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {tier.priceLabel}
                      </div>
                    </div>
                    <Badge variant="outline" className="mt-3">
                      {tier.benefits.length} Benefits Included
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-0 flex flex-col h-full">
                    <ul className="space-y-3 flex-1">
                      {tier.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      variant={isPopular === index ? "default" : "secondary"}
                      className="w-full mt-6"
                    >
                      <Link href="/contact">Choose This Plan</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </div>
    </section>
  );
}
