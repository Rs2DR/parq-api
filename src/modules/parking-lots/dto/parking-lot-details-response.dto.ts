import z from 'zod';
import { ParkingLotsResponseSchema } from './parking-lots-response.dto.js';
import { IdSchema } from '@common/schemas/common.schema.js';

export const ParkingSpotSchema = z.object({
  id: IdSchema,
  parkingLotId: IdSchema,
  spotNumber: z.string(),
  isOccupied: z.boolean(),
});

export const ParkingLotDetailsResponseSchema = ParkingLotsResponseSchema.extend(
  {
    parkingSpots: z.array(ParkingSpotSchema),
    stats: z.object({
      totalSpots: z.number(),
      availableSpots: z.number(),
      occupiedSpots: z.number(),
    }),
  },
);
