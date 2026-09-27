import * as p from 'drizzle-orm/pg-core';

export const parkingLots = p.pgTable('parking_lots', {
  id: p.uuid('id').primaryKey().defaultRandom(),
  name: p.varchar({ length: 255 }).notNull(),
  latitude: p.decimal('latitude', { precision: 10, scale: 7 }).notNull(),
  longitude: p.decimal('longitude', { precision: 10, scale: 7 }).notNull(),
  pricePerHour: p.integer('price_per_hour').notNull(),
  createdAt: p.timestamp('created_at').notNull().defaultNow(),
});

export type ParkingLot = typeof parkingLots.$inferSelect;
export type NewParkingLots = typeof parkingLots.$inferInsert;
