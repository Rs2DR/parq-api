import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CurrentUser } from '@common/decorators/user.decorator.js';
import { type JwtPayload } from '@common/interfaces/jwt-payload.interfaces.js';
import { SerializeApiResponse } from '@common/decorators/serialize-api-response.decorator.js';
import { ProfileResponseSchema } from './dto/profile-response.dto.js';
import { Auth } from '@common/decorators/auth.decorator.js';
import {
  RegisterDeviceSchema,
  type RegisterDeviceDto,
} from './dto/register-device.dto.js';
import {
  type RemoveDeviceDto,
  RemoveDeviceSchema,
} from './dto/remove-device.dto.js';
import { User } from '@infrastructure/database/schema/users.js';
import { RegisterDeviceResponseSchema } from './dto/register-device-response.dto.js';

@Auth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @SerializeApiResponse({ schema: ProfileResponseSchema })
  async getProfile(@CurrentUser('sub') userId: User['id']) {
    return this.usersService.getProfile(userId);
  }

  @Post('me/devices')
  @SerializeApiResponse({ schema: RegisterDeviceResponseSchema })
  async registerDevice(
    @CurrentUser('sub') userId: User['id'],
    @Body({ schema: RegisterDeviceSchema }) body: RegisterDeviceDto,
  ) {
    console.log('added device');

    return this.usersService.registerDevice(userId, body.fcmToken);
  }

  @Delete('me/devices')
  async removeDevice(
    @CurrentUser('sub') userId: User['id'],
    @Body({ schema: RemoveDeviceSchema }) body: RemoveDeviceDto,
  ) {
    return this.usersService.removeDevice(userId, body.fcmToken);
  }
}
