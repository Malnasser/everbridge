import { Controller, Get, Query, Inject } from '@nestjs/common';
import { BaseController } from '@common/base/base.controller';
import { Organization, OrgType } from './entities';
import { OrganizationService } from './organizations.service';
import { InternalGuard, OrgJwtGuard } from '@core/auth/guards';
import { Swag } from '@common/decorators/generic-swag.decorator';
import { PaginationQueryDto } from '@common/base';

@Controller('organziations')
export class organziationsController extends BaseController<Organization> {
  constructor(
    @Inject(OrganizationService)
    private readonly organizationService: OrganizationService,
  ) {
    super(organizationService);
  }

  @Swag({
    summary: 'Get all organizations',
    orgTypes: [OrgType.PLATFORM],
    ok: { type: Organization, isArray: true },
    query: PaginationQueryDto,
    bearer: true,
    guards: [OrgJwtGuard, InternalGuard],
    orgHeader: false,
  })
  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    return await super._findAll(query);
  }
}
