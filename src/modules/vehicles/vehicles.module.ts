import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service.js';
import { VehiclesController } from './vehicles.controller.js';
import { VehiclesRepository } from './vehicles.repository.js';

@Module({
  controllers: [VehiclesController],
  providers: [VehiclesService, VehiclesRepository],
  exports: [VehiclesService],
})
export class VehiclesModule {}
