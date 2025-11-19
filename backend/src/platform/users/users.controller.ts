import {
  Controller,
  Get,
  Inject,
  Query,
  UseInterceptors,
  Patch,
  Param,
} from '@nestjs/common';
import { User } from './entities';
import { OrgJwtGuard } from '@core/auth/guards';
import { MeResponseDto } from './dto/me.res.dto';
import { UsersService } from './users.service';
import { OrgType } from '@platform/organizations';
import { Swag } from '@common/decorators/generic-swag.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { BaseController, PaginationQueryDto } from '@common/base';
import { InternalGuard } from '@core/auth/guards';
import { OrganizationOverrideInterceptor } from '@common/interceptors/organization-override.intercepters';
import { UserResponseDto } from './dto/user.res.dto';
import { PaginatedUserResponseDto } from './dto/paginated-user.res.dto';
import { ResponseDto } from '@common/base/dto/response.dto';

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
  me(@CurrentUser() user: User): ResponseDto<MeResponseDto> {
    return {
      message: 'your basic user info',
      data: {
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
      },
      error: null,
    };
  }

  @Swag({
    summary: 'Get all users',
    ok: { type: PaginatedUserResponseDto },
    query: PaginationQueryDto,
    bearer: true,
    guards: [OrgJwtGuard, InternalGuard],
  })
  @UseInterceptors(OrganizationOverrideInterceptor)
  @Get()
  async findAll(
    @CurrentUser() currentUser: User,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedUserResponseDto> {
    if (currentUser.organization.type !== OrgType.PLATFORM) {
      const forced = `organizationId:${currentUser.organization.id}`;
      if (!query.filter) query.filter = forced;
      else query.filter = `${forced},${query.filter}`;
    }

    const paginatedUsers = await super._findAll(query);
    const mappedData: UserResponseDto[] = paginatedUsers.data.map((user) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      organization: user.organization
        ? {
            organizationName: user.organization.name,
            organizationType: user.organization.type,
            firstName: undefined,
            lastName: undefined,
            email: undefined,
          }
        : null,
    }));

    return {
      ...paginatedUsers,
      data: mappedData,
    };
  }

  @Swag({
    summary: 'Deactivate a user',
    ok: { description: 'The deactivated user.', type: UserResponseDto },
    bearer: true,
    guards: [OrgJwtGuard],
    orgHeader: true,
  })
  @Patch(':id/deactivate')
  async deactivate(
    @CurrentUser() currentUser: User,
    @Param('id') id: string,
  ): Promise<UserResponseDto> {
    const deactivatedUser = await this.usersService.deactivate(currentUser, id);
    return {
      id: deactivatedUser.id,
      email: deactivatedUser.email,
      firstName: deactivatedUser.firstName,
      lastName: deactivatedUser.lastName,
      organization: deactivatedUser.organization
        ? {
            firstName: undefined,
            lastName: undefined,
            email: undefined,
          }
        : null,
    };
  }
}
