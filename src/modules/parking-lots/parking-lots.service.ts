import { Injectable, NotFoundException } from '@nestjs/common';

import { ParkingLot } from '../../infrastructure/database/schema/parking-lots.js';
import { ParkingLotsRepository } from './parking-lots.repository.js';

@Injectable()
export class ParkingLotsService {
  constructor(private readonly parkingLotsRepository: ParkingLotsRepository) {}

  async getLotsForMap() {
    return this.parkingLotsRepository.findAll();
  }

  async getLotDetails(id: ParkingLot['id']) {
    const lot = await this.parkingLotsRepository.findByIdWithSpots(id);

    if (!lot) {
      throw new NotFoundException('Parking not found');
    }

    const totalSpots = lot.parkingSpots.length;
    const availableSpots = lot.parkingSpots.filter(
      (spot) => !spot.isOccupied,
    ).length;

    return {
      ...lot,
      stats: {
        totalSpots,
        availableSpots,
        occupiedSpots: totalSpots - availableSpots,
      },
    };
  }
}
