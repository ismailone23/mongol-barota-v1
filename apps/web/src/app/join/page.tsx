"use client";

import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { ArrowRight, CheckCircle, Mail, Users } from "lucide-react";
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
      <section className="py-20 bg-linear-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6">
              <Users className="w-4 h-4 mr-2" />
              Join Our Team
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Shape the Future of
              <span className="text-primary block">Mars Exploration</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
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

      <section id="positions" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Available Positions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Explore opportunities across our specialized sub-teams.
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {openings.map((team) => (
                <Card
                  key={team.id}
                  className="hover:shadow-lg transition-shadow"
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
                        className="w-full bg-transparent"
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

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
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
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq) => (
                <Card key={faq.id}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-primary text-primary-foreground">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to apply?</h2>
              <p className="text-lg mb-6 opacity-90">
                Contact us with your background and preferred team.
              </p>
              <Button asChild size="lg" variant="secondary">
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
