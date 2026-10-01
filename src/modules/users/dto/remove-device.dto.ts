import { z } from 'zod';

export const RemoveDeviceSchema = z.object({
  fcmToken: z.string().min(1, 'FCM token is required').max(500),
});

export type RemoveDeviceDto = z.infer<typeof RemoveDeviceSchema>;
