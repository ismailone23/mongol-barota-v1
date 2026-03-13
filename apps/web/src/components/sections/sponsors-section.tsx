import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import Link from "next/link";
import { ArrowRight, Handshake, Target, TrendingUp, Users } from "lucide-react";

const sponsorshipOpportunities = [
  {
    icon: Target,
    title: "Brand Exposure",
    description:
      "Logo on rover, team uniforms, and international competition materials",
  },
  {
    icon: Users,
    title: "Student Access",
    description:
      "Direct engagement with thousands of MIST students and future engineers",
  },
  {
    icon: TrendingUp,
    title: "Media Coverage",
    description:
      "National and international media visibility through our competitions",
  },
  {
    icon: Handshake,
    title: "Industry Partnership",
    description: "Collaborate with Bangladesh's premier robotics team",
  },
];

export function SponsorsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-4 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <Handshake className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Partnership Opportunities
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Become a Sponsor for{" "}
            <span className="text-primary">URC & ARC 2026</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Join us in our mission to represent Bangladesh on the global stage.
            We're seeking partners who share our vision for innovation and
            excellence in space exploration.
          </p>
        </div>

        <div className="mb-10 sm:mb-12 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {sponsorshipOpportunities.map((opportunity, index) => (
            <Card
              key={index}
              className="h-full text-center rounded-2xl border border-border/70 bg-card/80 shadow-[0_12px_32px_-22px_hsl(var(--foreground)/0.45)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_-20px_hsl(var(--foreground)/0.5)]"
            >
              <CardContent className="p-6 sm:p-7">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <opportunity.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{opportunity.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {opportunity.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mx-auto max-w-4xl rounded-3xl border border-primary/20 bg-card/90 p-6 text-center shadow-[0_22px_60px_-35px_hsl(var(--foreground)/0.55)] sm:p-10">
          <h3 className="text-2xl font-bold mb-4 text-balance">
            Why Partner With Mongol Barota?
          </h3>
          <div className="mb-8 grid gap-5 text-left sm:grid-cols-3 sm:gap-6">
            <div>
              <div className="text-3xl font-bold text-primary mb-1">500+</div>
              <div className="text-sm text-muted-foreground">
                Competition Finalists
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">15+</div>
              <div className="text-sm text-muted-foreground">
                Countries Represented
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">#1</div>
              <div className="text-sm text-muted-foreground">
                Team in South Asia
              </div>
            </div>
          </div>
          <p className="mx-auto mb-6 max-w-3xl text-muted-foreground leading-relaxed">
            As the 2021 URC Champions and highest-ranked team in South Asia, we
            offer unparalleled visibility and partnership opportunities for
            organizations looking to support innovation and inspire the next
            generation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary hover:bg-primary/90"
            >
              <Link href="/sponsors">
                View Sponsorship Packages
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full"
            >
              <Link href="/contact">Contact Us Today</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
