"use client";
import { renderIcon } from "@/components/render-icon";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import {
  CompetitionsSelect,
  RoversSelect,
  MemberSelect,
} from "@workspace/db/schema";
import { RegionRecord } from "@workspace/types";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Award, Calendar, Medal, Star, Trophy } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

export interface CompetitionsWithRover {
  competition: CompetitionsSelect;
  rover: RoversSelect;
  members: MemberSelect[];
}

export default function AchievementsPage() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.competition.getFullCompetitionData.queryOptions()
  );

  const { featuredAchievement, otherAchievements } = useMemo(() => {
    let featuredAchievement: CompetitionsWithRover[] = [];
    let otherAchievements: CompetitionsWithRover[] = [];
    if (!data) return { featuredAchievement, otherAchievements };

    featuredAchievement = data.filter((a) => a.competition.featured);
    otherAchievements = data.filter((a) => !a.competition.featured);

    return { featuredAchievement, otherAchievements };
  }, [data]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-linear-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6">
              Our Achievements
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              A Legacy of
              <span className="text-primary block">Excellence</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              From our historic debut in 2014 to becoming global champions,
              explore our journey of achievements that have put Bangladesh on
              the world map of Mars rover competitions.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Achievement */}
      {featuredAchievement && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge
                variant="secondary"
                className="mb-4 bg-yellow-100 text-yellow-800"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Featured Achievement
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Our Greatest Victory
              </h2>
            </div>

            {featuredAchievement.map((ach, index) => (
              <Card
                key={index}
                className="max-w-6xl mx-auto overflow-hidden shadow-2xl"
              >
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative aspect-4/3 lg:aspect-square bg-linear-to-br from-muted/40 via-background to-muted/60 p-6 sm:p-10">
                    <Image
                      src={ach.competition.image || "/Achievements/URC_21.jpg"}
                      alt={ach.competition.name}
                      fill
                      className="object-contain drop-shadow-2xl"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      priority
                    />
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-linear-to-r from-amber-300 via-yellow-400 to-amber-500 text-amber-950 shadow-lg shadow-amber-500/40 border border-amber-300/60">
                        <Trophy className="w-3 h-3 mr-1 text-amber-900" />
                        Champions
                      </Badge>
                    </div>
                  </div>

                  <div className="p-8 lg:p-12">
                    <div className="space-y-6">
                      <div>
                        <div className="text-sm font-medium text-primary mb-2">
                          {ach.competition.year.getFullYear()}
                        </div>
                        <h3 className="text-3xl font-bold mb-4">
                          {ach.competition.name}
                        </h3>
                        <p className="text-muted-foreground text-lg">
                          {ach.competition.name}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Competition:
                          </span>
                          <div className="font-medium">
                            {RegionRecord[ach.competition.region]}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Result:</span>
                          <div className="font-medium">
                            {ach.competition.result}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Team Size:
                          </span>
                          <div className="font-medium">
                            {ach.members.length}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rover:</span>
                          <div className="font-medium">{ach.rover.name}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Key Highlights</h4>
                        <div className="flex flex-wrap gap-2">
                          {ach.competition.highlights.map((highlight, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs"
                            >
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Achievement Timeline */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Achievement Timeline
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Follow our journey from debut to championship across international
              competitions
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8">
              {otherAchievements.map((achievement, index) => (
                <Card
                  key={index}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`grid lg:grid-cols-3 gap-0 ${
                      index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                    }`}
                  >
                    {/* Image */}
                    <div
                      className={`relative flex min-h-[220px] items-center justify-center bg-linear-to-br from-muted/30 via-background to-muted/50 p-6 ${
                        index % 2 === 1 ? "lg:col-start-3" : ""
                      }`}
                    >
                      <Image
                        src={
                          achievement.competition.image || "/placeholder.svg"
                        }
                        alt={achievement.competition.name}
                        fill
                        className="object-contain drop-shadow-xl"
                        sizes="(min-width: 1024px) 320px, 100vw"
                      />
                      <div className="absolute top-6 left-6">
                        <Badge className="bg-primary text-primary-foreground shadow-lg shadow-primary/40 border border-primary/30">
                          <Calendar className="w-3 h-3 mr-1 text-primary-foreground" />
                          {achievement.competition.year.getFullYear()}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-2 p-6 lg:p-8">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-2 ${achievement.competition.iconBg} rounded-lg shrink-0`}
                          >
                            {renderIcon(
                              achievement.competition.icon,
                              achievement.competition.iconColor
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">
                              {achievement.competition.name}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              {achievement.competition.description}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Competition:
                            </span>
                            <div className="font-medium">
                              {RegionRecord[achievement.competition.region]}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Location:
                            </span>
                            <div className="font-medium">
                              {achievement.competition.location}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Result:
                            </span>
                            <div className="font-medium">
                              {achievement.competition.result}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Rover:
                            </span>
                            <div className="font-medium">
                              {achievement.rover.name}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex flex-wrap gap-2">
                            {achievement.competition.highlights.map(
                              (highlight, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {highlight}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievement Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              By the Numbers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Our achievements quantified across years of competition
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
                <div className="text-3xl font-bold text-primary mb-2">1</div>
                <div className="text-sm text-muted-foreground">
                  Global Championship
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Medal className="w-8 h-8 text-gray-500 mx-auto mb-4" />
                <div className="text-3xl font-bold text-primary mb-2">3</div>
                <div className="text-sm text-muted-foreground">
                  Podium Finishes
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Award className="w-8 h-8 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-primary mb-2">8</div>
                <div className="text-sm text-muted-foreground">
                  Competition Participations
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Star className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                <div className="text-3xl font-bold text-primary mb-2">11</div>
                <div className="text-sm text-muted-foreground">
                  Years of Excellence
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
