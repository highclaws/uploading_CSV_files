import { Test, TestingModule } from '@nestjs/testing';

import { CsvService } from './csv.service';
import { ValidationError } from 'class-validator';
import { RowDto } from '@/modules/upload/validators/Upload.dto';
import * as fs from 'fs';

describe('CsvService', () => {
  let service: CsvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvService],
    }).compile();

    service = module.get<CsvService>(CsvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parseAndValidateCsv', () => {
    it('should parse and validate CSV data successfully', async () => {
      const buffer = Buffer.from(
        'uid,date,firstName,lastName,gender,randomString1\n1,01-01-2024,John,Doe,male,randomString1\n',
      );
      const { validatedRows, errorRows } =
        await service.parseAndValidateCsv(buffer);
      expect(validatedRows).toEqual([
        {
          uid: '1',
          firstName: 'John',
          lastName: 'Doe',
          gender: 'male',
          date: '01-01-2024',
          randomString1: 'randomString1',
        },
      ]);
      expect(errorRows).toHaveLength(0);
    });

    it('should reject with validation errors if any', async () => {
      const buffer2 = Buffer.from(
        'uid,firstName,lastName,gender\n1,John,Doe,male\n',
      );

      const error = new ValidationError();
      error.property = 'date';
      error.constraints = {
        isNotEmpty: 'date should not be empty',
      };
      const { validatedRows, errorRows } =
        await service.parseAndValidateCsv(buffer2);
      expect(errorRows).toHaveLength(1);
      expect(validatedRows).toHaveLength(0);

      expect(errorRows[0].errors[0].property).toEqual('date');
    });
  });

  describe('zipAndSeparateCsv', () => {
    it('should zip and separate CSV', async () => {
      const rows: RowDto[] = [
        {
          uid: '1',
          firstName: 'John',
          lastName: 'Doe',
          gender: 'male',
          date: '',
          randomString1: '',
        },
      ];
      const rows2: RowDto[] = [
        {
          uid: '1',
          firstName: 'John',
          lastName: 'Doe',
          gender: 'male',
          date: '',
          randomString1: '',
        },
      ];
      const zipBuffer = await service.zipAndSeparateCsv(rows, rows2);
      expect(zipBuffer).toBeInstanceOf(Buffer);
    });

    it('should throw error if file streams encounter an error', async () => {
      const rows: RowDto[] = [
        {
          uid: '1',
          firstName: 'John',
          lastName: 'Doe',
          gender: 'male',
          date: '',
          randomString1: '',
        },
      ];
      const rows2: RowDto[] = [
        {
          uid: '1',
          firstName: 'John',
          lastName: 'Doe',
          gender: 'male',
          date: '',
          randomString1: '',
        },
      ];
      jest.spyOn(fs, 'createWriteStream').mockImplementationOnce(() => {
        throw new Error();
      });
      await expect(
        service.zipAndSeparateCsv(rows, rows2),
      ).rejects.toThrowError();
    });
  });
});
