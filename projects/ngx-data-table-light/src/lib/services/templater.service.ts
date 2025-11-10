import { Injectable } from '@angular/core';
import { TsTemplater } from 'ts-templater';

/**
 * Service per templating usando TsTemplater - Angular 20 Zoneless compatible
 * Sostituisce InterpolateService per migliori performance e type safety
 */
@Injectable({
  providedIn: 'root'
})
export class TemplaterService {
  private templater: TsTemplater;

  constructor() {
    // Inizializza TsTemplater senza cambio locale automatico
    this.templater = new TsTemplater();

    // Aggiungi funzioni custom per compatibilità legacy
    this.setupLegacyFunctions();
  }

  /**
   * Setup funzioni custom per compatibilità con InterpolateService legacy
   */
  private setupLegacyFunctions(): void {
    this.templater.setFunctions({
      // @Currency - Formattazione valuta (CRITICO - mancante in ts-templater)
      Currency: (params: any[]) => {
        if (!params || params.length < 1) return null;
        const value = Number(params[0]);
        if (isNaN(value)) return params[0];

        const currency = params[1] || 'EUR';
        const locale = params[2] || 'it-IT';

        try {
          return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(value);
        } catch (error) {
          console.error('Currency formatting error:', error);
          return params[0];
        }
      },

      // @FromOther - Accesso a otherData (supporto legacy syntax {##@FromOther})
      FromOther: (otherData: any, data: any, params: any[]) => {
        if (!params || params.length < 1) return null;
        const key = params[0];
        return otherData?.[key] ?? null;
      }
    });
  }

  /**
   * Parsa template sostituendo placeholder con dati
   * Compatibile con InterpolateService.parserStringNasted()
   */
  parseTemplate(
    template: string,
    data: any,
    otherData?: any,
    selectorOpen = '{',
    selectorClose = '}'
  ): string {
    try {
      return this.templater.parse(template, data, otherData, selectorOpen, selectorClose);
    } catch (error) {
      console.error('Template parsing error:', error);
      return template; // Fallback: return original template
    }
  }

  /**
   * Valuta espressione preservando tipo originale
   */
  evaluate(expression: string, data: any, otherData?: any): any {
    try {
      return this.templater.evaluate(expression, data, otherData);
    } catch (error) {
      console.error('Expression evaluation error:', error);
      return undefined;
    }
  }

  /**
   * Imposta funzioni custom per TsTemplater
   */
  setCustomFunctions(functions: Record<string, any>): void {
    this.templater.setFunctions(functions);
  }

  /**
   * Pulisce cache per performance
   */
  clearCache(): void {
    this.templater.cleanCache();
  }

  /**
   * Verifica se cache è abilitata
   */
  isCacheEnabled(): boolean {
    return this.templater.isCacheEnabled();
  }

  /**
   * Cambia locale per formattazione date
   */
  async changeLocale(locale: string): Promise<void> {
    await this.templater.changeDayjsLocale(locale);
  }
}
