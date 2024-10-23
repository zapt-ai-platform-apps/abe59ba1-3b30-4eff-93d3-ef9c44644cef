import { pgTable, serial, text, timestamp, uuid, date } from 'drizzle-orm/pg-core';

export const exams = pgTable('exams', {
  id: serial('id').primaryKey(),
  subject: text('subject').notNull(),
  examDate: date('exam_date').notNull(),
  examBoard: text('exam_board').notNull(),
  teacherName: text('teacher_name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  userId: uuid('user_id').notNull(),
});