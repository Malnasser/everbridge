import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Inject,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { UploaderService } from './uploader.service';
import { InternalGuard, OrgJwtGuard } from '@core/auth/guards';
import { UploadResDto, UploadsResDto } from './dto';
import { BaseController } from '@common/base/base.controller';
import { Upload } from './entities/upload.entity';
import { Swag } from '@common/decorators/generic-swag.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { User } from '@platform/users/entities/user.entity';
import { ResponseDto } from '@common/base/dto/response.dto';
import { PaginationQueryDto } from '@common/base';

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

    if (newUpload instanceof Error) {
      return {
        message: 'File upload failed',
        error: HttpStatus.BAD_REQUEST,
        data: null,
      };
    }

    return {
      message: 'File uploaded successfully',
      data: new UploadResDto(newUpload),
      error: null,
    };
  }

  @Swag({
    summary: 'List all uploads paginated (Internal Admin Only)',
    ok: { type: UploadsResDto },
    query: PaginationQueryDto,
    bearer: true,
    guards: [OrgJwtGuard, InternalGuard],
    orgHeader: false,
  })
  @Get()
  async listAllUploads(
    @Query() query: PaginationQueryDto,
  ): Promise<UploadsResDto> {
    const paginatedUploads = await super._findAll(query, ['owner']);
    const mappedData = paginatedUploads.data.map((file: any) => ({
      id: file.id,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      filename: file.filename,
      key: file.key,
      bucket: file.bucket,
      mimetype: file.mimetype,
      size: file.size,
      url: file.url,
      owner: file.owner
        ? {
            id: file.owner.id,
            firstName: file.owner.firstName,
            lastName: file.owner.lastName,
            isActive: file.owner.isActive,
            emailVerified: file.owner.emailVerified,
            organizationId: file.owner.organizationId,
          }
        : null,
    }));

    return {
      ...paginatedUploads,
      data: mappedData,
    };
  }

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
