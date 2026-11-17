CREATE TABLE "course" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"lecturer" text NOT NULL,
	"lecture_count" integer NOT NULL,
	CONSTRAINT "course_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "atom" (
	"id" text PRIMARY KEY NOT NULL,
	"lecture_id" text NOT NULL,
	"position" integer NOT NULL,
	"sentence" text NOT NULL,
	"transcript_ref" text,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lecture" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"number" integer NOT NULL,
	"title" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	CONSTRAINT "lecture_course_number_unique" UNIQUE("course_id","number")
);
--> statement-breakpoint
CREATE TABLE "question" (
	"id" text PRIMARY KEY NOT NULL,
	"main_atom_id" text NOT NULL,
	"format" text NOT NULL,
	"prompt" text NOT NULL,
	"options" jsonb NOT NULL,
	"explanation" text NOT NULL,
	"is_introductory" boolean DEFAULT false NOT NULL,
	"image_path" text,
	"image_credit" text,
	"image_kind" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"flag_note" text,
	"flagged_at" timestamp with time zone,
	"flagged_by_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_link" (
	"question_id" text NOT NULL,
	"atom_id" text NOT NULL,
	"weight" double precision NOT NULL,
	CONSTRAINT "question_link_question_id_atom_id_pk" PRIMARY KEY("question_id","atom_id")
);
--> statement-breakpoint
CREATE TABLE "atom_progress" (
	"user_id" text NOT NULL,
	"atom_id" text NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"interval_days" double precision DEFAULT 1 NOT NULL,
	"due_on" date NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"last_reviewed_on" date,
	"retry_pending" boolean DEFAULT false NOT NULL,
	"last_question_id" text,
	CONSTRAINT "atom_progress_user_id_atom_id_pk" PRIMARY KEY("user_id","atom_id")
);
--> statement-breakpoint
CREATE TABLE "learner_state" (
	"user_id" text PRIMARY KEY NOT NULL,
	"clout" integer DEFAULT 100 NOT NULL,
	"sound_on" boolean DEFAULT true NOT NULL,
	"time_zone" text,
	"last_review_on" date,
	"eased_return_on" date,
	"welcome_dismissed_on" date
);
--> statement-breakpoint
CREATE TABLE "lecture_progress" (
	"user_id" text NOT NULL,
	"lecture_id" text NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"door_opened_at" timestamp with time zone,
	"door_unveiled_at" timestamp with time zone,
	CONSTRAINT "lecture_progress_user_id_lecture_id_pk" PRIMARY KEY("user_id","lecture_id")
);
--> statement-breakpoint
CREATE TABLE "review_event" (
	"id" text PRIMARY KEY NOT NULL,
	"attempt_id" text NOT NULL,
	"user_id" text NOT NULL,
	"question_id" text NOT NULL,
	"main_atom_id" text NOT NULL,
	"kind" text NOT NULL,
	"confidence_step" text NOT NULL,
	"chosen_option_ids" jsonb NOT NULL,
	"was_correct" boolean NOT NULL,
	"main_xp_gained" integer NOT NULL,
	"linked_xp_gained" jsonb NOT NULL,
	"clout_change" integer NOT NULL,
	"before" jsonb NOT NULL,
	"result" jsonb NOT NULL,
	"learner_date" date NOT NULL,
	"answered_at" timestamp with time zone DEFAULT now() NOT NULL,
	"voided" boolean DEFAULT false NOT NULL,
	CONSTRAINT "review_event_attempt_id_unique" UNIQUE("attempt_id")
);
--> statement-breakpoint
ALTER TABLE "atom" ADD CONSTRAINT "atom_lecture_id_lecture_id_fk" FOREIGN KEY ("lecture_id") REFERENCES "public"."lecture"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lecture" ADD CONSTRAINT "lecture_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question" ADD CONSTRAINT "question_main_atom_id_atom_id_fk" FOREIGN KEY ("main_atom_id") REFERENCES "public"."atom"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_link" ADD CONSTRAINT "question_link_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_link" ADD CONSTRAINT "question_link_atom_id_atom_id_fk" FOREIGN KEY ("atom_id") REFERENCES "public"."atom"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "atom_progress" ADD CONSTRAINT "atom_progress_atom_id_atom_id_fk" FOREIGN KEY ("atom_id") REFERENCES "public"."atom"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "atom_progress" ADD CONSTRAINT "atom_progress_last_question_id_question_id_fk" FOREIGN KEY ("last_question_id") REFERENCES "public"."question"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lecture_progress" ADD CONSTRAINT "lecture_progress_lecture_id_lecture_id_fk" FOREIGN KEY ("lecture_id") REFERENCES "public"."lecture"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_event" ADD CONSTRAINT "review_event_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_event" ADD CONSTRAINT "review_event_main_atom_id_atom_id_fk" FOREIGN KEY ("main_atom_id") REFERENCES "public"."atom"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "atom_lecture_index" ON "atom" USING btree ("lecture_id");--> statement-breakpoint
CREATE INDEX "question_main_atom_index" ON "question" USING btree ("main_atom_id");--> statement-breakpoint
CREATE INDEX "question_link_atom_index" ON "question_link" USING btree ("atom_id");--> statement-breakpoint
CREATE INDEX "atom_progress_user_due_index" ON "atom_progress" USING btree ("user_id","due_on");--> statement-breakpoint
CREATE INDEX "review_event_user_date_index" ON "review_event" USING btree ("user_id","learner_date");--> statement-breakpoint
CREATE INDEX "review_event_user_atom_index" ON "review_event" USING btree ("user_id","main_atom_id");