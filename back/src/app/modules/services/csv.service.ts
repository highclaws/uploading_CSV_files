import { Injectable } from '@nestjs/common';
import * as csvParse from 'csv-parse';

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RowDto } from '@/modules/upload/validators/Upload.dto';
import { IErrorRow } from '@/modules/services/csv.interface';

import { Workbook, Worksheet } from 'exceljs';
import * as AdmZip from 'adm-zip';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class CsvService {
  public async parseAndValidateCsv(
    buffer: Buffer,
  ): Promise<{ validatedRows: RowDto[]; errorRows: IErrorRow[] }> {
    return new Promise<{ validatedRows: RowDto[]; errorRows: IErrorRow[] }>(
      (resolve, reject) => {
        csvParse.parse(buffer, { columns: true }, async (err, rawArrayData) => {
          if (err) {
            reject(err);
          } else {
            const validatedRows: RowDto[] = [];
            const errorRows: IErrorRow[] = [];
            for (const [index, row] of rawArrayData.entries()) {
              const validatedRow = plainToInstance(RowDto, row);
              const errors = await validate(validatedRow);
              if (errors.length > 0) {
                errorRows.push({ rowIndex: index, errors });
              } else {
                validatedRows.push(validatedRow);
              }
            }

            if (errorRows.length > 0) {
              resolve({ validatedRows, errorRows });
            } else {
              resolve({ validatedRows, errorRows });
            }
          }
        });
      },
    );
  }

  private createWorkbook(gender: string): Workbook {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(gender);
    worksheet.columns = [
      { header: 'uid', key: 'uid' },
      { header: 'firstName', key: 'firstName' },
      { header: 'lastName', key: 'lastName' },
      { header: 'gender', key: 'gender' },
      { header: 'date', key: 'date' },
      { header: 'randomString1', key: 'randomString1' },
    ];

    return workbook;
  }

  private async writeDataToWorkbook(
    workbook: Worksheet,
    data: RowDto[],
  ): Promise<void> {
    data.forEach((row) => {
      workbook.addRow([
        row.uid,
        row.firstName,
        row.lastName,
        row.gender,
        row.date,
        row.randomString1,
      ]);
    });
  }

  public async zipAndSeparateCsv(
    maleData: RowDto[],
    femaleData: RowDto[],
  ): Promise<Buffer> {
    const maleWorkbook = this.createWorkbook('Male');
    const femaleWorkbook = this.createWorkbook('Female');

    const maleWorksheet = maleWorkbook.getWorksheet('Male');
    const femaleWorksheet = femaleWorkbook.getWorksheet('Female');

    await this.writeDataToWorkbook(maleWorksheet, maleData);
    await this.writeDataToWorkbook(femaleWorksheet, femaleData);

    const tempMalePath = join(process.cwd(), 'temp/male.csv');
    const tempFemalePath = join(process.cwd(), 'temp/female.csv');

    await maleWorkbook.csv.writeFile(tempMalePath);
    await femaleWorkbook.csv.writeFile(tempFemalePath);

    const zip = new AdmZip();
    zip.addLocalFile(tempMalePath);
    zip.addLocalFile(tempFemalePath);

    const zipBuffer = zip.toBuffer();

    fs.unlinkSync(tempMalePath);
    fs.unlinkSync(tempFemalePath);
    console.log(zipBuffer.length);
    return zipBuffer;
  }
}
