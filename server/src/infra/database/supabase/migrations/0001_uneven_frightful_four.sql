ALTER TABLE "trades" RENAME COLUMN "created_at" TO "transaction_date";--> statement-breakpoint
ALTER TABLE "quizzes" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "quizzes" ALTER COLUMN "created_at" SET DEFAULT now();