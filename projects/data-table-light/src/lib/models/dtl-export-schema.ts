/**
 * Schema per configurazione export - Angular 20 compatible
 */
export interface DtlExportSchema {
    filename: string;
    sheetname?: string;
    allowColumnsSelection?: boolean;
    exportColumns: DtlExportColumn[];
}

export interface DtlExportColumn {
    name: string;
    field?: string;
    fieldPath?: string;
    type?: "" | "string" | "number" | "date" | "boolean" | "currency" | "percent";
    visible?: boolean;
    width?: number;
}
