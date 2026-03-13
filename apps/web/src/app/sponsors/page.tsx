"use client";
import SponsorTiers from "@/components/sponsor-tiers";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import {
  ArrowRight,
  Award,
  BarChart,
  Building,
  Check,
  Crown,
  Gift,
  Globe,
  Handshake,
  Heart,
  Lightbulb,
  Mail,
  Megaphone,
  Phone,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PrevSponsor from "@/components/prev-sponsor";
import { useMemo } from "react";
import RenderIcon from "@/components/render-icon";

const fallbackBenefits = [
  {
    icon: "Building",
    title: "University Affiliation",
    description:
      "Align your brand with the next generation of leaders, pioneers, and innovators. Showcase your company as an active collaborator in shaping the future.",
  },
  {
    icon: "Globe",
    title: "Brand Exposure",
    description:
      "Gain prominent visibility through logo placements on the rover, team uniforms, event materials, and digital platforms reaching international audiences.",
  },
  {
    icon: "Megaphone",
    title: "Media Coverage",
    description:
      "Get exposure through national and international media channels when your logo is presented by Mongol Barota's Mars rover and merchandise.",
  },
  {
    icon: "Handshake",
    title: "Initiating New Partnerships",
    description:
      "Be at the forefront of industry-academy collaborations, creating opportunities for further partnerships and establishing presence as a partner for advancement.",
  },
  {
    icon: "TrendingUp",
    title: "Lead Generation",
    description:
      "Connect with MIST's growing student body, providing direct access to thousands of potential customers, interns, collaborators, and future employees.",
  },
  {
    icon: "Users",
    title: "Brand Community",
    description:
      "Build a powerful network of like-minded advocates who actively support and amplify your brand, evolving into devoted users and long-term allies.",
  },
  {
    icon: "Gift",
    title: "Branded Gift Exposure",
    description:
      "Provide branded gifts for international participants, judges, organizers, and volunteers, creating lasting brand impressions across a global audience.",
  },
  {
    icon: "Target",
    title: "Long-term Legacy",
    description:
      "Build loyal customer base, convert potential leaders to brand ambassadors, and create partnerships with other organizations of the institution.",
  },
  {
    icon: "Lightbulb",
    title: "Exclusive Access",
    description:
      "Receive exclusive invitations to seminars, keynote events, and product showcases to speak at ceremonies and promote products/services.",
  },
  {
    icon: "BarChart",
    title: "Activation Opportunities",
    description:
      "Set up promotional booths during national events, facilitating direct product demonstrations, on-the-spot promotions, and targeted sales engagement.",
  },
];

export default function SponsorsPage() {
  const trpc = useTRPC();
  const { data: sponsorshipTiers, isLoading } = useQuery(
    trpc.team.getPlans.queryOptions(),
  );
  const { data: previousSponsors, isLoading: isSponsorLoading } = useQuery(
    trpc.team.getSponsors.queryOptions(),
  );
  const { data: dbBenefits } = useQuery(
    trpc.content.getActiveContentItems.queryOptions({
      section: "sponsorship_benefit",
    }),
  );

  const sponsorshipBenefits = useMemo(() => {
    if (!dbBenefits || dbBenefits.length === 0) return fallbackBenefits;
    return dbBenefits.map((b) => ({
      icon: b.icon ?? "Star",
      title: b.title,
      description: b.description ?? "",
    }));
  }, [dbBenefits]);
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-6 sm:py-18 lg:py-24 bg-linear-to-b from-background via-background to-muted/20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge
              variant="outline"
              className="mb-6 rounded-full px-4 py-1 border-primary/20 bg-primary/5"
            >
              <Heart className="w-4 h-4 mr-2" />
              Seeking Sponsors & Partners
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-balance">
              Partner with Us for
              <span className="text-primary block">URC & ARC 2026</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 text-pretty">
              We're actively seeking sponsors to support our mission in the 2026
              season. Join us in pushing the boundaries of space exploration and
              representing Bangladesh with pride on the international stage.
            </p>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-3 mb-8 text-left">
              <Card className="rounded-2xl border border-border/70 bg-card/80">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Target Audience</h4>
                  <p className="text-sm text-muted-foreground">
                    University Students, Youths, International Professionals,
                    Faculty, Professors (18-60 years)
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border border-border/70 bg-card/80">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Competition Reach</h4>
                  <p className="text-sm text-muted-foreground">
                    500+ Finalists, 114+ teams from 15+ countries
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border border-border/70 bg-card/80">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Media Reach</h4>
                  <p className="text-sm text-muted-foreground">
                    National & International audience through local, global
                    media, and digital platforms
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <Link href="#sponsorship-tiers">
                  View Sponsorship Options
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PrevSponsor
        previousSponsors={previousSponsors}
        isLoading={isSponsorLoading}
      />

      <SponsorTiers isLoading={isLoading} sponsorshipTiers={sponsorshipTiers} />

      {/* Sponsorship Benefits */}
      <section className="py-6 sm:py-18 lg:py-24 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Partner With Us?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Comprehensive benefits of supporting Bangladesh's premier Mars
              rover team
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sponsorshipBenefits.map((benefit, index) => (
              <Card
                key={index}
                className="rounded-2xl border border-border/70 bg-card/80 shadow-[0_12px_32px_-22px_hsl(var(--foreground)/0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_-20px_hsl(var(--foreground)/0.5)]"
              >
                <CardContent className="p-6 sm:p-7">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <RenderIcon
                      name={benefit.icon}
                      className="w-6 h-6 text-primary"
                    />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Competition Timeline */}
      <section className="py-6 sm:py-18 lg:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Competition Timeline 2026
              </h2>
              <p className="text-lg text-muted-foreground">
                Key dates for URC 2026
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <Card className="rounded-2xl bg-primary text-primary-foreground">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-2">SAR Submission</h3>
                  <p className="text-4xl font-bold mb-2">27 Feb 2026</p>
                  <p className="opacity-90">System Acceptance Review</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl bg-secondary border border-border/70">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-2">URC Finals</h3>
                  <p className="text-4xl font-bold mb-2">27-30 May 2026</p>
                  <p className="text-muted-foreground">Utah, USA</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-6 sm:py-18 lg:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <Card className="max-w-4xl mx-auto rounded-3xl bg-primary text-primary-foreground shadow-[0_22px_60px_-35px_hsl(var(--foreground)/0.55)]">
            <CardContent className="p-6 sm:p-10 lg:p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Launch Your Partnership?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Join us in building more than just sponsorship—become a valued
                partner in shaping the future of innovation and student
                achievement
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Get in Touch
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  <Link href="tel:+8801778665529">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Team Lead
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
