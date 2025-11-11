import { DtlButtonSchema } from './dtl-button-schema';

/**
 * Schema per bottoni export - Angular 20 compatible
 */
export interface DtlExportButtonSchema extends DtlButtonSchema {
    Type: "CSV" | "Excel" | "PDF";
    allowColumnsSelection?: boolean;
    ExportAction?: any;
}