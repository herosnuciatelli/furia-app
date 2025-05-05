import {
  date,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  varchar,
} from 'drizzle-orm/pg-core'

export const RoleEnum = pgEnum('role', ['FAN', 'ADMIN'])

export const users = pgTable('users', {
  id: varchar('id').primaryKey(),
  username: varchar('username', { length: 20 }).notNull().unique(),
  userId: varchar('user_id').notNull(),
  email: varchar('email').notNull(),
  points: integer().default(0).notNull(),
  furyCoins: integer().default(0).notNull(),
  role: RoleEnum('role').default('FAN').notNull(),
})

export const QuestionOptionEnum = pgEnum('question_options', [
  'a',
  'b',
  'c',
  'd',
])

export const SubmittedAnswerEnum = pgEnum('submit_answer_enum', [
  'a',
  'b',
  'c',
  'd',
  '',
])

export const questions = pgTable('questions', {
  id: varchar('id').primaryKey(),
  statement: text().notNull(),
  options: json().notNull(),
  correctAnswer: QuestionOptionEnum('correct_answer').notNull(),
  submittedAnswer: SubmittedAnswerEnum('submitted_answer')
    .default('')
    .notNull(),
})

export const quizzes = pgTable('quizzes', {
  id: varchar('id').primaryKey(),
  fanId: varchar('fan_id')
    .notNull()
    .references(() => users.id),
  score: integer().default(0).notNull(),
  created_at: date('created_at').notNull().defaultNow(),
  title: varchar('title', { length: 50 }).notNull(),
  questionsIdentifiers: varchar('questionsIdentifiers').array().notNull(),
})

export const rewards = pgTable('rewards', {
  id: varchar('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  code: varchar('code', { length: 20 }).notNull().unique(),
  price: integer().default(0).notNull(),
  quantity: integer().default(0).notNull(),
})

export const trades = pgTable('trades', {
  id: varchar('id').primaryKey(),
  rewardId: varchar('reward_id')
    .notNull()
    .references(() => rewards.id),
  fanId: varchar('fan_id')
    .notNull()
    .references(() => users.id),
  transaction_date: date('created_at').notNull().defaultNow(),
})
