import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Calendar, ArrowLeft, Share2, Clock, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

const newsArticles = {
  "urc-2025-results": {
    id: "urc-2025-results",
    date: "2025-06-01",
    title: "Team Achieves 14th Position in URC 2025",
    category: "Achievement",
    author: "Team Mongol Barota",
    readTime: "5 min read",
    image: "/placeholder.svg?height=600&width=1200&text=URC+2025",
    content: `
      <p class="lead">MIST Mongol Barota has successfully completed the University Rover Challenge 2025, securing the 14th position worldwide among top international teams. The competition, held at the Mars Desert Research Station in Utah, USA, tested our rover Aurora X across multiple challenging missions.</p>

      <h2>Competition Highlights</h2>
      <p>Our team demonstrated exceptional performance in several key areas:</p>
      <ul>
        <li>Autonomous navigation through complex terrain</li>
        <li>Precision robotic arm operations</li>
        <li>Science mission execution</li>
        <li>Equipment servicing tasks</li>
      </ul>

      <h2>Team Performance</h2>
      <p>Despite facing tough competition from over 100 teams worldwide, our team showcased Bangladesh's growing capabilities in robotics and space technology. This achievement marks another milestone in our journey to represent our nation on the global stage.</p>

      <blockquote>
        <p>"This achievement is a testament to the dedication and hard work of every team member. We are proud to represent Bangladesh on the international stage and inspire the next generation of engineers."</p>
        <footer>— Raisul Islam Rahad, Team Lead</footer>
      </blockquote>

      <h2>Looking Forward</h2>
      <p>With valuable experience gained from URC 2025, we are now preparing for URC 2026 with our next-generation rover, Aurora X-II, which will feature enhanced AI capabilities and improved mechanical systems.</p>
    `,
  },
  "arc-2024-runner-up": {
    id: "arc-2024-runner-up",
    date: "2024-09-15",
    title: "Team Wins ARC 2024 Runner-up Position",
    category: "Achievement",
    author: "Team Mongol Barota",
    readTime: "4 min read",
    image: "/placeholder.svg?height=600&width=1200&text=ARC+2024",
    content: `
      <p class="lead">MIST Mongol Barota has achieved a remarkable 2nd place finish in the Anatolian Rover Challenge 2024, held in Ankara, Turkey. This outstanding performance demonstrates our team's consistent excellence in international robotics competitions.</p>

      <h2>Competition Overview</h2>
      <p>The Anatolian Rover Challenge brought together top teams from around the world to compete in Mars-analog missions. Our rover Aurora X performed exceptionally well across all mission categories.</p>

      <h2>Key Achievements</h2>
      <ul>
        <li>2nd position overall among international teams</li>
        <li>Excellent scores in autonomous navigation</li>
        <li>Outstanding performance in science mission</li>
        <li>Successful completion of all tasks</li>
      </ul>

      <h2>Team Spirit</h2>
      <p>This achievement is a testament to the hard work, dedication, and innovative spirit of our team members. We continue to push the boundaries of what's possible in student robotics.</p>

      <blockquote>
        <p>"Competing in Turkey was an incredible experience. The level of competition was intense, and we're honored to have secured the runner-up position."</p>
        <footer>— Team Mongol Barota</footer>
      </blockquote>
    `,
  },
  "urc-2026-announcement": {
    id: "urc-2026-announcement",
    date: "2025-01-10",
    title: "Preparing for URC 2026 with Aurora X-II",
    category: "Competition",
    author: "Team Mongol Barota",
    readTime: "6 min read",
    image: "/placeholder.svg?height=600&width=1200&text=Aurora+X-II",
    content: `
      <p class="lead">MIST Mongol Barota is excited to announce our participation in the University Rover Challenge 2026 with our newest rover, Aurora X-II. This next-generation rover represents a significant leap forward in our technological capabilities.</p>

      <h2>Aurora X-II Features</h2>
      <p>Our new rover incorporates cutting-edge technology:</p>
      <ul>
        <li>Advanced AI-powered autonomous navigation</li>
        <li>Enhanced 6-DOF robotic arm with improved precision</li>
        <li>Upgraded science analysis module</li>
        <li>Improved power management system</li>
        <li>Enhanced communication systems</li>
      </ul>

      <h2>Development Timeline</h2>
      <p>The team is currently in the intensive development phase, with the System Acceptance Review (SAR) submission scheduled for February 27, 2026. The final competition will take place from May 27-30, 2026, in Utah, USA.</p>

      <h2>Budget and Support</h2>
      <p>The total development budget for Aurora X-II is BDT 14,11,400. We are actively seeking sponsorship support to ensure our participation and success in this prestigious international competition.</p>

      <blockquote>
        <p>"Aurora X-II represents the culmination of years of learning and innovation. We're confident this rover will showcase the best of what Bangladesh has to offer in robotics technology."</p>
        <footer>— Raisul Islam Rahad, Team Lead</footer>
      </blockquote>

      <h2>Join Our Journey</h2>
      <p>We invite sponsors and supporters to join us in this exciting journey. Your support will help us represent Bangladesh on the global stage and inspire the next generation of engineers and innovators.</p>
    `,
  },
};

export function generateStaticParams() {
  return Object.keys(newsArticles).map((slug) => ({
    slug,
  }));
}

export default function NewsArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = newsArticles[params.slug as keyof typeof newsArticles];

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Hero Image with Overlay */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <Image
          src={article.image || "/placeholder.svg"}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-4xl">
              <Badge className="mb-4 bg-primary text-primary-foreground text-sm px-3 py-1">
                {article.category}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance text-white drop-shadow-lg">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{article.author}</span>
                </div>
                <Separator orientation="vertical" className="h-4 bg-white/30" />
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(article.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <Separator orientation="vertical" className="h-4 bg-white/30" />
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{article.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 md:p-12">
              {/* Article Body with Enhanced Typography */}
              <div
                className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:text-foreground
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:pb-3
                  prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-ul:my-6 prose-li:my-2 prose-li:text-muted-foreground
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-accent/50
                  prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                  prose-blockquote:my-8
                  [&_.lead]:text-xl [&_.lead]:text-foreground [&_.lead]:font-medium [&_.lead]:mb-8 [&_.lead]:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              <Separator className="my-12" />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-transparent"
                >
                  <Link href="/news">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to News
                  </Link>
                </Button>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 sm:flex-none bg-transparent"
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    Share
                  </Button>
                  <Button asChild size="lg" className="flex-1 sm:flex-none">
                    <Link href="/support">Support Us</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Articles Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">More News</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.values(newsArticles)
                .filter((a) => a.id !== article.id)
                .slice(0, 2)
                .map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/news/${relatedArticle.id}`}
                    className="group"
                  >
                    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={relatedArticle.image || "/placeholder.svg"}
                          alt={relatedArticle.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-4">
                        <Badge variant="secondary" className="mb-2">
                          {relatedArticle.category}
                        </Badge>
                        <h3 className="font-bold text-lg mb-2 text-balance group-hover:text-primary transition-colors">
                          {relatedArticle.title}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(relatedArticle.date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
