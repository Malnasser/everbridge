import { ApiProperty } from '@nestjs/swagger';
import { OrgType } from '@platform/organizations';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export class OrganizationInviteDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  organizationName: string;

  @ApiProperty({ enum: OrgType, default: OrgType.SUPPLIER })
  @IsEnum(OrgType)
  organizationType: OrgType;
}
