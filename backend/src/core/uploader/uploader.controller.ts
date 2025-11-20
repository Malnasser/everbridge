import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  Inject,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { UploaderService } from './uploader.service';
import { InternalGuard, OrgJwtGuard } from '@core/auth/guards';
import { PaginationQueryDto } from '@common/base';
import { UploadsResDto, UploadResDto } from './dto';
import { BaseController } from '@common/base/base.controller';
import { Upload } from './entities/upload.entity';
import { Swag } from '@common/decorators/generic-swag.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { User } from '@platform/users/entities/user.entity';
import { ResponseDto } from '@common/base/dto/response.dto';

@ApiTags('Uploader')
@Controller('uploader')
export class UploaderController extends BaseController<Upload> {
  constructor(
    @Inject(UploaderService)
    private readonly uploaderService: UploaderService,
  ) {
    super(uploaderService);
  }

  @Swag({
    summary: 'Upload a file',
    ok: { type: UploadResDto },
    bearer: true,
    guards: [OrgJwtGuard],
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ): Promise<ResponseDto<UploadResDto>> {
    const newUpload = await this.uploaderService.uploadFile(file, user);
    return {
      message: 'File uploaded successfully',
      data: new UploadResDto(newUpload),
      error: null,
    };
  }

  // @Swag({
  //   summary: 'List all uploads paginated (Internal Admin Only)',
  //   ok: { type: UploadsResDto },
  //   query: PaginationQueryDto,
  //   bearer: true,
  //   guards: [OrgJwtGuard, InternalGuard],
  //   orgHeader: false,
  // })
  // @Get()
  // async listAllUploads(
  //   @Query() query: PaginationQueryDto,
  // ): Promise<UploadsResDto> {
  //   return await super._findAll(query);
  // }

  @Swag({
    summary: 'Get signed URL to download an upload (Internal Admin Only)',
    ok: { type: String },
    bearer: true,
    guards: [OrgJwtGuard, InternalGuard],
    orgHeader: false,
  })
  @Get('/:id/download')
  async downloadUpload(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ signedUrl: string }> {
    const signedUrl = await this.uploaderService.getSignedUrl(id);
    return { signedUrl };
  }
}
