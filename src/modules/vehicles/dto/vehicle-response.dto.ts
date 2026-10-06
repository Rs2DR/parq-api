import { CreatedAtSchema, IdSchema } from '@common/schemas/common.schema.js';

import { CreateVehicleSchema } from './create-vehicle.dto.js';

export const VehicleResponseSchema = CreateVehicleSchema.extend({
  id: IdSchema,
  userId: IdSchema,
  createdAt: CreatedAtSchema,
});
