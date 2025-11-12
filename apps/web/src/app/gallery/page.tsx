import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Wrench,
  Camera,
  Play,
  ExternalLink,
} from "lucide-react";

const galleryCategories = [
  {
    id: "competitions",
    name: "Competitions",
    icon: Trophy,
    description: "Photos from URC, ARC, and ERC competitions around the world",
    images: [
      {
        src: "/placeholder.svg?height=300&width=400&text=URC+2021+Victory",
        title: "URC 2021 Championship Victory",
        description: "Celebrating our historic global championship win",
        date: "2021",
        location: "Virtual Competition",
        category: "URC",
      },
      {
        src: "/placeholder.svg?height=300&width=400&text=ARC+2024+Team",
        title: "ARC 2024 Team Photo",
        description: "Team photo at Anatolian Rover Challenge 2024",
        date: "2024",
        location: "Ankara, Turkey",
        category: "ARC",
      },
      {
        src: "/placeholder.svg?height=300&width=400&text=URC+2024+Rover",
        title: "Aurora X at URC 2024",
        description: "Our rover Aurora X competing in Utah desert",
        date: "2024",
        location: "Utah, USA",
        category: "URC",
      },
      {
        src: "/placeholder.svg?height=300&width=400&text=ARC+2023+Mission",
        title: "ARC 2023 Science Mission",
        description: "Performing science mission tasks in Turkey",
        date: "2023",
        location: "Ankara, Turkey",
        category: "ARC",
      },
      {
        src: "/placeholder.svg?height=300&width=400&text=ERC+2016+Debut",
        title: "ERC 2016 European Debut",
        description: "Our first European competition experience",
        date: "2016",
        location: "Kielce, Poland",
        category: "ERC",
      },
      {
        src: "/placeholder.svg?height=300&width=400&text=URC+2015+Best+Asian",
        title: "URC 2015 Best Asian Team",
        description: "Receiving Best Asian Team award",
        date: "2015",
        location: "Utah, USA",
        category: "URC",
      },
    ],
  },
  {
    id: "development",
    name: "Rover Development",
    icon: Wrench,
    description: "Behind-the-scenes photos of rover design and manufacturing",
    images: [
      {
        src: "/placeholder.svg?height=300&width=400&text=Aurora+X+Assembly",
        title: "Aurora X Assembly Process",
        description: "Team working on Aurora X rover assembly",
        date: "2024",
        location: "MIST Workshop",
        category: "Manufacturing",
      },
      {
        src: "/placeholder.svg?height=300&width=400&text=Robotic+Arm+Testing",
        title: "Robotic Arm Testing",
        description: "Testing the precision of our 6-DOF robotic arm",
        date: "2024",
        location: "MIST Lab",
        category: "Testing",
      },
      {
        src: "/placeholder.svg?height=300&width=400&text=Electronics+Integration",
        title: "Electronics Integration",
        description: "Integrating complex electronic systems",
        date: "2024",
        location: "MIST Workshop",
        category: "Electronics",
      },
      {
        src: "/placeholder.svg?height=300&width=400&text=Chassis+Manufacturing",
        title: "Chassis Manufacturing",
        description: "Precision manufacturing of rover chassis",
        date: "2023",
        location: "MIST Workshop",
        category: "Manufacturing",
      },
      {
        src: "/placeholder.svg?height=300&width=400&text=Software+Development",
        title: "Software Development Session",
        description: "Team coding autonomous navigation algorithms",
        date: "2024",
        location: "MIST Computer Lab",
        category: "Software",
      },
      {
        src: "/placeholder.svg?height=300&width=400&text=Field+Testing",
        title: "Field Testing Aurora X",
        description: "Testing rover capabilities in outdoor environment",
        date: "2024",
        location: "MIST Campus",
        category: "Testing",
      },
    ],
  },
  {
    id: "events",
    name: "Team Events",
    icon: Users,
    description: "Team meetings, workshops, celebrations, and special events",
    images: [
      {
        src: "/placeholder.svg?height=300&width=400&text=Team+Meeting",
        title: "Weekly Team Meeting",
        description: "Regular team coordination and planning session",
        date: "2024",
        location: "MIST Conference Room",
        category: "Meeting",
      },
      {
        src: "/placeholder.svg?height=300&width=400&text=Workshop+Session",
        title: "Technical Workshop",
        description: "Hands-on workshop on rover technologies",
        date: "2024",
        location: "MIST Workshop",
        category: "Workshop",
      },
      {
        src: "/placeholder.svg?height=300&width=400&text=Victory+Celebration",
        title: "Championship Celebration",
        description: "Celebrating URC 2021 global championship",
        date: "2021",
        location: "MIST Campus",
        category: "Celebration",
      },
      {
        src: "/placeholder.svg?height=300&width=400&text=New+Member+Orientation",
        title: "New Member Orientation",
        description: "Welcoming new team members",
        date: "2024",
        location: "MIST Auditorium",
        category: "Orientation",
      },
      {
        src: "/placeholder.svg?height=300&width=400&text=Alumni+Meetup",
        title: "Alumni Reunion",
        description: "Meeting with former team members",
        date: "2023",
        location: "MIST Campus",
        category: "Alumni",
      },
      {
        src: "/placeholder.svg?height=300&width=400&text=Sponsor+Meeting",
        title: "Sponsor Presentation",
        description: "Presenting to potential sponsors",
        date: "2024",
        location: "MIST Presentation Hall",
        category: "Sponsor",
      },
    ],
  },
  {
    id: "media",
    name: "Media Coverage",
    icon: Camera,
    description: "TV interviews, newspaper features, and media appearances",
    images: [
      {
        src: "/placeholder.svg?height=300&width=400&text=TV+Interview",
        title: "National TV Interview",
        description: "Team leader interviewed on national television",
        date: "2021",
        location: "TV Studio",
        category: "TV",
      },
      {
        src: "/placeholder.svg?height=300&width=400&text=Newspaper+Feature",
        title: "Newspaper Feature Story",
        description: "Front page coverage of our achievements",
        date: "2021",
        location: "Print Media",
        category: "Print",
      },
      {
        src: "/placeholder.svg?height=300&width=400&text=Documentary+Filming",
        title: "Documentary Filming",
        description: "Behind-the-scenes documentary production",
        date: "2024",
        location: "MIST Campus",
        category: "Documentary",
      },
      {
        src: "/placeholder.svg?height=300&width=400&text=Press+Conference",
        title: "Press Conference",
        description: "Announcing URC 2025 participation",
        date: "2024",
        location: "MIST Press Room",
        category: "Press",
      },
      {
        src: "/placeholder.svg?height=300&width=400&text=Online+Interview",
        title: "Online Interview Session",
        description: "Virtual interview with international media",
        date: "2023",
        location: "Virtual",
        category: "Online",
      },
      {
        src: "/placeholder.svg?height=300&width=400&text=Award+Ceremony",
        title: "Award Ceremony Coverage",
        description: "Media coverage of award ceremony",
        date: "2022",
        location: "Award Venue",
        category: "Award",
      },
    ],
  },
];

