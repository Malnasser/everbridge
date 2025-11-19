import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '@platform/users/dto/user.res.dto';

export class AcceptInviteResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
