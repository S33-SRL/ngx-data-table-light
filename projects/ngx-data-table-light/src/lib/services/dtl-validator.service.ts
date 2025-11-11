import { Injectable } from '@angular/core';
import { DtlDataSchema, DtlColumnSchema, DtlButtonSchema } from '../models';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  severity: 'error';
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  severity: 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class DtlValidatorService {

  validateSchema(schema: DtlDataSchema | null | undefined): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!schema) {
      errors.push({
        field: 'schema',
        message: 'Lo schema non puo essere null o undefined',
        code: 'SCHEMA_NULL',
        severity: 'error'
      });
      return { valid: false, errors, warnings };
    }

    if (!schema.columns || !Array.isArray(schema.columns)) {
      errors.push({
        field: 'schema.columns',
        message: 'Le colonne devono essere un array',
        code: 'COLUMNS_NOT_ARRAY',
        severity: 'error'
      });
    } else if (schema.columns.length === 0) {
      warnings.push({
        field: 'schema.columns',
        message: 'Nessuna colonna definita',
        code: 'COLUMNS_EMPTY',
        severity: 'warning'
      });
    } else {
      schema.columns.forEach((column, index) => {
        this.validateColumn(column, index, errors, warnings);
      });
    }

    if (schema.buttons && Array.isArray(schema.buttons)) {
      schema.buttons.forEach((button, index) => {
        this.validateButton(button, index, errors, warnings);
      });
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  private validateColumn(column: DtlColumnSchema, index: number, errors: ValidationError[], warnings: ValidationWarning[]): void {
    const prefix = 'schema.columns[' + index + ']';

    if (!column.field) {
      errors.push({
        field: prefix + '.field',
        message: 'Colonna senza campo field',
        code: 'COLUMN_MISSING_FIELD',
        severity: 'error'
      });
    }

    if (column.type === 'button' && !column.buttonConfig) {
      errors.push({
        field: prefix + '.buttonConfig',
        message: 'Colonna button senza buttonConfig',
        code: 'BUTTON_MISSING_CONFIG',
        severity: 'error'
      });
    }

    if (!column.name && !column.nameRendered) {
      warnings.push({
        field: prefix + '.name',
        message: 'Colonna senza nome',
        code: 'COLUMN_MISSING_NAME',
        severity: 'warning'
      });
    }
  }

  private validateButton(button: DtlButtonSchema, index: number, errors: ValidationError[], warnings: ValidationWarning[]): void {
    const prefix = 'schema.buttons[' + index + ']';

    if (!button.name) {
      errors.push({
        field: prefix + '.name',
        message: 'Bottone senza name',
        code: 'BUTTON_MISSING_NAME',
        severity: 'error'
      });
    }

    if (!button.callback) {
      errors.push({
        field: prefix + '.callback',
        message: 'Bottone senza callback',
        code: 'BUTTON_MISSING_CALLBACK',
        severity: 'error'
      });
    }
  }

  validateData(data: any[] | null | undefined, schema: DtlDataSchema | null | undefined): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!data) {
      warnings.push({
        field: 'data',
        message: 'Dati null o undefined',
        code: 'DATA_NULL',
        severity: 'warning'
      });
      return { valid: true, errors, warnings };
    }

    if (!Array.isArray(data)) {
      errors.push({
        field: 'data',
        message: 'I dati devono essere un array',
        code: 'DATA_NOT_ARRAY',
        severity: 'error'
      });
      return { valid: false, errors, warnings };
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  validateAll(data: any[] | null | undefined, schema: DtlDataSchema | null | undefined): ValidationResult {
    const schemaResult = this.validateSchema(schema);
    const dataResult = this.validateData(data, schema);

    return {
      valid: schemaResult.valid && dataResult.valid,
      errors: [...schemaResult.errors, ...dataResult.errors],
      warnings: [...schemaResult.warnings, ...dataResult.warnings]
    };
  }

  formatValidationResult(result: ValidationResult): string {
    const lines: string[] = [];

    if (result.valid) {
      lines.push('Validazione superata');
    } else {
      lines.push('Validazione fallita');
    }

    if (result.errors.length > 0) {
      lines.push('\nERRORI:');
      result.errors.forEach(error => {
        lines.push('  [' + error.code + '] ' + error.field + ': ' + error.message);
      });
    }

    if (result.warnings.length > 0) {
      lines.push('\nWARNING:');
      result.warnings.forEach(warning => {
        lines.push('  [' + warning.code + '] ' + warning.field + ': ' + warning.message);
      });
    }

    return lines.join('\n');
  }
}
