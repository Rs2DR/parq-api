import { Controller } from '@nestjs/common';
import { ParkingLotsService } from './parking-lots.service.js';

@Controller('parking-lots')
export class ParkingLotsController {
  constructor(private readonly parkingLotsService: ParkingLotsService) {}
}
