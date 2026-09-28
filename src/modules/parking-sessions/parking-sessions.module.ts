import { Module } from '@nestjs/common';
import { ParkingSessionsService } from './parking-sessions.service.js';
import { ParkingSessionsController } from './parking-sessions.controller.js';
import { ParkingSessionsRepository } from './parking-sessions.repository.js';
import { PaymentsModule } from '@modules/payments/payments.module.js';
import { ConfigService } from '@nestjs/config';
import { VehiclesModule } from '@modules/vehicles/vehicles.module.js';
import { BullModule } from '@nestjs/bullmq';
import { PARKING_SESSIONS_QUEUE } from '@infrastructure/queue/queue.constants.js';

@Module({
  imports: [
    PaymentsModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
      }),
    }),
    BullModule.registerQueue({
      name: PARKING_SESSIONS_QUEUE,
    }),
    VehiclesModule,
  ],
  controllers: [ParkingSessionsController],
  providers: [ParkingSessionsService, ParkingSessionsRepository],
})
export class ParkingSessionsModule {}
