import { DtlFooterColumn } from "./DtlFooterColumn";

export interface DtlFooterRow {
  columns: Array<DtlFooterColumn>;
  rowClass?: string;
  rowStyle?: any;
  customClass?: string;
}