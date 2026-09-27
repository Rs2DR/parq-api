import { AuthGuard } from '@common/guards/auth.guard.js';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

export function Auth() {
  return applyDecorators(UseGuards(AuthGuard), ApiBearerAuth('access-token'));
}
