import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { envSchema } from '@config/env.schema.js';
import { createFirebaseConfig } from '@config/firebase.config.js';
import { createJwtConfig } from '@config/jwt.config.js';
import { createLoggerConfig } from '@config/logger.config.js';
import { createPaymentsConfig } from '@config/payment.config.js';
import { DatabaseModule } from '@infrastructure/database/database.module.js';
import { QueueModule } from '@infrastructure/queue/queue.module.js';
import { AuthModule } from '@modules/auth/auth.module.js';
import { FirebaseModule } from '@modules/firebase/firebase.module.js';
import { ParkingLotsModule } from '@modules/parking-lots/parking-lots.module.js';
import { ParkingSessionsModule } from '@modules/parking-sessions/parking-sessions.module.js';
import { PaymentsModule } from '@modules/payments/payments.module.js';
import { UsersModule } from '@modules/users/users.module.js';
import { VehiclesModule } from '@modules/vehicles/vehicles.module.js';
import { WebhooksModule } from '@modules/webhooks/webhooks.module.js';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: createJwtConfig,
    }),
    FirebaseModule.forRootAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: createFirebaseConfig,
    }),
    PaymentsModule.forRootAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: createPaymentsConfig,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: createLoggerConfig,
    }),
    QueueModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    VehiclesModule,
    ParkingLotsModule,
    ParkingSessionsModule,
    WebhooksModule,
  ],
})
export class AppModule {}
