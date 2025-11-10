/**
 * First Example - Esempio principale con tutte le funzionalità base
 *
 * Questo esempio mostra:
 * - Tipi di colonna diversi (string, number, currency, date, check, button)
 * - Filtri e ordinamento
 * - Paginazione
 * - Selezione righe
 * - Export Excel/CSV
 * - Footer con calcoli
 * - Template personalizzati
 */

export { TABLE_SCHEMA } from './schema';
export { SAMPLE_DATA } from './data';

export const EXAMPLE_INFO = {
    name: 'First Example - Ordini Clienti',
    description: 'Esempio completo con gestione ordini clienti, mostra tutte le funzionalità principali',
    features: [
        'Tutti i tipi di colonna',
        'Filtri e ordinamento',
        'Paginazione',
        'Export Excel/CSV',
        'Footer con totali',
        'Template personalizzati',
        'Bottoni azione'
    ],
    dataRows: 50,
    complexity: 'medium'
};