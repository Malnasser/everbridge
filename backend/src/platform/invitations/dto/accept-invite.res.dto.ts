import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '@platform/users/dto/user.res.dto';

export class AcceptInviteResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
