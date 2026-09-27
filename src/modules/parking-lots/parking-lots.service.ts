import { Injectable, NotFoundException } from '@nestjs/common';
import { ParkingLotsRepository } from './parking-lots.repository.js';

@Injectable()
export class ParkingLotsService {
  constructor(private readonly parkingLotsRepository: ParkingLotsRepository) {}

  // Получить все парковки для карты
  async getLotsForMap() {
    return this.parkingLotsRepository.findAll();
  }

  // Получить детальную инфу о парковке и список её мест
  async getLotDetails(id: string) {
    const lot = await this.parkingLotsRepository.findByIdWithSpots(id);

    if (!lot) {
      throw new NotFoundException('Парковка не найдена');
    }

    // Считаем количество свободных мест на лету для удобства фронтенда
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
