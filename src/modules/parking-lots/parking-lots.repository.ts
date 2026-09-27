import { type Database } from '@database/database.types.js';
import { ParkingLot } from '@database/schema/parking-lots.js';
import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';

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
