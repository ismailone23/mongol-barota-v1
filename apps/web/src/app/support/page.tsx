import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import Link from "next/link";
import {
  Heart,
  DollarSign,
  Wrench,
  Users,
  Mail,
  Phone,
  MapPin,
  Target,
  Trophy,
  Rocket,
} from "lucide-react";

const supportOptions = [
  {
    icon: DollarSign,
    title: "Financial Support",
    description:
      "Direct monetary contributions to fund rover development and competition participation",
    examples: [
      "Competition registration fees",
      "Travel and accommodation",
      "Component purchases",
      "Manufacturing costs",
    ],
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: Wrench,
    title: "Equipment & Materials",
    description:
      "Donate components, tools, or materials needed for rover construction",
    examples: [
      "Electronic components",
      "Mechanical parts",
      "Manufacturing tools",
      "Testing equipment",
    ],
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: Users,
    title: "Technical Expertise",
    description:
      "Share your knowledge and experience through mentorship and guidance",
    examples: [
      "Technical consultations",
      "Design reviews",
      "Skill workshops",
      "Career guidance",
    ],
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    icon: Target,
    title: "Facility Access",
    description:
      "Provide access to specialized facilities for testing and development",
    examples: [
      "Testing grounds",
      "Manufacturing facilities",
      "Laboratory access",
      "Workshop space",
    ],
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
];

const impactAreas = [
  {
    icon: Trophy,
    title: "Competition Success",
    description:
      "Help us achieve excellence in international rover competitions",
    impact:
      "Your support directly contributes to our competitive edge and global recognition",
  },
  {
    icon: Rocket,
    title: "Technology Innovation",
    description: "Advance Mars exploration technology and robotics research",
    impact:
      "Support cutting-edge research that pushes the boundaries of space technology",
  },
  {
    icon: Users,
    title: "Student Development",
    description: "Empower the next generation of engineers and researchers",
    impact:
      "Invest in students who will become tomorrow's space exploration leaders",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6">
              Support Our Mission
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Help Us Reach
              <span className="text-primary block">Mars Together</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Join us in our mission to advance Mars exploration technology.
              Your support helps us compete globally, innovate boldly, and
              inspire the next generation of space explorers from Bangladesh.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Heart className="w-4 h-4 mr-2" />
                Support Now
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Get In Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Impact</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              See how your support creates lasting impact in space exploration
              and education
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {impactAreas.map((area, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg mb-6">
                    <area.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{area.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {area.description}
                  </p>
                  <p className="text-sm text-primary font-medium">
                    {area.impact}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ways to Support
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Choose how you'd like to contribute to our Mars exploration
              mission
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {supportOptions.map((option, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 ${option.bgColor} rounded-lg mb-6`}
                  >
                    <option.icon className={`w-6 h-6 ${option.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{option.title}</h3>
                  <p className="text-muted-foreground mb-6">
                    {option.description}
                  </p>
                  <div>
                    <h4 className="font-semibold mb-3">Examples:</h4>
                    <ul className="space-y-2">
                      {option.examples.map((example, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get Involved
              </h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Ready to support our mission? Fill out the form below and we'll
                get in touch with you.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Support Interest Form</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      placeholder="Company/Organization name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+880 1XXX XXXXXX" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-type">Type of Support</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Select support type</option>
                    <option value="financial">Financial Support</option>
                    <option value="equipment">Equipment & Materials</option>
                    <option value="expertise">Technical Expertise</option>
                    <option value="facility">Facility Access</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about how you'd like to support our mission..."
                    rows={4}
                  />
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90">
                  Submit Support Request
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Contact Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Have questions about supporting us? Get in touch with our team
              directly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-6">
                <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  General inquiries and support
                </p>
                <Link
                  href="mailto:mars.rover.mist@gmail.com"
                  className="text-primary hover:underline text-sm"
                >
                  mars.rover.mist@gmail.com
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Team Leader
                </p>
                <Link
                  href="tel:+8801538257003"
                  className="text-primary hover:underline text-sm"
                >
                  +8801778665529
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Visit Us</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  MIST Campus
                </p>
                <p className="text-sm text-primary">
                  Mirpur Cantonment
                  <br />
                  Dhaka-1216, Bangladesh
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
