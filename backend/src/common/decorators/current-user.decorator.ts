import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().user;
  },
);
