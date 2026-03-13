import {
  Star,
  Heart,
  Crown,
  Award,
  Zap,
  HelpCircle,
  Target,
  Users,
  Lightbulb,
  Globe,
  Building,
  Megaphone,
  Handshake,
  TrendingUp,
  Gift,
  BarChart,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Youtube,
  Clock,
  Trophy,
  Medal,
  Flame,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Star,
  Heart,
  Crown,
  Award,
  Zap,
  Target,
  Users,
  Lightbulb,
  Globe,
  Building,
  Megaphone,
  Handshake,
  TrendingUp,
  Gift,
  BarChart,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Youtube,
  Clock,
  Trophy,
  Medal,
  Flame,
};

export const renderIcon = (iconType: string, iconColor: string) => {
  const IconComponent = iconMap[iconType];

  if (!IconComponent) {
    return <HelpCircle color={iconColor} size={24} />;
  }

  return <IconComponent color={iconColor} size={24} />;
};

export default function RenderIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    return <HelpCircle className={className} />;
  }
  return <IconComponent className={className} />;
}
