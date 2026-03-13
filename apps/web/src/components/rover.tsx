import React from "react";
import { RoverModal } from "./rover-modal";
import { Button } from "@workspace/ui/components/button";
import {
  ArrowRight,
  Award,
  Calendar,
  Eye,
  Medal,
  Trophy,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { RoversSelect } from "@workspace/db/schema";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <Zap className="w-4 h-4 text-green-500" />;
    case "Champion":
      return <Trophy className="w-4 h-4 text-yellow-500" />;
    case "Veteran":
      return <Medal className="w-4 h-4 text-blue-500" />;
    case "Pioneer":
      return <Award className="w-4 h-4 text-purple-500" />;
    default:
      return <Eye className="w-4 h-4 text-gray-500" />;
  }
};
export default function Rover({
  rovers,
  isLoading,
}: {
  rovers: RoversSelect[] | undefined;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12">
            {Array.from({ length: 2 }).map((_, idx) => (
              <Card key={idx} className="overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-0">
                  <Skeleton className="aspect-video lg:aspect-square w-full" />
                  <div className="p-8 lg:p-12 space-y-4">
                    <Skeleton className="h-10 w-2/3" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-5/6" />
                    <Skeleton className="h-10 w-40" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-12">
          {!rovers || rovers?.length < 1 ? (
            <div className="flex w-full">
              <p>No Rovers To Display</p>
            </div>
          ) : (
            rovers.map((rover, index) => (
              <Card
                key={rover.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}
                >
                  {/* Image */}
                  <div
                    className={`relative aspect-video lg:aspect-square bg-muted/30 ${index % 2 === 1 ? "lg:col-start-2" : ""}`}
                  >
                    <Image
                      src={rover.image || "/placeholder.svg"}
                      alt={rover.name}
                      fill
                      className="object-contain"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        variant="secondary"
                        className="bg-background text-foreground border"
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        <div className="text-sm flex ">
                          <div>{new Date(rover.year).getFullYear()}</div>
                          {rover.ended && (
                            <div>{new Date(rover.ended).getFullYear()}</div>
                          )}
                        </div>
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant="secondary"
                        className="bg-background text-foreground border"
                      >
                        {getStatusIcon(rover.status)}
                        <span className="ml-1">{rover.status}</span>
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 lg:p-12">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-3xl font-bold mb-3">
                          {rover.name}
                        </h2>
                        <p className="text-muted-foreground text-lg">
                          {rover.description}
                        </p>
                      </div>

                      {/* Achievements */}
                      <div>
                        <h3 className="font-semibold mb-3">Key Achievements</h3>
                        <div className="flex flex-wrap gap-2">
                          {rover.achievements.map((achievement, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs"
                            >
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Specs Preview */}
                      <div>
                        <h3 className="font-semibold mb-3">Specifications</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Weight:
                            </span>
                            <span className="ml-2 font-medium">
                              {rover.spec.weight}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Power:
                            </span>
                            <span className="ml-2 font-medium">
                              {rover.spec.power}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Dimensions:
                            </span>
                            <span className="ml-2 font-medium">
                              {rover.spec.dimensions}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Arm:</span>
                            <span className="ml-2 font-medium">
                              {rover.spec.arm}
                            </span>
                          </div>
                        </div>
                      </div>

                      <RoverModal rover={rover}>
                        <Button className="bg-primary hover:bg-primary/90">
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </RoverModal>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
