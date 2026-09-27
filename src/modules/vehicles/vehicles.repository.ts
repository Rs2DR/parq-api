import { type Database } from '@database/database.types.js';
import { User } from '@database/schema/users.js';
import { NewVehicle, Vehicle, vehicles } from '@database/schema/vehicles.js';
import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class VehiclesRepository {
  constructor(@InjectDrizzle() private readonly db: Database) {}

<<<<<<< Updated upstream
  async getUserVehicles(userId: User['id']): Promise<Vehicle[]> {
=======
  async getUserVehicles(userId: User['id']) {
>>>>>>> Stashed changes
    const result = await this.db.query.vehicles.findMany({
      where: {
        userId,
      },
    });

    return result;
  }

<<<<<<< Updated upstream
  async findById(id: Vehicle['id']): Promise<Vehicle | null> {
=======
  async findById(id: Vehicle['id']) {
>>>>>>> Stashed changes
    const result = await this.db.query.vehicles.findFirst({
      where: { id },
    });

    return result ?? null;
  }

<<<<<<< Updated upstream
  async findByLicensePlate(
    licensePlate: Vehicle['licensePlate'],
  ): Promise<Vehicle | null> {
=======
  async findByLicensePlate(licensePlate: Vehicle['licensePlate']) {
>>>>>>> Stashed changes
    const result = await this.db.query.vehicles.findFirst({
      where: { licensePlate },
    });

    return result ?? null;
  }

<<<<<<< Updated upstream
  async create(data: NewVehicle): Promise<Vehicle> {
=======
  async create(data: NewVehicle) {
>>>>>>> Stashed changes
    const result = await this.db.insert(vehicles).values(data).returning();
    return result[0];
  }

<<<<<<< Updated upstream
  async remove(id: Vehicle['id'], userId: User['id']): Promise<Vehicle | null> {
=======
  async remove(id: Vehicle['id'], userId: User['id']) {
>>>>>>> Stashed changes
    const result = await this.db
      .delete(vehicles)
      .where(and(eq(vehicles.id, id), eq(vehicles.userId, userId)))
      .returning();

    return result[0] ?? null;
  }
}
