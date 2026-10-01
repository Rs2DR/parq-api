import { Module } from '@nestjs/common';

import { ParkingSessionsModule } from '@modules/parking-sessions/parking-sessions.module.js';
import { StripeWebhookController } from './stripe-webhook.controller.js';

@Module({
  imports: [ParkingSessionsModule],
  controllers: [StripeWebhookController],
})
export class WebhooksModule {}
