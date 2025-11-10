import { DtlButtonSchema } from "./DtlButtonSchema";

export interface DtlExportButtonSchema extends DtlButtonSchema {
    Type: "CSV" | "Excel" | "PDF";
    allowColumnsSelection?: boolean;
    ExportAction?: any
}