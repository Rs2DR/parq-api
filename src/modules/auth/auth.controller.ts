import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterSchema, type RegisterDto } from './dto/register.dto.js';
import { LoginSchema, type LoginDto } from './dto/login.dto.js';
import { AuthResponseSchema } from './dto/auth-response.dto.js';
import { SerializeApiResponse } from '@common/decorators/serialize-api-response.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @SerializeApiResponse({ schema: AuthResponseSchema })
  async register(@Body({ schema: RegisterSchema }) dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @SerializeApiResponse({ schema: AuthResponseSchema })
  async login(@Body({ schema: LoginSchema }) dto: LoginDto) {
    return this.authService.login(dto);
  }
}
