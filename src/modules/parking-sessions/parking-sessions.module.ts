import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { PARKING_SESSIONS_QUEUE } from '@infrastructure/queue/queue.constants.js';
import { ParkingLotsModule } from '@modules/parking-lots/parking-lots.module.js';
import { VehiclesModule } from '@modules/vehicles/vehicles.module.js';

import { ParkingSessionsController } from './parking-sessions.controller.js';
import { ParkingSessionsProcessor } from './parking-sessions.processor.js';
import { ParkingSessionsRepository } from './parking-sessions.repository.js';
import { ParkingSessionsService } from './parking-sessions.service.js';

@Module({
  imports: [
    BullModule.registerQueue({
      name: PARKING_SESSIONS_QUEUE,
    }),
    VehiclesModule,
    ParkingLotsModule,
  ],
  controllers: [ParkingSessionsController],
  providers: [
    ParkingSessionsService,
    ParkingSessionsRepository,
    ParkingSessionsProcessor,
  ],
  exports: [ParkingSessionsService],
})
export class ParkingSessionsModule {}
