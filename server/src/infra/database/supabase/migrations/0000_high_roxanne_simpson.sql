CREATE TYPE "public"."question_options" AS ENUM('a', 'b', 'c', 'd');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('FAN', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."submit_answer_enum" AS ENUM('a', 'b', 'c', 'd', '');--> statement-breakpoint
CREATE TABLE "questions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"statement" text NOT NULL,
	"options" json NOT NULL,
	"correct_answer" "question_options" NOT NULL,
	"submitted_answer" "submit_answer_enum" DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" varchar PRIMARY KEY NOT NULL,
	"fan_id" varchar NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"title" varchar(50) NOT NULL,
	"questionsIdentifiers" varchar[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rewards" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"code" varchar(20) NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "rewards_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "trades" (
	"id" varchar PRIMARY KEY NOT NULL,
	"reward_id" varchar NOT NULL,
	"fan_id" varchar NOT NULL,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"username" varchar(20) NOT NULL,
	"user_id" varchar NOT NULL,
	"email" varchar NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"furyCoins" integer DEFAULT 0 NOT NULL,
	"role" "role" DEFAULT 'FAN' NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_fan_id_users_id_fk" FOREIGN KEY ("fan_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trades" ADD CONSTRAINT "trades_reward_id_rewards_id_fk" FOREIGN KEY ("reward_id") REFERENCES "public"."rewards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trades" ADD CONSTRAINT "trades_fan_id_users_id_fk" FOREIGN KEY ("fan_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;