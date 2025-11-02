import { ApiProperty } from '@nestjs/swagger';
import { OrgType } from '@platform/organizations';

export class InvitationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  organizationName: string;

  @ApiProperty({ enum: OrgType })
  organizationType: OrgType;

  @ApiProperty()
  expiresAt: Date;
}
