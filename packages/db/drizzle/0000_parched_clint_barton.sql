CREATE TABLE "competition_region" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"competition_region_name" text NOT NULL,
	"competition_desciption" text NOT NULL,
	"competition_location" text NOT NULL,
	"competition_organizer" varchar NOT NULL,
	"organizer_website" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"image" text NOT NULL,
	CONSTRAINT "competition_region_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "participated_competition" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"competition_region_id" uuid NOT NULL,
	"competition_name" text NOT NULL,
	"competition_description" text NOT NULL,
	"competition_location" text NOT NULL,
	"rover_id" uuid NOT NULL,
	"competition_result" text NOT NULL,
	"featured" boolean DEFAULT false,
	"image" text NOT NULL,
	"color" varchar NOT NULL,
	"bg_color" varchar NOT NULL,
	"icon" varchar NOT NULL,
	"competition_highlight" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"participation_year" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "participated_competition_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "rover" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image" text NOT NULL,
	"name" varchar(100) NOT NULL,
	"tag" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"weight" text NOT NULL,
	"power" text NOT NULL,
	"arm" text NOT NULL,
	"dimentions" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"from" timestamp DEFAULT now() NOT NULL,
	"until" timestamp,
	"key_achievements" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"features" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	CONSTRAINT "rover_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "sponsor" (
	"sponsor_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sponsor_company_name" varchar NOT NULL,
	"sponsor_company_desctiption" text NOT NULL,
	"sponsor_company_website" text NOT NULL,
	"sponsor_company_logo" text NOT NULL,
	"sponsorship_plan" uuid NOT NULL,
	"competition_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sponsor_sponsor_id_unique" UNIQUE("sponsor_id")
);
--> statement-breakpoint
CREATE TABLE "sponsorship_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"subtitle" varchar(100),
	"price" integer NOT NULL,
	"price_label" varchar(100),
	"icon_type" varchar(50) NOT NULL,
	"icon_color" varchar(50) NOT NULL,
	"icon_bg_color" varchar(50) NOT NULL,
	"border_color" varchar(50),
	"is_popular" boolean DEFAULT false,
	"display_order" integer DEFAULT 0 NOT NULL,
	"benefits" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sponsorship_plans_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "team_member_competitions" (
	"team_member_id" uuid NOT NULL,
	"competition_id" uuid NOT NULL,
	"role" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image" text NOT NULL,
	"name" varchar(100) NOT NULL,
	"designation" varchar NOT NULL,
	"department" varchar NOT NULL,
	"member_at" text NOT NULL,
	"description" text,
	"email" varchar,
	"phone" varchar,
	"linkedin" varchar,
	"github" varchar,
	"about" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"from" timestamp DEFAULT now() NOT NULL,
	"until" timestamp,
	CONSTRAINT "team_members_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"mist_id" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_mist_id_unique" UNIQUE("mist_id")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "participated_competition" ADD CONSTRAINT "participated_competition_competition_region_id_competition_region_id_fk" FOREIGN KEY ("competition_region_id") REFERENCES "public"."competition_region"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participated_competition" ADD CONSTRAINT "participated_competition_rover_id_rover_id_fk" FOREIGN KEY ("rover_id") REFERENCES "public"."rover"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsor" ADD CONSTRAINT "sponsor_sponsorship_plan_sponsorship_plans_id_fk" FOREIGN KEY ("sponsorship_plan") REFERENCES "public"."sponsorship_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsor" ADD CONSTRAINT "sponsor_competition_id_participated_competition_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."participated_competition"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_member_competitions" ADD CONSTRAINT "team_member_competitions_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_member_competitions" ADD CONSTRAINT "team_member_competitions_competition_id_participated_competition_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."participated_competition"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;