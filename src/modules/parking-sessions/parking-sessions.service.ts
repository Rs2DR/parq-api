import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ParkingSessionsRepository } from './parking-sessions.repository.js';
import { VehiclesService } from '../vehicles/vehicles.service.js';
import { PaymentsService } from '@modules/payments/payments.service.js';
import { User } from '../../infrastructure/database/schema/users.js';
import { ParkingSpot } from '../../infrastructure/database/schema/parking-spots.js';
import { Vehicle } from '../../infrastructure/database/schema/vehicles.js';
import { ParkingLotsService } from '@modules/parking-lots/parking-lots.service.js';
import {
  PARKING_SESSION_JOBS,
  PARKING_SESSIONS_QUEUE,
} from '@infrastructure/queue/queue.constants.js';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ParkingSession } from '@infrastructure/database/schema/parking-sessions.js';

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

  async createParkingIntent(
    userId: User['id'],
    spotId: ParkingSpot['id'],
    vehicleId: Vehicle['id'],
    hours: number,
  ) {
    await this.vehiclesService.validateVehicleOwnership(userId, vehicleId);

    const lot = await this.parkingLotsService.getLotDetails(spotId);

    if (!lot) {
      throw new NotFoundException('Parking zone or space not found');
    }

    const spot = lot.parkingSpots.find((s) => s.id === spotId);

    if (!spot) {
      throw new NotFoundException('The specified parking space was not found');
    }

    if (spot.isOccupied) {
      throw new BadRequestException(
        'The selected spot is already occupied by another vehicle',
      );
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

  async confirmAndStartSession(userId: User['id'], paymentIntentId: string) {
    const { metadata, amount } =
      await this.paymentsService.verifyPaymentSucceeded(paymentIntentId);

    const { spotId, vehicleId, hours } = metadata;

    const startTime = new Date();
    const endTime = new Date(
      startTime.getTime() + Number(hours) * 60 * 60 * 1000,
    );

    const session = await this.parkingSessionsRepository.startSessionTx({
      userId,
      vehicleId,
      parkingSpotId: spotId,
      startTime,
      endTime,
      totalPrice: amount,
      status: 'active',
    });

    const now = Date.now();
    const reminderDelay = endTime.getTime() - now - 15 * 60 * 1000;

    if (reminderDelay > 0) {
      await this.parkingSessionsQueue.add(
        PARKING_SESSION_JOBS.SEND_ENDING_REMINDER,
        {
          sessionId: session.id,
        },
        {
          delay: reminderDelay,

          attempts: 3,

          backoff: {
            type: 'exponential',
            delay: 5_000,
          },

          removeOnComplete: true,
          removeOnFail: false,
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

        attempts: 3,

        backoff: {
          type: 'exponential',
          delay: 5_000,
        },

        removeOnComplete: true,
        removeOnFail: false,
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
