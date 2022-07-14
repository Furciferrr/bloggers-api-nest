import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  if (!request.user) {
    return null;
  }
  if (data) {
    return request.user[data];
  }
  return request.user;
});
