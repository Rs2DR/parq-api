import { JwtPayload } from '@common/interfaces/jwt-payload.interfaces.js';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user: JwtPayload | undefined = request.user;

    return data ? user?.[data] : user;
  },
);
