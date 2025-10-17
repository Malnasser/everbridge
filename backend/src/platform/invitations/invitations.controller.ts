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
  ) {
    const newInvitation = new Invitation();
    newInvitation.organizationName = dto.organizationName;
    newInvitation.organizationType = dto.organizationType;
    newInvitation.firstName = dto.firstName;
    newInvitation.lastName = dto.lastName;
    newInvitation.email = dto.email;
    newInvitation.invitedBy = admin;
    return await this.invitationsService.sendOrganizationInvite(newInvitation);
  }

  @Swag({
    summary: 'Accept an invitation',
    notes: [
      `This endpoint accept both type of invite: organizations and members.`,
      `Call for first time for otp email call again with otp to verify and complete.`,
    ],
    ok: { description: 'The invitation has been successfully accepted.' },
    responses: [{ status: 400, description: 'Invalid or expired invitation.' }],
    orgHeader: false,
  })
  @Post('accept')
  async accept(@Body() dto: AcceptInviteDto) {
    return await this.invitationsService.accept(dto);
  }

  @Swag({
    summary: 'Invite a member to an organization',
    ok: {
      status: 201,
      description: 'The invitation has been successfully sent.',
    },
    responses: [{ status: 401, description: 'Unauthorized.' }],
    bearer: true,
    guards: [OrgJwtGuard],
  })
  @Post('members')
  async inviteMember(@Body() dto: InviteMemberDto, @CurrentUser() user: User) {
    const invitation = new Invitation();
    invitation.firstName = dto.firstName;
    invitation.lastName = dto.lastName;
    invitation.email = dto.email;
    invitation.invitedBy = user;
    return await this.invitationsService.inviteMember(
      invitation,
      user.organization,
    );
  }
}
