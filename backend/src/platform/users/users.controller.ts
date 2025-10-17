import {
  Controller,
  Get,
  Inject,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './entities';
import { OrgJwtGuard } from '@core/auth/guards/auth.guard';
import { MeResponseDto } from './dto/me.res.dto';
import { UsersService } from './users.service';
import { OrgType } from '@platform/organizations';
import { Swag } from '@common/decorators/generic-swag.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { BaseController, PaginationQueryDto } from '@common/base';
import { InternalGuard } from '@core/auth/guards';
import { OrganizationOverrideInterceptor } from '@common/interceptors/organization-override.intercepters';

@Controller('users')
export class UsersController extends BaseController<User> {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {
    super(usersService);
  }

  @Swag({
    summary: 'Get current user',
    ok: { description: 'The current user.', type: MeResponseDto },
    bearer: true,
    guards: [OrgJwtGuard],
    orgHeader: false,
  })
  @Get('me')
  me(@CurrentUser() user: User): MeResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      organization: user.organization
        ? {
            id: user.organization.id,
            name: user.organization.name,
            type: user.organization.type,
          }
        : null,
    };
  }

  @Swag({
    summary: 'Get all users',
    ok: { type: User, isArray: true },
    query: PaginationQueryDto,
    bearer: true,
    guards: [OrgJwtGuard, InternalGuard],
  })
  @UseInterceptors(OrganizationOverrideInterceptor)
  @Get()
  async findAll(
    @CurrentUser() currentUser: User,
    @Query() query: PaginationQueryDto,
  ) {
    if (currentUser.organization.type === OrgType.PLATFORM) {
      return await super._findAll(query);
    }
    const forced = `organizationId:${currentUser.organization.id}`;
    if (!query.filter) query.filter = forced;
    else query.filter = `${forced},${query.filter}`;
    return await super._findAll(query);
  }
}
