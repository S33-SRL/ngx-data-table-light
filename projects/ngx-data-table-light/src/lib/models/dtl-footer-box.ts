/**
 * Box riepilogativi mostrati nel footer della tabella.
 */
export interface DtlFooterBox {
  label?: string;
  template: string;
  type?: '' | 'primary' | 'success' | 'warning' | 'danger';
  boxClass?: Record<string, boolean> | string[];
  boxStyle?: Record<string, string | number>;
}
