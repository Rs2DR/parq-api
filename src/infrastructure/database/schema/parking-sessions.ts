import * as p from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { vehicles } from './vehicles.js';
import { parkingSpots } from './parking-spots.js';

export const parkingSessionStatus = p.pgEnum('session_status', [
  'active',
  'completed',
  'expired',
]);

export const parkingSessions = p.pgTable('parking_sessions', {
  id: p.uuid('id').primaryKey().defaultRandom(),
  userId: p
    .uuid('user_id')
    .notNull()
    .references(() => users.id),
  vehicleId: p
    .uuid('vehicle_id')
    .notNull()
    .references(() => vehicles.id),
  parkingSpotId: p
    .uuid('parking_spot_id')
    .notNull()
    .references(() => parkingSpots.id),

  startTime: p.timestamp('start_time').notNull().defaultNow(),
  endTime: p.timestamp('end_time').notNull(),

  totalPrice: p.integer('total_price').notNull(),
  status: parkingSessionStatus('status').notNull().default('active'),

  createdAt: p.timestamp('created_at').notNull().defaultNow(),
});

export type ParkingSession = typeof parkingSessions.$inferSelect;
export type NewParkingSession = typeof parkingSessions.$inferInsert;

export type ParkingSessionStatus =
  (typeof parkingSessionStatus.enumValues)[number];
