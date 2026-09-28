import { Module } from '@nestjs/common';
import { ParkingLotsService } from './parking-lots.service.js';
import { ParkingLotsController } from './parking-lots.controller.js';
import { ParkingLotsRepository } from './parking-lots.repository.js';

@Module({
  controllers: [ParkingLotsController],
  providers: [ParkingLotsService, ParkingLotsRepository],
  exports: [ParkingLotsService],
})
export class ParkingLotsModule {}
