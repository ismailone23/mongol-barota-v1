"use client";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import RenderIcon from "@/components/render-icon";

const fallbackValues = [
  {
    icon: "Target",
    title: "Excellence",
    description:
      "We strive for the highest standards in engineering and innovation, pushing boundaries in Mars rover technology.",
  },
  {
    icon: "Users",
    title: "Teamwork",
    description:
      "Our multidisciplinary approach brings together the best minds from different engineering fields.",
  },
  {
    icon: "Lightbulb",
    title: "Innovation",
    description:
      "We embrace cutting-edge technologies and creative solutions to overcome complex challenges.",
  },
  {
    icon: "Globe",
    title: "National Pride",
    description:
      "Representing Bangladesh on the global stage and inspiring the next generation of engineers.",
  },
];

const fallbackTimeline = [
  {
    year: "2013",
    title: "Team Formation",
    description:
      "MIST Mongol Barota was established with a vision to represent Bangladesh in international robotics competitions.",
  },
  {
    year: "2014",
    title: "First URC Participation",
    description:
      "Became the first Bangladeshi team to participate in University Rover Challenge, placing 12th globally.",
  },
  {
    year: "2015",
    title: "Best Asian Team",
    description:
      "Achieved 9th position in URC and was nominated as the Best Team from Asia.",
  },
  {
    year: "2021",
    title: "Global Champions",
    description:
      "Made history by winning the University Rover Challenge 2021, becoming global champions.",
  },
  {
    year: "2024",
    title: "Continued Excellence",
    description:
      "Secured runner-up position in ARC 2024 and highest SAR score among South Asian teams in URC.",
  },
  {
    year: "2025",
    title: "URC 2025 Finals",
    description:
      "Achieved 14th position worldwide in University Rover Challenge 2025, competing at Mars Desert Research Station in Utah.",
  },
];

