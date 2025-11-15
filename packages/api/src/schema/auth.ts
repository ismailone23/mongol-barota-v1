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
export const MemberAt = z.enum([
  "LT",
  "FA",
  "MT",
  "ET",
  "ST",
  "ScT",
  "MgT",
  "CT",
]);
export const CreateTeamMemberSchema = z.object({
  name: z.string(),
  image: z.string(),
  designation: z.string(),
  department: z.string(),
  memberAt: MemberAt,
  about: z.string(),
  description: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  linkedin: z.string().nullable(),
  github: z.string().nullable(),
  from: z.date(),
  until: z.date().nullable(),
});

// For updating (id required)
export const UpdateTeamMemberSchema = CreateTeamMemberSchema.extend({
  id: z.string(),
});

export const CreateSponsorshipPlanSchema = z.object({
  name: z.string().max(100),
  subtitle: z.string().max(100).optional(),
  price: z.number().int(),
  priceLabel: z.string().max(100).optional(),
  iconType: z.string().max(50),
  iconColor: z.string().max(50),
  iconBgColor: z.string().max(50),
  borderColor: z.string().max(50).optional(),
  isPopular: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  benefits: z.string().array().default([]),
  isActive: z.boolean().default(false),
});

export const UpdateSponsorshipPlanSchema =
  CreateSponsorshipPlanSchema.partial().extend({
    id: z.string().uuid(),
  });
export const CreateSponsorSchema = z.object({
  sponsorCompanyName: z.string().min(1, "Company name is required"),
  sponsorCompanyDesctiption: z.string().min(1, "Description is required"),
  sponsorCompanyWebsite: z.string().url("Invalid website URL"),
  sponsorCompanylogo: z.string().url("Invalid logo URL"),
  sponsorshipPlan: z.string().uuid("Invalid sponsorship plan ID"),
  competitionId: z.string().uuid("Invalid competition ID").optional(),
});

export const UpdateSponsorSchema = CreateSponsorSchema.partial().extend({
  sponsorId: z.string().uuid("Invalid sponsor ID"),
});

export const CreateRoverSchema = z.object({
  image: z.string().url("Invalid image URL"),
  name: z.string().min(1, "Rover name is required").max(100),
  tag: z.string().min(1, "Tag is required").max(100),
  description: z.string().min(1, "Description is required"),
  weight: z.string().min(1, "Weight is required"),
  power: z.string().min(1, "Power is required"),
  arm: z.string().min(1, "Arm details are required"),
  dimentions: z.string().min(1, "Dimensions are required"),
  from: z.date(),
  until: z.date().optional(),
  keyAchievements: z.string().array().default([]),
  features: z.string().array().default([]),
});

export const UpdateRoverSchema = CreateRoverSchema.partial().extend({
  id: z.string().uuid("Invalid rover ID"),
});

export const competitionRegions = [
  "University Rover Challenge",
  "Anatolian Rover Challenge",
  "European Rover Challenge",
] as const;

export const CreateCompetitionSchema = z.object({
  competitionRegionName: z.enum(competitionRegions, {
    required_error: "Please select a competition region",
  }),
  competitionName: z.string().min(1, "Competition name is required"),
  competitionDescription: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  roverId: z.string().uuid("Invalid rover ID"),
  competitionResult: z.string().min(1, "Result is required"),
  featured: z.boolean().default(false),
  image: z.string().url("Invalid image URL"),
  color: z.string().min(1, "Color is required"),
  bgColor: z.string().min(1, "Background color is required"),
  icon: z.string().min(1, "Icon is required"),
  highlights: z.string().array().default([]),
  participationYear: z.date(),
});

export const UpdateCompetitionSchema = CreateCompetitionSchema.partial().extend(
  {
    id: z.string().uuid("Invalid competition ID"),
  }
);
