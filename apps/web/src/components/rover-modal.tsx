"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import Image from "next/image";
import {
  Calendar,
  Trophy,
  Cpu,
  Zap,
  Eye,
  Wrench,
  Target,
  Award,
} from "lucide-react";

interface RoverModalProps {
  rover: {
    id: string;
    name: string;
    year: string;
    status: string;
    description: string;
    image: string;
    achievements: string[];
    specs: {
      weight: string;
      dimensions: string;
      power: string;
      communication: string;
      autonomy: string;
      arm: string;
    };
    features: string[];
  };
  children: React.ReactNode;
}

export function RoverModal({ rover, children }: RoverModalProps) {
  const [open, setOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <Zap className="w-4 h-4 text-green-500" />;
      case "Champion":
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case "Veteran":
        return <Award className="w-4 h-4 text-blue-500" />;
      case "Pioneer":
        return <Target className="w-4 h-4 text-purple-500" />;
      default:
        return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            {rover.name}
            <Badge variant="secondary" className="ml-2">
              {getStatusIcon(rover.status)}
              <span className="ml-1">{rover.status}</span>
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hero Image */}
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={rover.image || "/placeholder.svg"}
              alt={rover.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-background/90">
                <Calendar className="w-3 h-3 mr-1" />
                {rover.year}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">About {rover.name}</h3>
            <p className="text-muted-foreground">{rover.description}</p>
          </div>

          {/* Tabs for detailed information */}
          <Tabs defaultValue="achievements" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>

            <TabsContent value="achievements" className="space-y-4">
              <h4 className="font-semibold">Key Achievements</h4>
              <div className="grid gap-3">
                {rover.achievements.map((achievement, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-primary" />
                        <span>{achievement}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="space-y-4">
              <h4 className="font-semibold">Technical Specifications</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(rover.specs).map(([key, value]) => (
                  <Card key={key}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Cpu className="w-4 h-4 text-primary" />
                        <span className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <h4 className="font-semibold">Key Features</h4>
              <div className="grid gap-3">
                {rover.features.map((feature, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-primary" />
                        <span>{feature}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
