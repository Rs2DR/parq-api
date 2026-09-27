import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CurrentUser } from '@common/decorators/user.decorator.js';
import { type JwtPayload } from '@common/interfaces/jwt-payload.interfaces.js';
import { SerializeApiResponse } from '@common/decorators/serialize-api-response.decorator.js';
import { ProfileResponseSchema } from './dto/profile-response.dto.js';
import { Auth } from '@common/decorators/auth.decorator.js';

@Auth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @SerializeApiResponse({ schema: ProfileResponseSchema })
  async getProfile(@CurrentUser() user: JwtPayload) {
    return this.usersService.getProfile(user.sub);
  }
}
