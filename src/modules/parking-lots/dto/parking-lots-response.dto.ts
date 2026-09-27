import { IdSchema } from '@common/schemas/common.schema.js';
import z from 'zod';

export const ParkingLotsResponseSchema = z.object({
  id: IdSchema,
  name: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  pricePerHour: z.number(),
});
