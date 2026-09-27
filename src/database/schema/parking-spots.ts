import * as p from 'drizzle-orm/pg-core';
import { parkingLots } from './parking-lots.js';

export const parkingSpots = p.pgTable('parking_spots', {
  id: p.uuid('id').primaryKey().defaultRandom(),
  parkingLotId: p
    .uuid('parking_lot_id')
    .notNull()
    .references(() => parkingLots.id, { onDelete: 'cascade' }),
  spotNumber: p.varchar('spot_number', { length: 50 }).notNull(),
  isOccupied: p.boolean('is_occupied').notNull().default(false),
});

export type ParkingSpot = typeof parkingSpots.$inferSelect;
export type NewParkingSpot = typeof parkingSpots.$inferInsert;
