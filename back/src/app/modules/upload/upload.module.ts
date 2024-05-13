import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from '@/modules/upload/upload.controller';
import { UploadService } from '@/modules/upload/upload.service';
import { multerConfig } from 'src/config/multer';
import { CsvService } from '@/modules/services/csv.service';

@Module({
  imports: [MulterModule.register(multerConfig)],
  controllers: [UploadController],
  providers: [UploadService, CsvService],
})
export class UploadModule {}
