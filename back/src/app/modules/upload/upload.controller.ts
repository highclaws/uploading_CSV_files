import {
  Controller,
  FileTypeValidator,
  Logger,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  Header,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '@/modules/upload/upload.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  private logger = new Logger('UploadController');

  constructor(private readonly uploadService: UploadService) {}

  @Post('/')
  @ApiConsumes('multipart/form-data')
  @Header('Content-Type', 'application/zip')
  // @Header('Content-Disposition', 'attachment; filename=result.zip')
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
  @ApiOperation({
    summary: 'Upload a CSV file and process it',
    description:
      'Upload a CSV file and process it using multer and zlib compression',
  })
  @ApiResponse({
    status: 400,
    description: 'No file provided',
  })
  @ApiResponse({
    status: 500,
    description: 'Error processing CSV file',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 100000000 }),
          new FileTypeValidator({ fileType: '.(csv|xls|xlsx)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<Buffer> {
    this.logger.verbose(`New request for Uploading CSV File... `);

    return this.uploadService.upload(file);
  }
}
