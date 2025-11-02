import { ApiProperty } from '@nestjs/swagger';
import { OrganizationInviteDto } from '@platform/invitations/dto/invite.req.dto';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ type: () => OrganizationInviteDto, nullable: true })
  organization: OrganizationInviteDto | null;
}
