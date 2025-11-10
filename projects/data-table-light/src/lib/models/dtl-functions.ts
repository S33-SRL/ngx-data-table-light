/**
 * Collezione di funzioni custom esposte al templater.
 */
export interface DtlFunctions {
  [key: string]: (...args: any[]) => any;
}
