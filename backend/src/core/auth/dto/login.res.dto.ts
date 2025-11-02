import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user.res.dto';

export class LoginResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
