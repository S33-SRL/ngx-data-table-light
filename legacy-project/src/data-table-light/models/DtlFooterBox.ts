export interface DtlFooterBox {
  label?: string;
  value?: string;
  template?: string;
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  boxClass?: string;
  boxStyle?: any;
  customClass?: string;
}