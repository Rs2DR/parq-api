import { envSchema } from '@config/env.schema.js';
import { DatabaseModule } from '@database/database.module.js';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),
    DatabaseModule,
    AuthModule,
  ],
})
export class AppModule {}