export default function AboutPage() {
  const trpc = useTRPC();

  const { data: contentMap, isLoading: contentLoading } = useQuery(
    trpc.content.getSiteContentByKeys.queryOptions({
      keys: [
        "about_hero",
        "mission",
        "vision",
        "institution_description",
        "sponsor_cta",
      ],
    }),
  );

  const { data: dbTimeline, isLoading: timelineLoading } = useQuery(
    trpc.content.getTimelineEvents.queryOptions(),
  );

  const { data: dbValues, isLoading: valuesLoading } = useQuery(
    trpc.content.getActiveContentItems.queryOptions({
      section: "core_value",
    }),
  );

  const { data: dbStats, isLoading: statsLoading } = useQuery(
    trpc.content.getActiveContentItems.queryOptions({
      section: "stat_card",
    }),
  );

  const isHeroLoading = contentLoading;
  const isValuesLoading = valuesLoading;
  const isTimelineLoading = timelineLoading;
  const isStatsLoading = statsLoading;

  const values =
    dbValues && dbValues.length > 0
      ? dbValues.map((v) => ({
          icon: v.icon ?? "Target",
          title: v.title,
          description: v.description ?? "",
        }))
      : fallbackValues;

  const timeline =
    dbTimeline && dbTimeline.length > 0 ? dbTimeline : fallbackTimeline;

  const mission =
    contentMap?.mission?.body ??
    "To develop cutting-edge Mars rover technology that advances space exploration while representing Bangladesh on the global stage. We aim to inspire the next generation of engineers and contribute to humanity's understanding of Mars.";

  const vision =
    contentMap?.vision?.body ??
    "To be recognized as a world-class Mars rover team that consistently delivers innovative solutions, fosters international collaboration, and serves as a beacon of excellence in robotics and space technology from South Asia.";

  const institutionDesc =
    contentMap?.institution_description?.body ??
    "MIST Mongol Barota is proudly affiliated with the Military Institute of Science and Technology (MIST), one of Bangladesh's premier engineering institutions. Our team comprises talented students from various engineering disciplines including Computer Science, Electrical Engineering, Mechanical Engineering, and Petroleum & Mining Engineering.";

  const heroText =
    contentMap?.about_hero?.body ??
    "Since 2013, MIST Mongol Barota has been at the forefront of Mars rover technology, representing Bangladesh with pride and pushing the boundaries of what's possible in space exploration.";

  const stats =
    dbStats && dbStats.length > 0
      ? dbStats.map((s) => ({
          value: s.subtitle ?? s.title,
          label: s.description ?? s.title,
        }))
      : [
          { value: "4+", label: "Engineering Departments" },
          { value: "40+", label: "Active Members" },
          { value: "12+", label: "Years of Excellence" },
        ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-linear-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6">
              About Us
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Pioneering the Future of
              <span className="text-primary block">Space Exploration</span>
            </h1>
            {isHeroLoading ? (
              <div className="space-y-3 mb-8">
                <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
                <Skeleton className="h-6 w-5/6 max-w-2xl mx-auto" />
              </div>
            ) : (
              <p className="text-xl text-muted-foreground mb-8 text-pretty">
                {heroText}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <Link href="/team">
                  Meet Our Team
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/rovers">Explore Our Rovers</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our Mission & Vision
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-primary">
                    Mission
                  </h3>
                  <p className="text-muted-foreground text-pretty">{mission}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-primary">
                    Vision
                  </h3>
                  <p className="text-muted-foreground text-pretty">{vision}</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-linear-to-br from-primary/20 to-accent/20 rounded-2xl p-8">
                <Image
                  src={contentMap?.mission?.image ?? "/about_pic.jpg"}
                  alt="Team working on rover"
                  width={400}
                  height={400}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              These principles guide everything we do, from rover design to team
              collaboration
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isValuesLoading
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <Card key={idx} className="text-center">
                    <CardContent className="p-6 space-y-4">
                      <Skeleton className="w-12 h-12 rounded-lg mx-auto" />
                      <Skeleton className="h-6 w-2/3 mx-auto" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5 mx-auto" />
                    </CardContent>
                  </Card>
                ))
              : values.map((value, index) => (
                  <Card
                    key={index}
                    className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardContent className="p-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                        <RenderIcon
                          name={value.icon}
                          className="w-6 h-6 text-primary"
                        />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              From humble beginnings to global recognition, here&apos;s how
              we&apos;ve grown over the years
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {isTimelineLoading
                ? Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <Skeleton className="w-4 h-4 rounded-full" />
                        <Skeleton className="w-0.5 h-16 mt-4" />
                      </div>
                      <div className="flex-1 pb-8 space-y-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))
                : timeline.map((item, index) => (
                    <div
                      key={`${item.year}-${item.title}-${index}`}
                      className="flex gap-6 group"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 bg-primary rounded-full group-hover:scale-125 transition-transform" />
                        {index < timeline.length - 1 && (
                          <div className="w-0.5 h-16 bg-border mt-4" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-primary">
                            {item.year}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* MIST Connection */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Military Institute of Science and Technology
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              {institutionDesc}
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {isStatsLoading
                ? Array.from({ length: 3 }).map((_, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-6 text-center space-y-3">
                        <Skeleton className="h-8 w-20 mx-auto" />
                        <Skeleton className="h-4 w-24 mx-auto" />
                      </CardContent>
                    </Card>
                  ))
                : stats.map((stat, index) => (
                    <Card key={index}>
                      <CardContent className="p-6 text-center">
                        <div className="text-2xl font-bold text-primary mb-2">
                          {stat.value}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stat.label}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-linear-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Support Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                {contentMap?.sponsor_cta?.body ??
                  "We're actively seeking sponsors for the 2026 season. Join us in representing Bangladesh on the global stage and inspiring the next generation of engineers. Your support will help us compete in URC & ARC 2026 and continue our legacy of excellence."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Link href="/sponsors">
                    Become a Sponsor
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
