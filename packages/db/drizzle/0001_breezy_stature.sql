ALTER TABLE "sponsor" DROP CONSTRAINT "sponsor_sponsorship_plan_sponsorship_plans_id_fk";
--> statement-breakpoint
ALTER TABLE "sponsor" DROP CONSTRAINT "sponsor_competition_id_participated_competition_id_fk";
--> statement-breakpoint
ALTER TABLE "sponsorship_plans" ALTER COLUMN "is_active" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "team_members" ALTER COLUMN "from" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "sponsor" ADD CONSTRAINT "sponsor_sponsorship_plan_sponsorship_plans_id_fk" FOREIGN KEY ("sponsorship_plan") REFERENCES "public"."sponsorship_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsor" ADD CONSTRAINT "sponsor_competition_id_participated_competition_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."participated_competition"("id") ON DELETE no action ON UPDATE no action;