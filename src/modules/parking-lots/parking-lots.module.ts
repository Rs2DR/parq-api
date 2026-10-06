import { Module } from '@nestjs/common';

import { ParkingLotsController } from './parking-lots.controller.js';
import { ParkingLotsRepository } from './parking-lots.repository.js';
import { ParkingLotsService } from './parking-lots.service.js';

@Module({
  controllers: [ParkingLotsController],
  providers: [ParkingLotsService, ParkingLotsRepository],
  exports: [ParkingLotsService],
})
export class ParkingLotsModule {}
