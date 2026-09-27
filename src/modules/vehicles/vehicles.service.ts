import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VehiclesRepository } from './vehicles.repository.js';
import { User } from '@database/schema/users.js';
import { Vehicle } from '@database/schema/vehicles.js';
import { type CreateVehicleDto } from './dto/create-vehicle.dto.js';

@Injectable()
export class VehiclesService {
  constructor(private readonly vehiclesRepository: VehiclesRepository) {}

  async getMyVehicles(userId: User['id']) {
    return this.vehiclesRepository.getUserVehicles(userId);
  }

  async addVehicle(userId: User['id'], dto: CreateVehicleDto) {
    const { licensePlate } = dto;

    const existingVehicle =
      await this.vehiclesRepository.findByLicensePlate(licensePlate);

    if (existingVehicle) {
      throw new ConflictException(
        `The vehicle with license plate ${licensePlate} is already registered in the system.`,
      );
    }

    return this.vehiclesRepository.create({
      ...dto,
      userId,
    });
  }

  async removeVehicle(userId: User['id'], vehicleId: Vehicle['id']) {
    const deletedVehicle = await this.vehiclesRepository.remove(
      vehicleId,
      userId,
    );

    if (!deletedVehicle) {
      throw new NotFoundException('Vehicle not found in your profile');
    }
  }

  async validateVehicleOwnership(userId: User['id'], vehicleId: Vehicle['id']) {
    const vehicle = await this.vehiclesRepository.findById(vehicleId);

    if (!vehicle || vehicle.userId !== userId) {
      throw new NotFoundException(
        'The selected vehicle was not found or does not belong to you',
      );
    }

    return vehicle;
  }
}
