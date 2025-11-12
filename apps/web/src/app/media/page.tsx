"use client";

import { useState } from "react";
import { ScrollAnimation } from "@/components/scroll-animation";
import { Button } from "@workspace/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Tv, Newspaper, Globe, Calendar, ExternalLink } from "lucide-react";

const mediaItems = [
  // 2024 Media Coverage
  {
    year: "2024",
    type: "tv",
    title: "URC 2024 Qualification Coverage",
    outlet: "National Television",
    date: "June 2024",
    description:
      "Team Mongol Barota qualifies for URC 2024 finals with highest South Asian score",
    image: "/placeholder.svg?height=400&width=600&text=TV+Coverage+2024",
    link: "#",
  },
  {
    year: "2024",
    type: "print",
    title: "ARC 2024 Runner-up Achievement",
    outlet: "The Daily Star",
    date: "September 2024",
    description: "MIST team secures 2nd position in Anatolian Rover Challenge",
    image: "/placeholder.svg?height=400&width=600&text=Newspaper+2024",
    link: "#",
  },
  {
    year: "2024",
    type: "print",
    title: "Bangladesh Shines in International Robotics",
    outlet: "Prothom Alo",
    date: "September 2024",
    description: "Mongol Barota brings glory to Bangladesh in Turkey",
    image: "/placeholder.svg?height=400&width=600&text=Prothom+Alo+2024",
    link: "#",
  },
  {
    year: "2024",
    type: "online",
    title: "MIST Robotics Team Makes History",
    outlet: "bdnews24.com",
    date: "June 2024",
    description: "Comprehensive coverage of team achievements and future goals",
    image: "/placeholder.svg?height=400&width=600&text=Online+News+2024",
    link: "#",
  },
  {
    year: "2024",
    type: "print",
    title: "Young Engineers Lead Innovation",
    outlet: "The Business Standard",
    date: "August 2024",
    description: "Feature story on team members and their journey",
    image: "/placeholder.svg?height=400&width=600&text=Business+Standard+2024",
    link: "#",
  },

  // 2023 Media Coverage
  {
    year: "2023",
    type: "tv",
    title: "ARC 2023 Participation",
    outlet: "Channel 24",
    date: "September 2023",
    description: "Live coverage of team departure and competition updates",
    image: "/placeholder.svg?height=400&width=600&text=TV+Coverage+2023",
    link: "#",
  },
  {
    year: "2023",
    type: "print",
    title: "5th Position in International Competition",
    outlet: "Kaler Kantho",
    date: "September 2023",
    description: "Detailed report on ARC 2023 performance",
    image: "/placeholder.svg?height=400&width=600&text=Newspaper+2023",
    link: "#",
  },
  {
    year: "2023",
    type: "online",
    title: "MIST Students Excel in Robotics",
    outlet: "Dhaka Tribune",
    date: "October 2023",
    description: "Interview with team members about their experience",
    image: "/placeholder.svg?height=400&width=600&text=Online+2023",
    link: "#",
  },
  {
    year: "2023",
    type: "print",
    title: "Mars Rover Team Represents Bangladesh",
    outlet: "Jugantor",
    date: "September 2023",
    description: "Feature on team preparation and competition strategy",
    image: "/placeholder.svg?height=400&width=600&text=Jugantor+2023",
    link: "#",
  },

  // 2021 Media Coverage
  {
    year: "2021",
    type: "tv",
    title: "URC 2021 Championship Victory",
    outlet: "BTV National News",
    date: "June 2021",
    description: "Historic win celebrated across national media",
    image: "/placeholder.svg?height=400&width=600&text=TV+Championship+2021",
    link: "#",
  },
  {
    year: "2021",
    type: "tv",
    title: "Champions Return Home",
    outlet: "ATN Bangla",
    date: "June 2021",
    description: "Special program featuring the championship team",
    image: "/placeholder.svg?height=400&width=600&text=ATN+2021",
    link: "#",
  },
  {
    year: "2021",
    type: "print",
    title: "Global Champions from Bangladesh",
    outlet: "The Daily Star",
    date: "June 2021",
    description: "Front page coverage of historic URC championship",
    image: "/placeholder.svg?height=400&width=600&text=Daily+Star+2021",
    link: "#",
  },
  {
    year: "2021",
    type: "print",
    title: "MIST Makes History",
    outlet: "Prothom Alo",
    date: "June 2021",
    description: "Detailed feature on championship journey",
    image: "/placeholder.svg?height=400&width=600&text=Prothom+Alo+2021",
    link: "#",
  },
  {
    year: "2021",
    type: "online",
    title: "Bangladesh Wins International Robotics Competition",
    outlet: "BBC Bangla",
    date: "June 2021",
    description: "International coverage of the achievement",
    image: "/placeholder.svg?height=400&width=600&text=BBC+2021",
    link: "#",
  },
  {
    year: "2021",
    type: "print",
    title: "Pride of the Nation",
    outlet: "Samakal",
    date: "June 2021",
    description: "Editorial celebrating the team success",
    image: "/placeholder.svg?height=400&width=600&text=Samakal+2021",
    link: "#",
  },

  // 2014 Media Coverage
  {
    year: "2014",
    type: "tv",
    title: "Young Nite - ATN News",
    outlet: "ATN News",
    date: "July 2014",
    description: "First ever Bangladesh team in URC featured on Young Nite",
    image: "/placeholder.svg?height=400&width=600&text=Young+Nite+2014",
    link: "#",
  },
  {
    year: "2014",
    type: "tv",
    title: "Young Nite Special Episode",
    outlet: "ATN News",
    date: "August 2014",
    description: "Extended coverage of team journey and achievements",
    image: "/placeholder.svg?height=400&width=600&text=Young+Nite+Special+2014",
    link: "#",
  },
  {
    year: "2014",
    type: "print",
    title: "Bangladesh Enters Mars Rover Competition",
    outlet: "The Daily Star",
    date: "June 2014",
    description: "Historic first participation from Bangladesh",
    image: "/placeholder.svg?height=400&width=600&text=Daily+Star+2014",
    link: "#",
  },
  {
    year: "2014",
    type: "print",
    title: "MIST Students Break New Ground",
    outlet: "Prothom Alo",
    date: "June 2014",
    description: "Feature on pioneering robotics team",
    image: "/placeholder.svg?height=400&width=600&text=Prothom+Alo+2014",
    link: "#",
  },
  {
    year: "2014",
    type: "online",
    title: "Young Engineers Aim for Mars",
    outlet: "bdnews24.com",
    date: "May 2014",
    description: "Pre-competition coverage and team profiles",
    image: "/placeholder.svg?height=400&width=600&text=Online+2014",
    link: "#",
  },
];

