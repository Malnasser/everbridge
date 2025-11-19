import { ApiProperty } from '@nestjs/swagger';
import { OnboardingState, OnboardingType } from '../entities';

export class InitOnboardingResponseDto {
  @ApiProperty()
  onboardingType: OnboardingType;

  @ApiProperty()
  state: OnboardingState;

  @ApiProperty()
  schema: any;

  @ApiProperty()
  data: any;

  @ApiProperty()
  registrationNumber: string;

  @ApiProperty()
  organizationName: string;
}
