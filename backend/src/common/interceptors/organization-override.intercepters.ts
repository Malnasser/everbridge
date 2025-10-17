import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { OrganizationService, OrgType } from '@platform/organizations';

@Injectable()
export class OrganizationOverrideInterceptor implements NestInterceptor {
  constructor(private readonly orgService: OrganizationService) {}

  async intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = ctx.switchToHttp().getRequest();

    // Only PLATFORM users can override
    if (req.user?.organization?.type === OrgType.PLATFORM) {
      const orgIdHeader = req.headers['x-organization-id'];
      if (orgIdHeader) {
        const org = await this.orgService.findById(orgIdHeader);
        if (!org) throw new NotFoundException('Unknown override organization');

        req.user.organization = org;
      }
    }

    return next.handle();
  }
}
