import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';

import { type Database } from '@infrastructure/database/database.types.js';
import { ParkingLot } from '@infrastructure/database/schema/parking-lots.js';

@Injectable()
export class ParkingLotsRepository {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  async findAll() {
    return this.db.query.parkingLots.findMany();
  }

  async findByIdWithSpots(id: ParkingLot['id']) {
    const result = await this.db.query.parkingLots.findFirst({
      where: {
        id,
      },
      with: {
        parkingSpots: true,
      },
    });

    return result ?? null;
  }
}
