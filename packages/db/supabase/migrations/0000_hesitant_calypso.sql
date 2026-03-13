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
CREATE TABLE "content_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"section" varchar(50) NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"description" text,
	"icon" varchar(50),
	"icon_color" varchar(50),
	"url" text,
	"email" varchar(255),
	"phone" varchar(50),
	"image" text,
	"category" varchar(100),
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "content_items_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "site_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"title" text,
	"body" text NOT NULL,
	"image" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_content_id_unique" UNIQUE("id"),
	CONSTRAINT "site_content_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "timeline_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"year" varchar(10) NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "timeline_events_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "gallery_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(100) NOT NULL,
	"icon" varchar(50),
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gallery_categories_id_unique" UNIQUE("id"),
	CONSTRAINT "gallery_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"src" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"date" varchar(20),
	"location" varchar(200),
	"tag" varchar(100),
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gallery_images_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "gallery_videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"thumbnail" text,
	"url" text NOT NULL,
	"duration" varchar(20),
	"date" varchar(20),
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gallery_videos_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"category" varchar(100),
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "faqs_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "recruitment_openings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_name" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"open_positions" integer DEFAULT 0 NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "recruitment_openings_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "media_coverages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"outlet" varchar(200) NOT NULL,
	"type" varchar(20) NOT NULL,
	"year" varchar(10) NOT NULL,
	"date" varchar(50) NOT NULL,
	"description" text,
	"image" text,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"link" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_coverages_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "news_articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(200) NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"body" text,
	"category" varchar(100) NOT NULL,
	"image" text,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "news_articles_id_unique" UNIQUE("id"),
	CONSTRAINT "news_articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "research_papers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"authors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"journal" varchar(200) NOT NULL,
	"year" varchar(10) NOT NULL,
	"doi" varchar(200),
	"url" text,
	"abstract" text,
	"keywords" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"category" varchar(100) NOT NULL,
	"venue" text,
	"pages" varchar(50),
	"publisher" varchar(200),
	"is_open_access" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "research_papers_id_unique" UNIQUE("id")
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
	"description" text NOT NULL,
	"website" text NOT NULL,
	"logo" text NOT NULL,
	"plan" uuid NOT NULL,
	"competition_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sponsors_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "competitions_members" (
	"team_member_id" uuid NOT NULL,
	"competition_id" uuid NOT NULL,
	"role" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "competitions_members_pk" PRIMARY KEY("team_member_id","competition_id")
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
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_category_id_gallery_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."gallery_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_plan_plans_id_fk" FOREIGN KEY ("plan") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitions_members" ADD CONSTRAINT "competitions_members_team_member_id_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitions_members" ADD CONSTRAINT "competitions_members_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;