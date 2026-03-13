"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { Separator } from "@workspace/ui/components/separator";
import {
  Trophy,
  Users,
  Bot,
  Handshake,
  CreditCard,
  ShieldCheck,
  LogOut,
  FileText,
  Clock,
  LayoutList,
  Newspaper,
  Image,
  Radio,
  BookOpen,
  UserPlus,
} from "lucide-react";

const navItems = [
  { title: "Accounts", href: "/", icon: ShieldCheck },
  { title: "Competitions", href: "/competitions", icon: Trophy },
  { title: "Rovers", href: "/rovers", icon: Bot },
  { title: "Team", href: "/team", icon: Users },
  { title: "Sponsors", href: "/sponsors", icon: Handshake },
  { title: "Plans", href: "/plans", icon: CreditCard },
  { title: "Site Content", href: "/site-content", icon: FileText },
  { title: "Timeline", href: "/timeline", icon: Clock },
  { title: "Content Items", href: "/content-items", icon: LayoutList },
  { title: "News", href: "/news", icon: Newspaper },
  { title: "Media", href: "/media", icon: Radio },
  { title: "Gallery", href: "/gallery", icon: Image },
  { title: "Research", href: "/research", icon: BookOpen },
  { title: "Join", href: "/join", icon: UserPlus },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold tracking-tight">
              Mongol Barota
            </span>
          </Link>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          {session?.user?.email && (
            <p className="text-xs text-muted-foreground truncate mb-2">
              {session.user.email}
            </p>
          )}
          <SidebarMenuButton
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="w-full text-destructive hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-sm font-medium">
            {navItems.find((n) => n.href === pathname)?.title ?? "Dashboard"}
          </h1>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