const videos = [
  {
    title: "URC 2021 Championship Highlights",
    description: "Highlights from our historic global championship victory",
    thumbnail: "/placeholder.svg?height=200&width=300&text=URC+2021+Video",
    duration: "5:32",
    date: "2021",
    url: "#",
  },
  {
    title: "Aurora X Rover Showcase",
    description: "Complete overview of our latest rover Aurora X",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Aurora+X+Video",
    duration: "8:15",
    date: "2024",
    url: "#",
  },
  {
    title: "Team Documentary",
    description: "Behind-the-scenes look at MIST Mongol Barota",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Documentary",
    duration: "12:45",
    date: "2023",
    url: "#",
  },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6">
              Gallery
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Capturing Our
              <span className="text-primary block">Journey to Mars</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Explore our visual journey from competitions around the world to
              behind-the-scenes rover development and team moments that define
              our mission.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Tabs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="competitions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-12">
              {galleryCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-sm"
                >
                  <category.icon className="w-4 h-4 mr-2" />
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {galleryCategories.map((category) => (
              <TabsContent
                key={category.id}
                value={category.id}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {category.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.images.map((image, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="relative aspect-video">
                        <Image
                          src={image.src || "/placeholder.svg"}
                          alt={image.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        <div className="absolute top-2 right-2">
                          <Badge
                            variant="secondary"
                            className="bg-background/90 text-xs"
                          >
                            {image.category}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-1">
                          {image.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {image.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {image.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {image.location}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Video Gallery */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Video Gallery
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Watch our journey through competitions, rover development, and
              team achievements
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="relative aspect-video">
                  <Image
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <Button
                      asChild
                      size="lg"
                      className="bg-primary/90 hover:bg-primary text-white rounded-full w-16 h-16 p-0"
                    >
                      <Link href={video.url}>
                        <Play className="w-6 h-6 ml-1" />
                      </Link>
                    </Button>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <Badge
                      variant="secondary"
                      className="bg-black/70 text-white text-xs"
                    >
                      {video.duration}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{video.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {video.date}
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={video.url}>
                        Watch
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link
                href="https://www.youtube.com/@marsroverteammist9242"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Our YouTube Channel
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Gallery Statistics
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Our visual journey documented across years of competitions and
              development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">
                  Photos Captured
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">
                  Videos Produced
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">8+</div>
                <div className="text-sm text-muted-foreground">
                  Countries Visited
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">12+</div>
                <div className="text-sm text-muted-foreground">
                  Years Documented
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
