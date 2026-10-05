import { PaymentsModuleOptions } from '@modules/payments/interfaces/payments-module-options.interface.js';
import type { ConfigService } from '@nestjs/config';

export function createPaymentsConfig(
  configService: ConfigService,
): Promise<PaymentsModuleOptions> | PaymentsModuleOptions {
  return {
    apiKey: configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
    webhookSecret: configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET'),
    apiVersion: '2026-08-26.dahlia',
  };
}
