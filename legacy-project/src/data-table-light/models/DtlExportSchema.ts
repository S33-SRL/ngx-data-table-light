export interface DtlExportSchema {
    filename: string;

    sheetname?: string;
    allowColumnsSelection?: boolean;
    exportColumns: Array<DtlExportColumn>;
}

export interface DtlExportColumn {
    name: string;
    field?: any;
    fieldPath?: any;
    type?: ""|"string" | "number" | "date";
    visible?: any;
    width?: number;
}