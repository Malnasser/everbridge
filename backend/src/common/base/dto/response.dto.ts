import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({ example: 'Successfully Logged in.' })
  message: string;

  @ApiProperty({ example: null })
  data: T | null;

  @ApiProperty({ example: null })
  error: ErrorHttpStatusCode | null;
}
