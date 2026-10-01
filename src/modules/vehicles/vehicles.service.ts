import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VehiclesRepository } from './vehicles.repository.js';
import { User } from '../../infrastructure/database/schema/users.js';
import { Vehicle } from '../../infrastructure/database/schema/vehicles.js';
import { type CreateVehicleDto } from './dto/create-vehicle.dto.js';
import { VEHICLE_ERRORS } from './vehicles.constants.js';

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
        VEHICLE_ERRORS.LICENSE_PLATE_ALREADY_REGISTERED,
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
      throw new NotFoundException(VEHICLE_ERRORS.NOT_FOUND_IN_PROFILE);
    }
  }

  async validateVehicleOwnership(userId: User['id'], vehicleId: Vehicle['id']) {
    const vehicle = await this.vehiclesRepository.findById(vehicleId);

    if (!vehicle || vehicle.userId !== userId) {
      throw new NotFoundException(VEHICLE_ERRORS.NOT_FOUND_OR_NOT_OWNER);
    }

    return vehicle;
  }
}
