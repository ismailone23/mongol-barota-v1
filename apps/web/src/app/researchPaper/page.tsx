"use client";

import { ScrollAnimation } from "@/components/scroll-animation";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import {
  Calendar,
  ExternalLink,
  FileText,
  GraduationCap,
  Users,
} from "lucide-react";
import Link from "next/link";

// Research papers data
const researchPapers = [
  {
    id: 1,
    title:
      "Development and Implementation of a Mars Rover for University Rover Challenge",
    authors: ["MIST Mongol Barota Team"],
    journal: "IEEE Explore",
    year: "2022",
    doi: "10.1109/ICREST54738.2022.9764737",
    url: "https://ieeexplore.ieee.org/abstract/document/9764737",
    abstract:
      "This paper presents the development and implementation of a Mars rover designed for the University Rover Challenge. The rover incorporates advanced navigation systems, robotic manipulation capabilities, and scientific instrumentation suitable for Mars exploration missions.",
    keywords: [
      "Mars Rover",
      "Robotics",
      "Autonomous Navigation",
      "Space Exploration",
      "University Rover Challenge",
    ],
    category: "Conference Paper",
    venue:
      "2022 3rd International Conference on Robotics, Electrical and Signal Processing Techniques (ICREST)",
    pages: "1-6",
    publisher: "IEEE",
    isOpenAccess: false,
  },
  {
    id: 2,
    title: "Mongol Barota: A Next Generation Rover",
    authors: ["MIST Mongol Barota Research Team"],
    journal: "ResearchGate",
    year: "2014",
    url: "https://www.researchgate.net/publication/268686459_Mongol_Barota_A_Next_Generation_Rover",
    abstract:
      "This research presents the design and development of Mongol Barota, a next-generation rover platform capable of autonomous navigation and scientific data collection. The rover represents a significant advancement in robotic exploration technology developed by the MIST team.",
    keywords: [
      "Rover Design",
      "Autonomous Systems",
      "Robotics",
      "Mars Exploration",
      "Navigation",
    ],
    category: "Research Publication",
    venue: "ResearchGate Platform",
    isOpenAccess: true,
  },
];

const categories = ["All", "Conference Paper", "Research Publication"];

export default function ResearchPapersPage() {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollAnimation>
              <Badge variant="outline" className="mb-6">
                Research & Publications
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                Research <span className="text-primary block">Papers</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 text-pretty">
                Explore our published research contributions to Mars exploration
                technology, rover development, and autonomous systems. Our work
                advances the field of robotic space exploration.
              </p>

              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground mb-8">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  {researchPapers.length} Publications
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Multiple Authors
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  2014 - 2022
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="group">
                  <Link href="#papers">
                    <GraduationCap className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                    Explore Publications
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Contact Research Team</Link>
                </Button>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Papers Section */}
      <section id="papers" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Category Filter */}
            <ScrollAnimation>
              <div className="flex flex-wrap gap-2 mb-12">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={category === "All" ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </ScrollAnimation>

            {/* Papers Grid */}
            <div className="space-y-8">
              {researchPapers.map((paper, index) => (
                <ScrollAnimation key={paper.id} delay={index * 100}>
                  <Card className="hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-xs">
                            {paper.category}
                          </Badge>
                          {paper.isOpenAccess && (
                            <Badge
                              variant="outline"
                              className="text-xs text-green-600 border-green-600"
                            >
                              Open Access
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {paper.year}
                        </div>
                      </div>

                      <h2 className="text-xl md:text-2xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors">
                        {paper.title}
                      </h2>

                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                        <span className="font-medium">Authors:</span>
                        {paper.authors.map((author, idx) => (
                          <span key={idx}>
                            {author}
                            {idx < paper.authors.length - 1 && ", "}
                          </span>
                        ))}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-foreground">
                            Published in:
                          </span>
                          <span className="ml-2 text-muted-foreground">
                            {paper.venue}
                          </span>
                        </div>
                        {paper.pages && (
                          <div>
                            <span className="font-medium text-foreground">
                              Pages:
                            </span>
                            <span className="ml-2 text-muted-foreground">
                              {paper.pages}
                            </span>
                          </div>
                        )}
                        {paper.doi && (
                          <div>
                            <span className="font-medium text-foreground">
                              DOI:
                            </span>
                            <span className="ml-2 text-muted-foreground font-mono text-xs">
                              {paper.doi}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2">Abstract</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {paper.abstract}
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold mb-2">Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {paper.keywords.map((keyword, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button asChild className="flex-1 sm:flex-none">
                          <Link
                            href={paper.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Paper
                          </Link>
                        </Button>

                        {/* {paper.isOpenAccess && (
                          <Button
                            asChild
                            variant="outline"
                            className="flex-1 sm:flex-none"
                          >
                            <Link
                              href={paper.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </Link>
                          </Button>
                        )} */}
                      </div>
                    </CardContent>
                  </Card>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4">
                Interested in Our Research?
              </h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Explore our achievements and learn more about our ongoing
                projects in Mars exploration technology and robotic systems.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/achievements">View Our Achievements</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/rovers">Explore Our Rovers</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Contact Research Team</Link>
                </Button>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}
