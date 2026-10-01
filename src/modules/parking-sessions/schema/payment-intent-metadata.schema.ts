import { IdSchema } from '@common/schemas/common.schema.js';
import { z } from 'zod';

export const PaymentIntentMetadataSchema = z.object({
  userId: IdSchema,
  spotId: IdSchema,
  vehicleId: IdSchema,
  hours: z.coerce.number().int().positive(),
});

export type PaymentIntentMetadata = z.infer<typeof PaymentIntentMetadataSchema>;
