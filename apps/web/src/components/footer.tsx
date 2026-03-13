import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { Facebook, Instagram, Mail, MapPin, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  "Quick Links": [
    { name: "About Us", href: "/about" },
    { name: "Our Rovers", href: "/rovers" },
    { name: "Competitions", href: "/competitions" },
    { name: "Achievements", href: "/achievements" },
  ],
  Resources: [
    { name: "News", href: "/news" },
    { name: "Media Coverage", href: "/media" },
  ],
  Support: [
    { name: "Become a Sponsor", href: "/sponsors" },
    { name: "Donate", href: "/support" },
    { name: "Contact Us", href: "/contact" },
  ],
};

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/mongolbarota.mist",
    icon: Facebook,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/mist_mongolbarota",
    icon: Instagram,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@marsroverteammist9242",
    icon: Youtube,
  },
  {
    name: "Email",
    href: "mailto:mars.rover.mist@gmail.com",
    icon: Mail,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-secondary/95 text-secondary-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="space-y-6 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border/60 bg-white p-2.5">
                <Image
                  src="/footer_logo.webp"
                  alt="MIST Mongol Barota Logo"
                  width={70}
                  height={70}
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <div className="text-lg font-semibold tracking-wide">MIST</div>
                <div className="text-sm font-bold tracking-[0.16em] text-primary">
                  MONGOL BAROTA
                </div>
              </div>
            </Link>

            <p className="text-secondary-foreground/80 max-w-md text-pretty">
              Pioneering Mars exploration from Bangladesh. We are MIST's premier
              robotics team, competing globally and pushing the boundaries of
              space technology.
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Mirpur Cantonment, Dhaka-1216, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>mars.rover.mist@gmail.com</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  asChild
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-border/40 bg-background/40 hover:bg-primary/10"
                >
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="w-5 h-5" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h3 className="text-base font-semibold tracking-wide">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-secondary-foreground/80 transition-colors hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-secondary-foreground/20" />

        <div className="flex justify-center items-center">
          <div className="text-sm text-secondary-foreground text-center">
            © MIST Mongol Barota. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
