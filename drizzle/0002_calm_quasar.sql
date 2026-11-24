ALTER TABLE "atom" ADD COLUMN "kind" text DEFAULT 'atom' NOT NULL;--> statement-breakpoint
ALTER TABLE "atom" ADD COLUMN "blurb" text;--> statement-breakpoint
ALTER TABLE "atom" ADD COLUMN "details" jsonb;--> statement-breakpoint
ALTER TABLE "question" ADD COLUMN "rung" text;