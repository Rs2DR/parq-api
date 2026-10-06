import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  PARKING_SESSION_STATUS,
  ParkingSession,
} from '@infrastructure/database/schema/parking-sessions.js';
import { User } from '@infrastructure/database/schema/users.js';
import {
  PARKING_SESSIONS_QUEUE,
  PARKING_SESSION_JOBS,
} from '@infrastructure/queue/queue.constants.js';
import { ParkingLotsService } from '@modules/parking-lots/parking-lots.service.js';
import { PaymentsService } from '@modules/payments/payments.service.js';
import { Queue } from 'bullmq';
import Stripe from 'stripe';

import { VehiclesService } from '../vehicles/vehicles.service.js';
import { CreateParkingIntentDto } from './dto/create-parking-intent.dto.js';
import {
  DEFAULT_QUEUE_OPTIONS,
  PARKING_HOUR_MS,
  PARKING_SESSION_ERRORS,
  REMINDER_TIME_MS,
} from './parking-sessions.constants.js';
import { ParkingSessionsRepository } from './parking-sessions.repository.js';
import { PaymentIntentMetadataSchema } from './schema/payment-intent-metadata.schema.js';

@Injectable()
export class ParkingSessionsService {
  constructor(
    @InjectQueue(PARKING_SESSIONS_QUEUE)
    private readonly parkingSessionsQueue: Queue,
    private readonly parkingSessionsRepository: ParkingSessionsRepository,
    private readonly paymentsService: PaymentsService,
    private readonly vehiclesService: VehiclesService,
    private readonly parkingLotsService: ParkingLotsService,
  ) {}

  async createParkingIntent(userId: User['id'], dto: CreateParkingIntentDto) {
    const { spotId, vehicleId, lotId, hours } = dto;

    await this.vehiclesService.validateVehicleOwnership(userId, vehicleId);

    const lot = await this.parkingLotsService.getLotDetails(lotId);

    if (!lot) {
      throw new NotFoundException(PARKING_SESSION_ERRORS.ZONE_NOT_FOUND);
    }

    const spot = lot.parkingSpots.find((s) => s.id === spotId);

    if (!spot) {
      throw new NotFoundException(PARKING_SESSION_ERRORS.SPOT_NOT_FOUND);
    }

    if (spot.isOccupied) {
      throw new BadRequestException(PARKING_SESSION_ERRORS.SPOT_OCCUPIED);
    }

    const totalAmount = lot.pricePerHour * hours;

    const stripeData = await this.paymentsService.createPaymentIntent(
      totalAmount,
      'usd',
      { userId, spotId, vehicleId, hours: hours.toString() },
    );

    return {
      ...stripeData,
      amount: totalAmount,
    };
  }

  async startSessionFromPayment(paymentIntent: Stripe.PaymentIntent) {
    const { metadata, amount } = paymentIntent;

    const metadataResult = PaymentIntentMetadataSchema.safeParse(metadata);

    if (!metadataResult.success) {
      throw new BadRequestException(
        PARKING_SESSION_ERRORS.INVALID_PAYMENT_METADATA,
      );
    }

    const { userId, spotId, vehicleId, hours } = metadataResult.data;

    const startTime = new Date();

    const endTime = new Date(startTime.getTime() + hours * PARKING_HOUR_MS);

    const session = await this.parkingSessionsRepository.startSessionTx({
      userId,
      vehicleId,
      parkingSpotId: spotId,
      stripePaymentIntentId: paymentIntent.id,
      startTime,
      endTime,
      totalPrice: amount,
      status: PARKING_SESSION_STATUS.ACTIVE,
    });

    const now = Date.now();

    const reminderDelay = endTime.getTime() - now - REMINDER_TIME_MS;

    if (reminderDelay > 0) {
      await this.parkingSessionsQueue.add(
        PARKING_SESSION_JOBS.SEND_ENDING_REMINDER,
        {
          sessionId: session.id,
        },
        {
          delay: reminderDelay,
          ...DEFAULT_QUEUE_OPTIONS,
        },
      );
    }

    const finishDelay = Math.max(0, endTime.getTime() - now);

    await this.parkingSessionsQueue.add(
      PARKING_SESSION_JOBS.FINISH,
      {
        sessionId: session.id,
      },
      {
        delay: finishDelay,
        ...DEFAULT_QUEUE_OPTIONS,
      },
    );

    return session;
  }

  async finishSession(sessionId: ParkingSession['id']) {
    return this.parkingSessionsRepository.finishSessionTx(sessionId);
  }

  async getSessionForNotification(sessionId: ParkingSession['id']) {
    return this.parkingSessionsRepository.findSessionForNotification(sessionId);
  }
}
