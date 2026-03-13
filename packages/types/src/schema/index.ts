import { Region, regionKeys, SubTeam, subTeamKeys } from "@workspace/db/schema";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});
export const RegisterSchema = z.object({
  email: z.string().email(),
  mistid: z.string().min(6),
  password: z.string().min(4),
});

export type SubTeamKey = SubTeam[number];

export const SubTeamRecord: Record<SubTeamKey, string> = {
  LT: "Leadership Team",
  FA: "Faculty Advisor",
  MT: "Mechanical Team",
  ET: "Electrical Team",
  ST: "Software Team",
  ScT: "Science Team",
  MgT: "Management Team",
  CT: "Communications Team",
};
export const SubTeamEnum = z.enum(subTeamKeys);

export const CreateMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
  department: z.string(),
  image: z.string(),
  subTeam: SubTeamEnum,
  bio: z.string().optional(),
  title: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  about: z.string().optional(),
  joined: z.coerce.date().optional(),
  left: z.coerce.date().optional(),
});

export const UpdateMemberSchema = CreateMemberSchema.extend({
  id: z.string().uuid(),
});

export type RegionKey = Region[number];

export const RegionRecord: Record<RegionKey, string> = {
  urc: "University Rover Challenge",
  arc: "Anatolian Rover Challenge",
  erc: "European Rover Challenge",
};
export const RegionEnum = z.enum(regionKeys);

export const CreateCompetitionSchema = z.object({
  teamMemberIds: z.array(z.string().uuid()),
  region: RegionEnum,
  name: z.string(),
  description: z.string(),
  location: z.string(),
  roverId: z.string().uuid(),
  result: z.string(),
  featured: z.boolean().optional(),
  image: z.string(),
  iconColor: z.string(),
  iconBg: z.string(),
  icon: z.string(),
  highlights: z.array(z.string()),
  year: z.coerce.date(),
  score: z.string().optional(),
});
export const UpdateCompetitionSchema = CreateCompetitionSchema.extend({
  id: z.string().uuid(),
});

export const CompetitionMemberManagement = z.object({
  competitionId: z.string().uuid(),
  teamMemberIds: z.array(z.string().uuid()),
  role: z.string().optional(),
});

export const specSchema = z.object({
  weight: z.string(),
  power: z.string(),
  arm: z.string(),
  dimensions: z.string(),
  autonomy: z.string(),
  communications: z.string(),
});

export const CreateRoverSchema = z.object({
  image: z.string(),
  name: z.string().max(100),
  status: z.string(),
  description: z.string(),
  spec: specSchema,
  year: z.coerce.date(),
  ended: z.coerce.date().optional(),
  achievements: z.array(z.string()),
  features: z.array(z.string()),
});

export const UpdateRoverSchema = CreateRoverSchema.extend({
  id: z.string().uuid(),
});

export const CreatePlanSchema = z.object({
  name: z.string().max(100),
  subtitle: z.string().max(100).optional(),
  price: z.number().int(),
  priceLabel: z.string().max(100).optional(),
  icon: z.string().max(50),
  iconColor: z.string().max(50),
  iconBgColor: z.string().max(50),
  borderColor: z.string().max(50).optional(),
  isPopular: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  benefits: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export const UpdatePlanSchema = CreatePlanSchema.extend({
  id: z.string().uuid(),
});

export const CreateSponsorSchema = z.object({
  name: z.string(),
  description: z.string(),
  website: z.string().url(),
  logo: z.string(),
  plan: z.string().uuid(),
  competitionId: z.string().uuid().optional(),
});

export const UpdateSponsorSchema = CreateSponsorSchema.extend({
  id: z.string().uuid(),
});

export const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string(),
  organization: z.string().optional(),
  message: z.string().min(5),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(4),
});

// Site Content
export const ContentSectionEnum = z.enum([
  "core_value",
  "sponsorship_benefit",
  "contact_person",
  "social_link",
  "stat_card",
  "hero_highlight",
]);
export type ContentSection = z.infer<typeof ContentSectionEnum>;

export const ContentSectionRecord: Record<ContentSection, string> = {
  core_value: "Core Value",
  sponsorship_benefit: "Sponsorship Benefit",
  contact_person: "Contact Person",
  social_link: "Social Link",
  stat_card: "Statistic Card",
  hero_highlight: "Hero Highlight",
};

