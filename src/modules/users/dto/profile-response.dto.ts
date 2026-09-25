import {
  CreatedAtSchema,
  EmailSchema,
  IdSchema,
  NameSchema,
  UpdatedAtSchema,
} from '@common/schemas/common.schema.js';
import z from 'zod';

export const ProfileResponseSchema = z.object({
  id: IdSchema,
  name: NameSchema,
  email: EmailSchema,
  createdAt: CreatedAtSchema,
  updatedAt: UpdatedAtSchema,
});

export type ProfileResponseDto = z.infer<typeof ProfileResponseSchema>;