export default function MediaPage() {
  const [selectedYear, setSelectedYear] = useState("all");

  const filteredMedia =
    selectedYear === "all"
      ? mediaItems
      : mediaItems.filter((item) => item.year === selectedYear);

  const years = ["all", "2024", "2023", "2021", "2014"];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="fade-up">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Media Coverage & Press
              </h1>
              <p className="text-xl text-muted-foreground">
                Showcasing our journey through national and international media
                recognition
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ScrollAnimation animation="fade-up" delay={0.1}>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">
                  Media Features
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={0.2}>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">15+</div>
                <div className="text-sm text-muted-foreground">
                  TV Appearances
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={0.3}>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">25+</div>
                <div className="text-sm text-muted-foreground">
                  Print Articles
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={0.4}>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">10+</div>
                <div className="text-sm text-muted-foreground">
                  Online Features
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Media Gallery */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <TabsList className="grid grid-cols-4 w-full md:w-auto">
                <TabsTrigger value="all" className="gap-2">
                  <Globe className="h-4 w-4" />
                  All
                </TabsTrigger>
                <TabsTrigger value="tv" className="gap-2">
                  <Tv className="h-4 w-4" />
                  TV
                </TabsTrigger>
                <TabsTrigger value="print" className="gap-2">
                  <Newspaper className="h-4 w-4" />
                  Print
                </TabsTrigger>
                <TabsTrigger value="online" className="gap-2">
                  <Globe className="h-4 w-4" />
                  Online
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
                {years.map((year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedYear(year)}
                    className="whitespace-nowrap"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {year === "all" ? "All Years" : year}
                  </Button>
                ))}
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              <MediaGrid items={filteredMedia} />
            </TabsContent>

            <TabsContent value="tv" className="mt-0">
              <MediaGrid
                items={filteredMedia.filter((item) => item.type === "tv")}
              />
            </TabsContent>

            <TabsContent value="print" className="mt-0">
              <MediaGrid
                items={filteredMedia.filter((item) => item.type === "print")}
              />
            </TabsContent>

            <TabsContent value="online" className="mt-0">
              <MediaGrid
                items={filteredMedia.filter((item) => item.type === "online")}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Press Kit Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="fade-up">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Press Kit</h2>
              <p className="text-muted-foreground mb-8">
                Download our official press kit including logos, team photos,
                and fact sheets
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg">Download Press Kit</Button>
                <Button size="lg" variant="outline">
                  Media Contact
                </Button>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}

function MediaGrid({ items }: { items: typeof mediaItems }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No media coverage found for the selected filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <ScrollAnimation key={index} animation="fade-up" delay={index * 0.1}>
          <div className="group bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="relative aspect-video overflow-hidden">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs font-medium">
                  {item.year}
                </span>
                <span className="px-3 py-1 bg-primary/90 text-primary-foreground backdrop-blur-sm rounded-full text-xs font-medium flex items-center gap-1">
                  {item.type === "tv" && <Tv className="h-3 w-3" />}
                  {item.type === "print" && <Newspaper className="h-3 w-3" />}
                  {item.type === "online" && <Globe className="h-3 w-3" />}
                  {item.type.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="text-sm text-muted-foreground mb-2">
                {item.outlet}
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {item.date}
                </span>
                <Button variant="ghost" size="sm" className="gap-2">
                  Read More
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      ))}
    </div>
  );
}
