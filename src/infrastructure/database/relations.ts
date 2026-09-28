import { defineRelations } from 'drizzle-orm';
import * as schema from './schema/index.js';

export const relations = defineRelations(schema, (r) => ({
  users: {
    vehicles: r.many.vehicles({
      from: r.users.id,
      to: r.vehicles.userId,
    }),
    parkingSessions: r.many.parkingSessions({
      from: r.users.id,
      to: r.parkingSessions.userId,
    }),
  },

  vehicles: {
    user: r.one.users({
      from: r.vehicles.userId,
      to: r.users.id,
    }),
    parkingSessions: r.many.parkingSessions({
      from: r.vehicles.id,
      to: r.parkingSessions.vehicleId,
    }),
  },

  parkingLots: {
    parkingSpots: r.many.parkingSpots({
      from: r.parkingLots.id,
      to: r.parkingSpots.parkingLotId,
    }),
  },

  parkingSpots: {
    parkingLot: r.one.parkingLots({
      from: r.parkingSpots.parkingLotId,
      to: r.parkingLots.id,
    }),
    parkingSessions: r.many.parkingSessions({
      from: r.parkingSpots.id,
      to: r.parkingSessions.parkingSpotId,
    }),
  },

  parkingSessions: {
    user: r.one.users({
      from: r.parkingSessions.userId,
      to: r.users.id,
    }),
    vehicle: r.one.vehicles({
      from: r.parkingSessions.vehicleId,
      to: r.vehicles.id,
    }),
    parkingSpot: r.one.parkingSpots({
      from: r.parkingSessions.parkingSpotId,
      to: r.parkingSpots.id,
    }),
  },
}));