export const CreateSiteContentSchema = z.object({
  key: z.string().min(1).max(100),
  title: z.string().optional(),
  body: z.string().min(1),
  image: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

export const UpdateSiteContentSchema = CreateSiteContentSchema.extend({
  id: z.string().uuid(),
});

export const CreateTimelineEventSchema = z.object({
  year: z.string().min(1).max(10),
  title: z.string().min(1),
  description: z.string().min(1),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const UpdateTimelineEventSchema = CreateTimelineEventSchema.extend({
  id: z.string().uuid(),
});

export const CreateContentItemSchema = z.object({
  section: ContentSectionEnum,
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().max(50).optional(),
  iconColor: z.string().max(50).optional(),
  url: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  image: z.string().optional(),
  category: z.string().max(100).optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const UpdateContentItemSchema = CreateContentItemSchema.extend({
  id: z.string().uuid(),
});

// News Articles
export const CreateNewsArticleSchema = z.object({
  slug: z.string().min(1).max(200),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  body: z.string().optional(),
  category: z.string().min(1).max(100),
  image: z.string().optional(),
  images: z.array(z.string()).default([]),
  publishedAt: z.coerce.date().optional(),
  isPublished: z.boolean().optional(),
});

export const UpdateNewsArticleSchema = CreateNewsArticleSchema.extend({
  id: z.string().uuid(),
});

// Media Coverages
export const CreateMediaCoverageSchema = z.object({
  title: z.string().min(1),
  outlet: z.string().min(1).max(200),
  type: z.enum(["tv", "print", "online"]),
  year: z.string().min(1).max(10),
  date: z.string().min(1).max(50),
  description: z.string().optional(),
  image: z.string().optional(),
  images: z.array(z.string()).default([]),
  link: z.string().optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const UpdateMediaCoverageSchema = CreateMediaCoverageSchema.extend({
  id: z.string().uuid(),
});

// Gallery Categories
export const CreateGalleryCategorySchema = z.object({
  slug: z.string().min(1).max(100),
  name: z.string().min(1).max(100),
  icon: z.string().max(50).optional(),
  description: z.string().optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const UpdateGalleryCategorySchema = CreateGalleryCategorySchema.extend({
  id: z.string().uuid(),
});

// Gallery Images
export const CreateGalleryImageSchema = z.object({
  categoryId: z.string().uuid(),
  src: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.string().max(20).optional(),
  location: z.string().max(200).optional(),
  tag: z.string().max(100).optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const UpdateGalleryImageSchema = CreateGalleryImageSchema.extend({
  id: z.string().uuid(),
});

// Gallery Videos
export const CreateGalleryVideoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  url: z.string().min(1),
  duration: z.string().max(20).optional(),
  date: z.string().max(20).optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const UpdateGalleryVideoSchema = CreateGalleryVideoSchema.extend({
  id: z.string().uuid(),
});

// Research Papers
export const CreateResearchPaperSchema = z.object({
  title: z.string().min(1),
  authors: z.array(z.string()).default([]),
  journal: z.string().min(1).max(200),
  year: z.string().min(1).max(10),
  doi: z.string().max(200).optional(),
  url: z.string().optional(),
  abstract: z.string().optional(),
  keywords: z.array(z.string()).default([]),
  category: z.string().min(1).max(100),
  venue: z.string().optional(),
  pages: z.string().max(50).optional(),
  publisher: z.string().max(200).optional(),
  isOpenAccess: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const UpdateResearchPaperSchema = CreateResearchPaperSchema.extend({
  id: z.string().uuid(),
});

// Recruitment Openings
export const CreateRecruitmentOpeningSchema = z.object({
  teamName: z.string().min(1).max(100),
  description: z.string().min(1),
  skills: z.array(z.string()).default([]),
  openPositions: z.number().int().min(0),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const UpdateRecruitmentOpeningSchema =
  CreateRecruitmentOpeningSchema.extend({
    id: z.string().uuid(),
  });

// FAQs
export const CreateFaqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string().max(100).optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const UpdateFaqSchema = CreateFaqSchema.extend({
  id: z.string().uuid(),
});
