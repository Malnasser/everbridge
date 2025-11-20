import { ResponseDto } from '@common/base/dto/response.dto';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Customize error response
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    console.log(response);

    const res = new ResponseDto();
    res.message = exception.message || 'Something Wrong happened';
    res.data = null;
    res.error = HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json(res);
  }
}
