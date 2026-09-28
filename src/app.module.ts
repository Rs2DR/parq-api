import { envSchema } from '@config/env.schema.js';
import { DatabaseModule } from '@database/database.module.js';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { JwtModule } from '@nestjs/jwt';
import { VehiclesModule } from './modules/vehicles/vehicles.module.js';
import { ParkingLotsModule } from './modules/parking-lots/parking-lots.module.js';
import { ParkingSessionsModule } from './modules/parking-sessions/parking-sessions.module.js';
import { PaymentModule } from './modules/payments/payments.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    VehiclesModule,
    ParkingLotsModule,
    ParkingSessionsModule,
    PaymentModule,
  ],
})
export class AppModule {}
