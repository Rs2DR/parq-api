import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ParkingSessionsRepository } from './parking-sessions.repository.js';
import { VehiclesService } from '../vehicles/vehicles.service.js';
import { PaymentsService } from '@modules/payments/payments.service.js';
import { User } from '@database/schema/users.js';
import { ParkingSpot } from '@database/schema/parking-spots.js';
import { Vehicle } from '@database/schema/vehicles.js';
import { ParkingLotsService } from '@modules/parking-lots/parking-lots.service.js';

@Injectable()
export class ParkingSessionsService {
  constructor(
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
    const endTime = new Date();
    endTime.setHours(startTime.getHours() + parseInt(hours, 10));

    return this.parkingSessionsRepository.startSessionTx({
      userId,
      vehicleId,
      parkingSpotId: spotId,
      startTime,
      endTime,
      totalPrice: amount,
      status: 'active',
    });
  }
}
