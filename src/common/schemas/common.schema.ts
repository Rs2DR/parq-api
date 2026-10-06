import z from 'zod';

export const EmailSchema = z.email('Invalid email format').meta({
  description: 'User email address',
  example: 'user@example.com',
});

export const PasswordSchema = z
  .string()
  .min(6, {
    error: ({ minimum }) =>
      `Password must be at least ${minimum} characters long`,
  })
  .meta({
    example: 'password123',
  });

export const LoginPasswordSchema = z
  .string()
  .min(1, 'Password is required')
  .meta({
    example: 'password123',
  });

export const NameSchema = z
  .string()
  .min(2, {
    error: ({ minimum }) => `Name must be at least ${minimum} characters long`,
  })
  .meta({
    example: 'John Doe',
  });

export const IdSchema = z.uuid('Invalid ID format').meta({
  example: '550e8400-e29b-41d4-a716-446655440000',
});

export const TimestampSchema = z.coerce.date().meta({
  example: '2026-09-26T10:30:00.000Z',
});
