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
export const memberAtEnum = z.enum([
  "LT",
  "FA",
  "MT",
  "ET",
  "ST",
  "ScT",
  "MgT",
  "CT",
]);

export const CreateSponsorshipPlanSchema = z.object({
  name: z.string().max(100),
  subtitle: z.string().max(100).optional(),
  price: z.number().int(),
  priceLabel: z.string().max(100).optional(),
  iconType: z.string().max(50),
  iconColor: z.string().max(50),
  iconBgColor: z.string().max(50),
  borderColor: z.string().max(50).optional(),
  isPopular: z.boolean(),
  displayOrder: z.number(),
  benefits: z.string().array(),
  isActive: z.boolean(),
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
  tag: z.string().array(),
  description: z.string().min(1, "Description is required"),
  weight: z.string().min(1, "Weight is required"),
  power: z.string().min(1, "Power is required"),
  arm: z.string().min(1, "Arm details are required"),
  dimentions: z.string().min(1, "Dimensions are required"),
  from: z.date(),
  until: z.date().optional(),
  keyAchievements: z.string().array(),
  features: z.string().array(),
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
  highlights: z.string().array(),
  participationYear: z.date(),
});

export const UpdateCompetitionSchema = CreateCompetitionSchema.partial().extend(
  {
    id: z.string().uuid("Invalid competition ID"),
  }
);

export const memberAtLabels = {
  LT: "Leadership Team",
  FA: "Faculty Advisor",
  MT: "Mechanical Team",
  ET: "Electrical Team",
  ST: "Software Team",
  ScT: "Scientific Team",
  MgT: "Management Team",
  CT: "Communication Team",
};
export type MemberAtKey = keyof typeof memberAtLabels;

export const CreateTeamMemberSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  image: z.string().min(1, "Image URL is required"),
  designation: z.string().min(1, "Designation is required"),
  department: z.string().min(1, "Department is required"),
  memberAt: z.enum(["LT", "FA", "MT", "ET", "ST", "ScT", "MgT", "CT"], {
    required_error: "Member type is required",
  }),
  about: z.string().optional(),
  description: z.string().optional(),
  email: z.string().email("Must be a valid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  from: z.date({
    required_error: "Start date is required",
  }),
  until: z.date().optional(),
});

// Update Team Member Schema - extends Create schema with UUID id
export const UpdateTeamMemberSchema = CreateTeamMemberSchema.extend({
  id: z.string().uuid("Invalid member ID"),
});

// Type exports
export type CreateTeamMemberInput = z.infer<typeof CreateTeamMemberSchema>;
export type UpdateTeamMemberInput = z.infer<typeof UpdateTeamMemberSchema>;
