import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import {
  Users,
  Lightbulb,
  Trophy,
  Rocket,
  CheckCircle,
  ArrowRight,
  Mail,
  Calendar,
} from "lucide-react";

const benefits = [
  {
    icon: Trophy,
    title: "Global Competition Experience",
    description:
      "Participate in prestigious international competitions like URC and ARC",
  },
  {
    icon: Lightbulb,
    title: "Cutting-edge Technology",
    description:
      "Work with advanced robotics, AI, and space exploration technologies",
  },
  {
    icon: Users,
    title: "Collaborative Environment",
    description:
      "Join a multidisciplinary team of passionate engineers and researchers",
  },
  {
    icon: Rocket,
    title: "Career Development",
    description:
      "Build skills that are highly valued in aerospace and robotics industries",
  },
];

const requirements = [
  {
    category: "Academic",
    items: [
      "Currently enrolled at MIST",
      "Strong academic performance",
      "Relevant engineering background",
      "Commitment to team activities",
    ],
  },
  {
    category: "Technical Skills",
    items: [
      "Programming (Python, C++, ROS)",
      "CAD design (SolidWorks, Fusion 360)",
      "Electronics and circuit design",
      "Mechanical design and manufacturing",
    ],
  },
  {
    category: "Soft Skills",
    items: [
      "Problem-solving mindset",
      "Team collaboration",
      "Communication skills",
      "Time management",
    ],
  },
];

const subTeamOpportunities = [
  {
    name: "Mechanical Team",
    description:
      "Design and manufacture rover chassis, robotic arms, and mechanical systems",
    skills: [
      "CAD Design",
      "Manufacturing",
      "Materials Science",
      "Mechanical Analysis",
    ],
    openPositions: 3,
  },
  {
    name: "Electrical Team",
    description:
      "Develop power systems, circuit boards, and electrical component integration",
    skills: [
      "Circuit Design",
      "PCB Development",
      "Power Systems",
      "Embedded Systems",
    ],
    openPositions: 2,
  },
  {
    name: "Software & Communication",
    description:
      "Create software systems, communication protocols, and user interfaces",
    skills: [
      "Programming",
      "Communication Systems",
      "UI/UX Design",
      "System Integration",
    ],
    openPositions: 4,
  },
  {
    name: "Rover Autonomy and Navigation",
    description:
      "Develop AI systems, computer vision, and autonomous navigation capabilities",
    skills: [
      "Machine Learning",
      "Computer Vision",
      "AI Development",
      "Navigation Systems",
    ],
    openPositions: 2,
  },
  {
    name: "Science Team",
    description:
      "Handle scientific analysis, sample testing, and research methodologies",
    skills: [
      "Chemistry",
      "Data Analysis",
      "Research Methods",
      "Scientific Writing",
    ],
    openPositions: 2,
  },
  {
    name: "Management Team",
    description:
      "Manage operations, media relations, finance, and team coordination",
    skills: ["Project Management", "Communication", "Finance", "Marketing"],
    openPositions: 2,
  },
];

const applicationProcess = [
  {
    step: 1,
    title: "Submit Application",
    description:
      "Fill out our online application form with your details and motivation",
  },
  {
    step: 2,
    title: "Technical Assessment",
    description:
      "Complete a technical assessment relevant to your chosen sub-team",
  },
  {
    step: 3,
    title: "Interview",
    description:
      "Participate in an interview with team leaders and faculty advisors",
  },
  {
    step: 4,
    title: "Orientation",
    description:
      "Attend orientation sessions and begin your journey with the team",
  },
];

export default function JoinPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6">
              <Users className="w-4 h-4 mr-2" />
              Join Our Team
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Shape the Future of
              <span className="text-primary block">Mars Exploration</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Join MIST Mongol Barota and be part of Bangladesh's premier Mars
              rover team. Work on cutting-edge technology, compete globally, and
              make history in space exploration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <Link href="#application-process">
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Join MIST Mongol Barota?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Discover the unique opportunities and experiences that await you
              as part of our team
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-team Opportunities */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Available Positions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Explore opportunities across our specialized sub-teams and find
              where your skills fit best
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subTeamOpportunities.map((team, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{team.name}</h3>
                    <Badge variant="secondary">
                      {team.openPositions} positions
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {team.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Required Skills:</h4>
                      <div className="flex flex-wrap gap-1">
                        {team.skills.map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      asChild
                      className="w-full bg-transparent"
                      variant="outline"
                    >
                      <Link href="#application-process">
                        Apply for This Team
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What We're Looking For
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              The skills and qualifications that will help you succeed as part
              of our team
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {requirements.map((req, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <h3 className="text-xl font-semibold text-center">
                    {req.category}
                  </h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {req.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section id="application-process" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Application Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Follow these simple steps to join our team and start your journey
              in Mars exploration
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {applicationProcess.map((step, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                      {step.step}
                    </div>
                    <h3 className="font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Current Recruitment */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-primary text-primary-foreground">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">
                Recruitment Drive 2024-2025
              </h2>
              <p className="text-lg mb-6 opacity-90">
                We're actively recruiting passionate students for our URC 2025
                campaign. Join us in making history!
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex justify-center items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Applications Open: Now</span>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Deadline: Rolling Basis</span>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Start Date: Immediate</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Apply Now
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  <Link href="mailto:jawadrahman483@gmail.com">
                    Contact Team Leader
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Common questions about joining our team
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">
                  Do I need prior robotics experience?
                </h3>
                <p className="text-muted-foreground text-sm">
                  While prior experience is helpful, it's not required. We
                  provide training and mentorship to help you develop the
                  necessary skills.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">
                  How much time commitment is required?
                </h3>
                <p className="text-muted-foreground text-sm">
                  We expect 10-15 hours per week during regular periods, with
                  increased commitment during competition seasons.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">
                  Can students from all departments join?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Yes! We welcome students from CSE, EEE, ME, PME, and other
                  engineering departments. Diversity strengthens our team.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">
                  Are there opportunities for international travel?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Selected team members get opportunities to travel for
                  international competitions like URC in Utah and ARC in Turkey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
