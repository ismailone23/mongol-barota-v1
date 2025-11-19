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
  featured: z.boolean(),
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
  desctiption: z.string(),
  website: z.string(),
  logo: z.string(),
  plan: z.string().uuid(),
  competitionId: z.string().uuid(),
});

export const UpdateSponsorSchema = CreateSponsorSchema.extend({
  id: z.string().uuid(),
});
