import { InternalGuard, OrgJwtGuard } from '@core/auth/guards';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { User } from 'platform/users';
import { Invitation } from './entities/Invitation.entity';
import { InvitationsService } from './invitations.service';
import { InviteMemberDto } from './dto/invite-member.req.dto';
import { OrganizationInviteDto } from './dto/invite.req.dto';
import { AcceptInviteDto } from './dto/accept-invite.req.dto';
import { Swag } from '@common/decorators/generic-swag.decorator';
import { OrgType } from '@platform/organizations';
import { BaseController } from '@common/base';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { OrganizationOverrideInterceptor } from '@common/interceptors/organization-override.intercepters';
import { InvitationResponseDto } from './dto/invitation.res.dto';
import { AcceptInviteResponseDto } from './dto/accept-invite.res.dto';
import { UserResponseDto } from '@platform/users/dto/user.res.dto';

@Controller('invitations')
export class InvitationsController extends BaseController<Invitation> {
  constructor(private readonly invitationsService: InvitationsService) {
    super(invitationsService);
  }

  @Swag({
    summary: 'Invite an organization',
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
  ): Promise<InvitationResponseDto> {
    const newInvitation = new Invitation();
    newInvitation.organizationName = dto.organizationName;
    newInvitation.organizationType = dto.organizationType;
    newInvitation.firstName = dto.firstName;
    newInvitation.lastName = dto.lastName;
    newInvitation.email = dto.email;
    newInvitation.invitedBy = admin;
    const createdInvite =
      await this.invitationsService.sendOrganizationInvite(newInvitation);

    return {
      id: createdInvite.id,
      email: createdInvite.email,
      firstName: createdInvite.firstName,
      lastName: createdInvite.lastName,
      organizationName: createdInvite.organizationName,
      organizationType: createdInvite.organizationType,
      expiresAt: createdInvite.expiresAt,
    };
  }

  @Swag({
    summary: 'Accept an invitation',
    notes: [
      `This endpoint accept both type of invite: organizations and members.`,
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
  async accept(@Body() dto: AcceptInviteDto): Promise<AcceptInviteResponseDto> {
    const result = await this.invitationsService.accept(dto);

    const userResponse: UserResponseDto = {
      id: result.user.id,
      email: result.user.email,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      organization: result.user.organization
        ? {
            organizationName: result.user.organization.name,
            organizationType: result.user.organization.type,
            firstName: undefined,
            lastName: undefined,
            email: undefined,
          }
        : null,
    };

    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      user: userResponse,
    };
  }

  @Swag({
    summary: 'Invite a member to an organization',
    ok: {
      status: 201,
      description: 'The invitation has been successfully sent.',
      type: InvitationResponseDto,
    },
    responses: [{ status: 401, description: 'Unauthorized.' }],
    bearer: true,
    guards: [OrgJwtGuard],
  })
  @Post('members')
  async inviteMember(
    @Body() dto: InviteMemberDto,
    @CurrentUser() user: User,
  ): Promise<InvitationResponseDto> {
    const invitation = new Invitation();
    invitation.firstName = dto.firstName;
    invitation.lastName = dto.lastName;
    invitation.email = dto.email;
    invitation.invitedBy = user;
    const newInvite = await this.invitationsService.inviteMember(
      invitation,
      user.organization,
    );

    return {
      id: newInvite.id,
      email: newInvite.email,
      firstName: newInvite.firstName,
      lastName: newInvite.lastName,
      organizationName: newInvite.organizationName,
      organizationType: newInvite.organizationType,
      expiresAt: newInvite.expiresAt,
    };
  }
}
