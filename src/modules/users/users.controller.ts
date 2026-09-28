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

@Auth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @SerializeApiResponse({ schema: ProfileResponseSchema })
  async getProfile(@CurrentUser() user: JwtPayload) {
    return this.usersService.getProfile(user.sub);
  }

  @Post('me/devices')
  async registerDevice(
    @CurrentUser() user: JwtPayload,
    @Body({ schema: RegisterDeviceSchema }) body: RegisterDeviceDto,
  ) {
    return this.usersService.registerDevice(user.sub, body.fcmToken);
  }

  @Delete('me/devices')
  async removeDevice(
    @CurrentUser() user: JwtPayload,
    @Body() body: RegisterDeviceDto,
  ) {
    return this.usersService.removeDevice(user.sub, body.fcmToken);
  }
}
