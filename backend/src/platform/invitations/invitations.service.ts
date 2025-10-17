import { BadRequestException, Injectable } from '@nestjs/common';
import { Invitation } from './entities/Invitation.entity';
import { randomBytes } from 'crypto';
import { InvitationsRepository } from './invitations.repository';
import { addDays } from 'date-fns';
import { AcceptInviteDto } from './dto/accept-invite.req.dto';
import { AuthService } from '@core/auth';
import { RegisterDto } from '@core/auth/dto';
import { Organization, OrgType } from 'platform/organizations';
import { NotificationService } from '@core/notification/notification.service';
import { BaseService } from '@common/base';

@Injectable()
export class InvitationsService extends BaseService<Invitation> {
  constructor(
    private readonly invitationsRepo: InvitationsRepository,
    private readonly authService: AuthService,
    private readonly noitifactionService: NotificationService,
  ) {
    super(invitationsRepo, Invitation);
  }

  async sendOrganizationInvite(invitation: Invitation) {
    invitation.expiresAt = addDays(new Date(), 7);
    invitation.token = randomBytes(32).toString('hex');
    invitation.createdAt = new Date();
    const createdInvite = await super.create(invitation);

    this.noitifactionService.sendEmail({
      to: invitation.email,
      subject: 'EverBridge Join Invite',
      message: `Here is your invite: ${invitation.token}`,
    });

    return createdInvite;
  }

  async accept(dto: AcceptInviteDto) {
    const inv = await this.invitationsRepo.findOne({ token: dto.token });
    if (!inv || inv.acceptedAt || new Date() > inv.expiresAt)
      throw new BadRequestException('Invalid or expired invitation');
    if (inv.organizationType === OrgType.PLATFORM)
      throw new BadRequestException('platform organizations type not allowed');
    if (dto.password !== dto.repassword)
      throw new BadRequestException('Password does not match');

    const registerDto = new RegisterDto();
    registerDto.firstName = inv.firstName;
    registerDto.lastName = inv.lastName;
    registerDto.email = inv.email;
    registerDto.password = dto.password;

    let assignOrganization = inv.targetOrg;
    if (!assignOrganization) {
      assignOrganization = new Organization();
      assignOrganization.name = inv.organizationName;
      assignOrganization.type = inv.organizationType;
    }

    await this.invitationsRepo.update(inv.id, { acceptedAt: new Date() });
    return await this.authService.register(registerDto, assignOrganization);
  }

  async inviteMember(
    invitation: Invitation,
    inviteeOrganization: Organization,
  ) {
    invitation.expiresAt = addDays(new Date(), 7);
    invitation.token = randomBytes(32).toString('hex');
    invitation.createdAt = new Date();
    invitation.organizationName = inviteeOrganization.name;
    invitation.targetOrg = inviteeOrganization;
    invitation.targetOrgId = inviteeOrganization.id;

    const newInvite = await super.create(invitation);

    this.noitifactionService.sendEmail({
      to: invitation.email,
      subject: 'EverBridge Join Invite',
      message: `Here is your invite: ${invitation.token}`,
    });

    return newInvite;
  }
}
