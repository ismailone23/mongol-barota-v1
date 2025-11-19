"use client";
import Rover from "@/components/rover";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Cpu, Eye, Trophy, Zap } from "lucide-react";

export default function RoversPage() {
  const trpc = useTRPC();
  const { data: rovers, isLoading } = useQuery(
    trpc.competition.getRovers.queryOptions()
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-linear-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6">
              Our Rovers
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Engineering Excellence
              <span className="text-primary block">Across Generations</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              From our pioneering first rover to the cutting-edge Aurora X,
              explore the evolution of our Mars rover technology and the
              innovations that have made us global champions.
            </p>
          </div>
        </div>
      </section>

      {/* Rovers Grid */}

      <Rover rovers={rovers} isLoading={isLoading} />
      {/* Technology Evolution */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Technology Evolution
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              See how our rover technology has advanced over the years, from
              basic mobility to advanced AI systems
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Cpu className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Processing Power</h3>
                  <p className="text-sm text-muted-foreground">
                    From basic microcontrollers to Jetson Orin AGX
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Eye className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Computer Vision</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced AI-powered navigation and object recognition
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Zap className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Power Systems</h3>
                  <p className="text-sm text-muted-foreground">
                    Efficient battery management and power distribution
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Trophy className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Performance</h3>
                  <p className="text-sm text-muted-foreground">
                    From participation to global championship
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
