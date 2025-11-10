/**
 * Definizione delle colonne utilizzate all'interno delle righe di footer.
 */
export interface DtlFooterColumn {
  template: string;
  colspan?: number;
  align?: '' | 'left' | 'center' | 'right';
  cellClass?: Record<string, boolean> | string[];
  cellStyle?: Record<string, string | number>;
}
