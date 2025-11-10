import { DtlFooterColumn } from './dtl-footer-column';

/**
 * Struttura di una riga footer composta da più colonne/template.
 */
export interface DtlFooterRow {
  columns: DtlFooterColumn[];
  class?: Record<string, boolean> | string[];
  style?: Record<string, string | number>;
}
