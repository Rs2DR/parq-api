import { type Database } from '@database/database.types.js';
import { User } from '@database/schema/users.js';
import { NewVehicle, Vehicle, vehicles } from '@database/schema/vehicles.js';
import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class VehiclesRepository {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  async getUserVehicles(userId: User['id']) {
    const result = await this.db.query.vehicles.findMany({
      where: {
        userId,
      },
    });

    return result;
  }

  async findById(id: Vehicle['id']) {
    const result = await this.db.query.vehicles.findFirst({
      where: { id },
    });

    return result ?? null;
  }

  async findByLicensePlate(licensePlate: Vehicle['licensePlate']) {
    const result = await this.db.query.vehicles.findFirst({
      where: { licensePlate },
    });

    return result ?? null;
  }

  async create(data: NewVehicle) {
    const result = await this.db.insert(vehicles).values(data).returning();
    return result[0];
  }

  async remove(id: Vehicle['id'], userId: User['id']) {
    const result = await this.db
      .delete(vehicles)
      .where(and(eq(vehicles.id, id), eq(vehicles.userId, userId)))
      .returning();

    return result[0] ?? null;
  }
}
