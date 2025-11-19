import {
  Star,
  Heart,
  Crown,
  Award,
  Zap,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Star,
  Heart,
  Crown,
  Award,
  Zap,
};

export const renderIcon = (iconType: string, iconColor: string) => {
  const IconComponent = iconMap[iconType];

  if (!IconComponent) {
    return <HelpCircle color={iconColor} size={24} />;
  }

  return <IconComponent color={iconColor} size={24} />;
};
