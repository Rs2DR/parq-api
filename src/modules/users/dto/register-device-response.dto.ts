import {
  CreatedAtSchema,
  IdSchema,
  UpdatedAtSchema,
} from '@common/schemas/common.schema.js';
import z from 'zod';

export const RegisterDeviceResponseSchema = z.object({
  id: IdSchema,
  createdAt: CreatedAtSchema,
  updatedAt: UpdatedAtSchema,
  userId: IdSchema,
  fcmToken: z.string(),
});

export type RegisterDeviceResponseDto = z.infer<
  typeof RegisterDeviceResponseSchema
>;
