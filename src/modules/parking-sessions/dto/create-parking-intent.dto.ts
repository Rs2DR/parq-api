import { IdSchema } from '@common/schemas/common.schema.js';
import { z } from 'zod';

export const CreateParkingIntentSchema = z.object({
  spotId: IdSchema,
  vehicleId: IdSchema,
  hours: z
    .number('Number of hours is required')
    .int({ message: 'Hours must be an integer' })
    .min(1, {
      error: ({ minimum }) => `Minimum parking duration is ${minimum} hour`,
    })
    .max(24, {
      error: ({ maximum }) =>
        `Maximum parking duration per session is ${maximum} hours`,
    }),
});

export type CreateParkingIntentDto = z.infer<typeof CreateParkingIntentSchema>;
