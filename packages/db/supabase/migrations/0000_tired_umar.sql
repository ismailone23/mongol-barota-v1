CREATE TYPE "public"."region_key" AS ENUM('urc', 'arc', 'erc');--> statement-breakpoint
CREATE TYPE "public"."sub_team" AS ENUM('LT', 'FA', 'MT', 'ET', 'ST', 'ScT', 'MgT', 'CT');--> statement-breakpoint
CREATE TABLE "competitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"region" "region_key" NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"location" text NOT NULL,
	"rover_id" uuid NOT NULL,
	"result" text NOT NULL,
	"featured" boolean DEFAULT false,
	"image" text NOT NULL,
	"icon_color" varchar NOT NULL,
	"icon_bg" varchar NOT NULL,
	"icon" varchar NOT NULL,
	"highlight" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"participation_year" timestamp with time zone NOT NULL,
	"score" varchar,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "competitions_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "rover" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image" text NOT NULL,
	"name" varchar(100) NOT NULL,
	"status" varchar NOT NULL,
	"description" text NOT NULL,
	"spec" jsonb NOT NULL,
	"year" timestamp DEFAULT now() NOT NULL,
	"ended" timestamp,
	"achievements" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"features" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rover_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"subtitle" varchar(100),
	"price" integer NOT NULL,
	"price_label" varchar(100),
	"icon" varchar(50) NOT NULL,
	"icon_color" varchar(50) NOT NULL,
	"icon_bg_color" varchar(50) NOT NULL,
	"border_color" varchar(50),
	"is_popular" boolean DEFAULT false,
	"display_order" integer DEFAULT 0 NOT NULL,
	"benefits" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "plans_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "sponsors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"desctiption" text NOT NULL,
	"website" text NOT NULL,
	"logo" text NOT NULL,
	"plan" uuid NOT NULL,
	"competition_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sponsors_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "competitions_members" (
	"team_member_id" uuid NOT NULL,
	"competition_id" uuid NOT NULL,
	"role" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"role" varchar NOT NULL,
	"department" varchar NOT NULL,
	"image" text NOT NULL,
	"subTeam" "sub_team" NOT NULL,
	"bio" text,
	"title" text,
	"email" varchar,
	"phone" varchar,
	"linkedin" varchar,
	"github" varchar,
	"about" varchar,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"joined" timestamp,
	"left" timestamp,
	CONSTRAINT "members_id_unique" UNIQUE("id")
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
ALTER TABLE "competitions" ADD CONSTRAINT "competitions_rover_id_rover_id_fk" FOREIGN KEY ("rover_id") REFERENCES "public"."rover"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_plan_plans_id_fk" FOREIGN KEY ("plan") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitions_members" ADD CONSTRAINT "competitions_members_team_member_id_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitions_members" ADD CONSTRAINT "competitions_members_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;