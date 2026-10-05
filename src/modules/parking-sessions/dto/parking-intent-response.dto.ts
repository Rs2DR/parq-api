import z from 'zod';

export const ParkingIntentResponseSchema = z.object({
  amount: z.number().int(),
  paymentIntentId: z.string(),
  clientSecret: z.string(),
});

export type ParkingIntentResponseDto = z.infer<
  typeof ParkingIntentResponseSchema
>;
