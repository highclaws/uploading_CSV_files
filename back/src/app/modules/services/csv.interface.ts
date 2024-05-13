import { ValidationError } from 'class-validator';

export interface IErrorRow {
  rowIndex: string;
  errors: ValidationError[];
}
