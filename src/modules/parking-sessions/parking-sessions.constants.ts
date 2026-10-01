import { JobsOptions } from 'bullmq';

export const REMINDER_TIME_MS = 15 * 60 * 1000;

export const PARKING_HOUR_MS = 60 * 60 * 1000;

export const PARKING_PAYMENT_CURRENCY = 'usd';

export const DEFAULT_QUEUE_OPTIONS: JobsOptions = {
  attempts: 3,
  removeOnComplete: true,
  removeOnFail: false,
};

export const PARKING_SESSION_ERRORS = {
  ZONE_NOT_FOUND: 'Parking zone not found',
  SPOT_NOT_FOUND: 'Parking space not found',
  SPOT_OCCUPIED: 'The selected parking space is already occupied',
  INVALID_PAYMENT_METADATA: 'Invalid payment metadata',

  SPOT_NOT_FOUND_FOR_SESSION: 'The parking space for the session was not found',
  PARKING_SESSION_NOT_FOUND: 'Parking session not found',
  PARKING_SESSION_CREATE_FAILED: 'Failed to create parking session',
} as const;
