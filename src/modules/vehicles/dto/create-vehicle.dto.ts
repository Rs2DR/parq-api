import { licensePlateRegex } from '@constants/regex.constants.js';
import z from 'zod';

export const CreateVehicleSchema = z.object({
  licensePlate: z
    .string('The license plate number is a mandatory field')
    .trim()
    .regex(licensePlateRegex, {
      message:
        'Invalid Belarus license plate format. Example: 1234AB7 or 1234AB-7',
    }),

  brand: z
    .string()
    .min(2, {
      error: ({ minimum }) =>
        `The brand name must be at least ${minimum} characters long`,
    })
    .max(50, {
      error: ({ maximum }) =>
        `The brand name must be no more than ${maximum} characters long`,
    }),

  model: z
    .string()
    .min(1, {
      error: ({ minimum }) =>
        `The model name must be at least ${minimum} characters long`,
    })
    .max(50, {
      error: ({ maximum }) =>
        `The model name must be no more than ${maximum} characters long`,
    }),
});

export type CreateVehicleDto = z.infer<typeof CreateVehicleSchema>;
