import { envSchema } from '@config/env.schema.js';
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
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
    FirebaseModule.forRootAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        credential: {
          projectId: configService.getOrThrow<string>('FIREBASE_PROJECT_ID'),
          clientEmail: configService.getOrThrow<string>(
            'FIREBASE_CLIENT_EMAIL',
          ),
          privateKey: configService
            .getOrThrow<string>('FIREBASE_PRIVATE_KEY')
            .replace(/\\n/g, '\n'),
        },
        databaseURL: configService.get<string>('FIREBASE_DATABASE_URL'),
      }),
    }),
    PaymentsModule.forRootAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
        webhookSecret: configService.getOrThrow<string>(
          'STRIPE_WEBHOOK_SECRET',
        ),
        apiVersion: '2026-08-26.dahlia',
      }),
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
