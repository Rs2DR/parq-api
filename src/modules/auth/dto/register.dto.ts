import {
  EmailSchema,
  NameSchema,
  PasswordSchema,
} from '@common/schemas/common.schema.js';
import z from 'zod';

export const RegisterSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  name: NameSchema,
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
