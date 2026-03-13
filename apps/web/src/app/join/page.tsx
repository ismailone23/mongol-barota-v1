"use client";

import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Mail,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function JoinPage() {
  const trpc = useTRPC();
  const { data: openings = [], isLoading: loadingOpenings } = useQuery(
    trpc.join.getOpenings.queryOptions(),
  );
  const { data: faqs = [], isLoading: loadingFaqs } = useQuery(
    trpc.join.getFaqs.queryOptions({ category: "join" }),
  );

  const isLoading = loadingOpenings || loadingFaqs;

  return (
    <div className="min-h-screen">
      <section className="py-6 sm:py-18 lg:py-24 bg-linear-to-br from-background via-background to-muted/20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge
              variant="outline"
              className="mb-6 rounded-full px-4 py-1 border-primary/20 bg-primary/5"
            >
              <Users className="w-4 h-4 mr-2" />
              Join Our Team
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-balance">
              Shape the Future of
              <span className="text-primary block">Mars Exploration</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 text-pretty">
              Join MIST Mongol Barota and work on cutting-edge technology while
              representing Bangladesh in global rover competitions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <Link href="#positions">
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="positions" className="py-6 sm:py-18 lg:py-24 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Available Positions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Explore opportunities across our specialized sub-teams.
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <Card key={idx}>
                  <CardHeader className="space-y-3">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : openings.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center text-muted-foreground">
                No openings available right now.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {openings.map((team) => (
                <Card
                  key={team.id}
                  className="h-full rounded-2xl border border-border/70 bg-card/80 shadow-[0_12px_32px_-22px_hsl(var(--foreground)/0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_-20px_hsl(var(--foreground)/0.5)]"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <h3 className="text-lg font-semibold">{team.teamName}</h3>
                      <Badge variant="secondary">
                        {team.openPositions} positions
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {team.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Required Skills:</h4>
                        <div className="flex flex-wrap gap-1">
                          {team.skills.map((skill, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        asChild
                        className="w-full rounded-full bg-transparent"
                        variant="outline"
                      >
                        <Link href="/contact">Apply for This Team</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-6 sm:py-18 lg:py-24 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge
              variant="outline"
              className="mb-4 rounded-full px-4 py-1 border-primary/20 bg-primary/5"
            >
              Join FAQ
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Common questions about joining our team.
            </p>
          </div>

          {isLoading ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Card key={idx}>
                  <CardContent className="p-6 space-y-3">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : faqs.length === 0 ? (
            <Card className="border-dashed max-w-3xl mx-auto">
              <CardContent className="py-12 text-center text-muted-foreground">
                No FAQs available.
              </CardContent>
            </Card>
          ) : (
            <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={faq.id}
                  open={index === 0}
                  className="group rounded-2xl border border-border/70 bg-card/80 shadow-[0_12px_28px_-24px_hsl(var(--foreground)/0.55)] transition-all"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5">
                    <h3 className="text-left font-semibold text-sm sm:text-base leading-snug">
                      {faq.question}
                    </h3>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed border-t border-border/60 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-6 sm:py-18 lg:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <Card className="max-w-4xl mx-auto rounded-3xl bg-primary text-primary-foreground shadow-[0_22px_60px_-35px_hsl(var(--foreground)/0.55)]">
            <CardContent className="p-6 sm:p-10 lg:p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to apply?</h2>
              <p className="text-lg mb-6 opacity-90">
                Contact us with your background and preferred team.
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-full"
              >
                <Link href="/contact">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Recruitment Team
                </Link>
              </Button>
              <div className="mt-6 text-sm opacity-90 flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Rolling applications are open.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
