import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  constructor(@Inject('STRIPE_CLIENT') private readonly stripe: Stripe) {}

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata: Record<string, string>,
  ) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
      metadata,
    });

    return {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    };
  }

  async verifyPaymentSucceeded(paymentIntentId: string) {
    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException(
        'The payment is not completed in the Stripe system',
      );
    }

    return paymentIntent;
  }
}
