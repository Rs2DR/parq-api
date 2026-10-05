import { Controller, Post, Body, Param } from '@nestjs/common';
import { ParkingSessionsService } from './parking-sessions.service.js';
import { Auth } from '@common/decorators/auth.decorator.js';
import { CurrentUser } from '@common/decorators/user.decorator.js';
import { User } from '@infrastructure/database/schema/users.js';
import { ParkingSession } from '@infrastructure/database/schema/parking-sessions.js';
import z from 'zod';
import {
  type CreateParkingIntentDto,
  CreateParkingIntentSchema,
} from './dto/create-parking-intent.dto.js';
import { SerializeApiResponse } from '@common/decorators/serialize-api-response.decorator.js';
import { ParkingIntentResponseSchema } from './dto/parking-intent-response.dto.js';

@Auth()
@Controller('parking-sessions')
export class ParkingSessionsController {
  constructor(
    private readonly parkingSessionsService: ParkingSessionsService,
  ) {}

  @Post('intent')
  @SerializeApiResponse({ schema: ParkingIntentResponseSchema })
  async createIntent(
    @Body({ schema: CreateParkingIntentSchema }) dto: CreateParkingIntentDto,
    @CurrentUser('sub') userId: User['id'],
  ) {
    return this.parkingSessionsService.createParkingIntent(userId, dto);
  }
}
