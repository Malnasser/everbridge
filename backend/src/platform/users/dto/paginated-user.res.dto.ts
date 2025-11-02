import { PaginationRes } from '@common/base';
import { UserResponseDto } from './user.res.dto';

export class PaginatedUserResponseDto extends PaginationRes<UserResponseDto> {}

