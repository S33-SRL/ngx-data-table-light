/**
 * Export principale del progetto legacy
 *
 * IMPORTANTE: Questo file espone solo i modelli e le utility del sistema legacy
 * per permettere confronti e analisi SENZA modificare il codice originale.
 *
 * Il codice legacy resta completamente intatto nelle sue cartelle originali.
 */

// Export dei modelli legacy (senza modifiche)
export { DtlButtonSchema } from './src/data-table-light/models/DtlButtonSchema';
export { DtlColumnSchema } from './src/data-table-light/models/DtlColumnSchema';
export { DtlDataSchema } from './src/data-table-light/models/DtlDataSchema';
export { DtlEventSchema } from './src/data-table-light/models/DtlEventSchema';
export { DtlExportButtonSchema } from './src/data-table-light/models/DtlExportButtonSchema';
export { DtlExportSchema } from './src/data-table-light/models/DtlExportSchema';
export { DtlFooterBox } from './src/data-table-light/models/DtlFooterBox';
export { DtlFooterColumn } from './src/data-table-light/models/DtlFooterColumn';
export { DtlFooterRow } from './src/data-table-light/models/DtlFooterRow';
export { DtlFunctions } from './src/data-table-light/models/DtlFunctions';
export { DtlRowOptions } from './src/data-table-light/models/DtlRowOptions';

// Export delle funzioni di templating (per analisi)
export { InterpolateService } from './src/functions/iterpolate-service';
export { TsTemplater } from './src/functions/ts-templater';

// Namespace per distinguere legacy da nuovo
export namespace LegacyDataTable {
    export type ButtonSchema = import('./src/data-table-light/models/DtlButtonSchema').DtlButtonSchema;
    export type ColumnSchema = import('./src/data-table-light/models/DtlColumnSchema').DtlColumnSchema;
    export type DataSchema = import('./src/data-table-light/models/DtlDataSchema').DtlDataSchema;
    export type ExportSchema = import('./src/data-table-light/models/DtlExportSchema').DtlExportSchema;
}