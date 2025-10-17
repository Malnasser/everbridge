import { ApiProperty } from '@nestjs/swagger';
import { OrgType } from 'platform/organizations';

class OrganizationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: OrgType;
}

export class MeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ type: () => OrganizationDto, nullable: true })
  organization: OrganizationDto | null;
}
