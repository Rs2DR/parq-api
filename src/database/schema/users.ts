import * as p from 'drizzle-orm/pg-core';

export const users = p.pgTable('users', {
  id: p.uuid('id').primaryKey().defaultRandom(),
  name: p.varchar({ length: 255 }).notNull(),
  email: p.varchar({ length: 255 }).notNull().unique(),
  passwordHash: p.varchar('password_hash', { length: 255 }).notNull(),
  createdAt: p.timestamp('created_at').notNull().defaultNow(),
  updatedAt: p
    .timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
