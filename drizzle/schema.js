import { pgTable, serial, text, timestamp, uuid, date, integer } from 'drizzle-orm/pg-core';

export const exams = pgTable('exams', {
  id: serial('id').primaryKey(),
  subject: text('subject').notNull(),
  examDate: date('exam_date').notNull(),
  examBoard: text('exam_board').notNull(),
  teacherName: text('teacher_name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  userId: uuid('user_id').notNull(),
});

export const userPreferences = pgTable('user_preferences', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  monday: text('monday').notNull(),
  tuesday: text('tuesday').notNull(),
  wednesday: text('wednesday').notNull(),
  thursday: text('thursday').notNull(),
  friday: text('friday').notNull(),
  saturday: text('saturday').notNull(),
  sunday: text('sunday').notNull(),
  sessionDuration: integer('session_duration').notNull(),
  startDate: date('start_date'),
});