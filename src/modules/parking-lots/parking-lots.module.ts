import { Module } from '@nestjs/common';
import { ParkingLotsService } from './parking-lots.service.js';
import { ParkingLotsController } from './parking-lots.controller.js';

@Module({
  controllers: [ParkingLotsController],
  providers: [ParkingLotsService],
})
export class ParkingLotsModule {}
