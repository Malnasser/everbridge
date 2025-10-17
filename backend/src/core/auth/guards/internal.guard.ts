import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { OrgType } from '@platform/organizations';

@Injectable()
export class InternalGuard implements CanActivate {
  constructor() {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    if (req.user?.organization?.type !== OrgType.PLATFORM) return false;

    return true;
  }
}
