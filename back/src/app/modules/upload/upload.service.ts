import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CsvService } from '@/modules/services/csv.service';
import { RowDto } from './validators/Upload.dto';

@Injectable()
export class UploadService {
  constructor(private readonly csvService: CsvService) {}

  public async upload(file: Express.Multer.File): Promise<Buffer> {
    const { validatedRows, errorRows } =
      await this.csvService.parseAndValidateCsv(file.buffer);

    if (errorRows.length) {
      throw new UnprocessableEntityException({
        message: 'Validation failed',
        errors: errorRows,
      });
    }

    const maleData: RowDto[] = [];
    const femaleData: RowDto[] = [];

    validatedRows.forEach((row) => {
      if (row.gender === 'male') {
        maleData.push(row);
      } else if (row.gender === 'female') {
        femaleData.push(row);
      }
    });
    return this.csvService.zipAndSeparateCsv(maleData, femaleData);
  }
}
