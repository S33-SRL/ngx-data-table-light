# Costanti dell'Applicazione

Questa cartella contiene tutte le costanti esterne utilizzate nell'applicazione per migliorare la manutenibilità e la leggibilità del codice.

## Struttura dei File

### `table.constants.ts`
Contiene la configurazione completa dello schema della tabella NgxDataTableLight, incluse:
- **TABLE_SCHEMA**: Schema completo della tabella con colonne, pulsanti ed esportazioni
- **MAX_ROWS_OPTIONS**: Opzioni per il numero massimo di righe visualizzabili
- **NO_DATA_MESSAGE**: Messaggio da mostrare quando non ci sono dati
- **PAGER_LABELS**: Etichette per i controlli di paginazione
- **TABLE_CSS_CLASSES**: Classi CSS per la tabella
- **TABLE_STYLES**: Stili inline per la tabella

### `sample-data.constants.ts`
Contiene i dati di esempio per testare il componente:
- **SAMPLE_DATA**: Array completo di ordini clienti per il test del componente
- **SIMPLE_SAMPLE_DATA**: Dati semplificati per test rapidi

### `config.constants.ts`
Contiene configurazioni generali dell'applicazione:
- **TABLE_CONFIG**: Configurazioni booleane e numeriche per la tabella
- **UI_COLORS**: Palette colori dell'interfaccia utente
- **LAYOUT_CONFIG**: Dimensioni e layout dell'interfaccia

### `index.ts`
File di esportazione centralizzato che espone tutte le costanti da un singolo punto di accesso.

## Utilizzo

```typescript
// Importa le costanti necessarie
import { TABLE_SCHEMA, SAMPLE_DATA, TABLE_CONFIG } from './constants';

// Utilizza nelle tue componenti
export class MyComponent {
  tableSchema = signal(TABLE_SCHEMA);
  data = signal(SAMPLE_DATA);
}
```

## Vantaggi

1. **Manutenibilità**: Tutte le costanti sono centralizzate e facili da modificare
2. **Leggibilità**: Il codice dei componenti è più pulito e focalizzato sulla logica
3. **Riusabilità**: Le costanti possono essere facilmente condivise tra componenti
4. **Type Safety**: TypeScript può verificare i tipi delle costanti
5. **Documentazione**: Ogni costante è documentata con commenti JSDoc

## Note per lo Sviluppatore

- Mantieni sempre aggiornata la documentazione quando aggiungi nuove costanti
- Usa nomi descrittivi e costanti per le costanti (es. `UPPER_SNAKE_CASE`)
- Raggruppa le costanti correlate nello stesso file
- Utilizza `as const` per le costanti che non devono essere modificate
- Esporta sempre le nuove costanti attraverso il file `index.ts`