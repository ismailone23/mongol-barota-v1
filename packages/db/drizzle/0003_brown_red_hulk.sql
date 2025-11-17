ALTER TABLE "rover" ALTER COLUMN "tag" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "rover" ALTER COLUMN "tag" SET DEFAULT ARRAY[]::text[];