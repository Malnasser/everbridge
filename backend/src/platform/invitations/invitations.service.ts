import { Injectable, Logger } from '@nestjs/common';
import { Invitation } from './entities/Invitation.entity';
import { randomBytes } from 'crypto';
import { InvitationsRepository } from './invitations.repository';
import { addDays } from 'date-fns';
import { AcceptInviteDto } from './dto/accept-invite.req.dto';
import { AuthService } from '@core/auth';
import { LoginResponseDto, RegisterDto } from '@core/auth/dto';
import { NotificationService } from '@core/notification/notification.service';
import { BaseService } from '@common/base';
import { UsersService } from '@platform/users';

@Injectable()
export class InvitationsService extends BaseService<Invitation> {
  private readonly logger = new Logger(InvitationsService.name);

  constructor(
    private readonly invitationsRepo: InvitationsRepository,
    private readonly authService: AuthService,
    private readonly noitifactionService: NotificationService,
    private readonly userService: UsersService,
  ) {
    super(invitationsRepo, Invitation);
  }

  async sendOrganizationInvite(
    invitation: Invitation,
  ): Promise<Invitation | Error> {
    const existingInvite = await super.findOne({ email: invitation.email });
    if (existingInvite) {
      return new Error('An invitation has already been sent to this email.');
    }
    const userExist = await this.userService.findUserByEmail({
      email: invitation.email,
    });
    if (userExist) {
      return new Error('User with this email already exists.');
    }

    invitation.expiresAt = addDays(new Date(), 7);
    invitation.token = randomBytes(32).toString('hex');
    invitation.createdAt = new Date();
    const createdInvite = await super.create(invitation);

    await this.noitifactionService.sendEmail({
      to: invitation.email,
      subject: 'EverBridge Onboarding Invite',
      message: `Here is your invite link: ${invitation.token}`,
    });

    return createdInvite;
  }

  async accept(dto: AcceptInviteDto): Promise<LoginResponseDto | Error> {
    const inv = await this.invitationsRepo.findOne({ token: dto.token });
    if (!inv || inv.acceptedAt || new Date() > inv.expiresAt)
      return new Error('Invitation invalid.');
    if (dto.password !== dto.repassword)
      return new Error('Password does not match');

    const registerDto = new RegisterDto();
    registerDto.firstName = inv.firstName;
    registerDto.lastName = inv.lastName;
    registerDto.email = inv.email;
    registerDto.password = dto.password;

    await this.invitationsRepo.update(inv.id, { acceptedAt: new Date() });

    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      this.logger.error('error registering user: ', error);
      await this.invitationsRepo.update(inv.id, { acceptedAt: null });
      return new Error('Failed to register user.');
    }
  }
}
