import * as p from 'drizzle-orm/pg-core';

import { users } from './users.js';

export const vehicles = p.pgTable('vehicles', {
  id: p.uuid('id').primaryKey().defaultRandom(),
  userId: p
    .uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  licensePlate: p.varchar('license_plate', { length: 8 }).notNull().unique(),
  brand: p.varchar('brand', { length: 100 }).notNull(),
  model: p.varchar('model', { length: 100 }).notNull(),
  createdAt: p.timestamp('created_at').notNull().defaultNow(),
});

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
