import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRequest } from '../service/request.service';

export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = <UserRequest>ctx.switchToHttp().getRequest();
  return request.user.uid;
});
