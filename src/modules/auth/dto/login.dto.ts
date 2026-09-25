import { EmailSchema, PasswordSchema } from '@common/schemas/common.schema.js';
import z from 'zod';

export const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export type LoginDto = z.infer<typeof LoginSchema>;
