import { InternalGuard, OrgJwtGuard } from '@core/auth/guards';
import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'platform/users';
import { Invitation } from './entities/Invitation.entity';
import { InvitationsService } from './invitations.service';
import { OrganizationInviteDto } from './dto/invite.req.dto';
import { AcceptInviteDto } from './dto/accept-invite.req.dto';
import { Swag } from '@common/decorators/generic-swag.decorator';
import { OrgType } from '@platform/organizations';
import { BaseController } from '@common/base';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { OrganizationOverrideInterceptor } from '@common/interceptors/organization-override.intercepters';
import { InvitationResponseDto } from './dto/invitation.res.dto';
import { AcceptInviteResponseDto } from './dto/accept-invite.res.dto';
import { ResponseDto } from '@common/base/dto/response.dto';
import { LoginResponseDto } from '@core/auth/dto';

@Controller('invitations')
export class InvitationsController extends BaseController<Invitation> {
  private readonly logger = new Logger(InvitationsService.name);

  constructor(private readonly invitationsService: InvitationsService) {
    super(invitationsService);
  }

  @Swag({
    summary: 'Invite SME organization',
    orgTypes: [OrgType.PLATFORM],
    ok: {
      status: 201,
      description: 'The invitation has been successfully sent.',
      type: InvitationResponseDto,
    },
    responses: [{ status: 401, description: 'Unauthorized.' }],
    bearer: true,
    guards: [OrgJwtGuard, InternalGuard],
    orgHeader: false,
  })
  @UseInterceptors(OrganizationOverrideInterceptor)
  @Post('organizations')
  async inviteOrganization(
    @Body() dto: OrganizationInviteDto,
    @CurrentUser() admin: User,
  ): Promise<ResponseDto<InvitationResponseDto>> {
    const newInvitation = new Invitation();
    newInvitation.firstName = dto.firstName;
    newInvitation.lastName = dto.lastName;
    newInvitation.email = dto.email;
    newInvitation.invitedBy = admin;
    const createdInvite =
      await this.invitationsService.sendOrganizationInvite(newInvitation);

    if (createdInvite instanceof Error) {
      this.logger.error('Error creating an invite: ', Error);
      throw new HttpException(
        {
          message: createdInvite.message,
          data: null,
          error: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: 'Invitation sent successfully',
      data: {
        id: createdInvite.id,
        email: createdInvite.email,
        firstName: createdInvite.firstName,
        lastName: createdInvite.lastName,
        expiresAt: createdInvite.expiresAt,
      },
      error: null,
    };
  }

  @Swag({
    summary: 'Accept an invitation',
    notes: [
      `This endpoint accept a user invite to start onboarding his SME`,
      `Call for first time for otp email call again with otp to verify and complete.`,
    ],
    ok: {
      description: 'The invitation has been successfully accepted.',
      type: AcceptInviteResponseDto,
    },
    responses: [{ status: 400, description: 'Invalid or expired invitation.' }],
    orgHeader: false,
  })
  @Post('accept')
  async accept(
    @Body() dto: AcceptInviteDto,
  ): Promise<ResponseDto<LoginResponseDto>> {
    const loginData: LoginResponseDto | Error =
      await this.invitationsService.accept(dto);

    if (loginData instanceof Error) {
      this.logger.error('Error accepting an invite: ', Error);
      throw new HttpException(
        {
          message: loginData.message,
          data: null,
          error: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: 'Invitation accepted successfully',
      data: loginData as LoginResponseDto,
      error: null,
    };
  }
}
