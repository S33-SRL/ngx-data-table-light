# First Example - Esempio Principale

Questo è l'esempio principale che mostra tutte le funzionalità base di NgxDataTableLight.

## Contenuto

- `schema.ts` - Configurazione completa della tabella
- `data.ts` - Dataset di esempio (ordini clienti)
- `index.ts` - Export principale e metadati

## Funzionalità Dimostrate

### Tipi di Colonna
- **String/Text**: Nome cliente, codice ordine
- **Number**: Quantità
- **Currency**: Prezzi e totali
- **Date**: Date ordine e consegna
- **Check**: Stati boolean
- **Button**: Azioni (modifica, elimina)

### Features
- ✅ Filtri su colonne multiple
- ✅ Ordinamento multi-colonna
- ✅ Paginazione configurabile
- ✅ Selezione righe singola/multipla
- ✅ Export Excel e CSV
- ✅ Footer con calcoli totali
- ✅ Template HTML personalizzati
- ✅ Tooltip informativi

## Come Usare

```typescript
// In projects/dtl-demo-app/src/app/app.ts
import { TABLE_SCHEMA, SAMPLE_DATA } from '../../../../test-examples/firstExample';

export class App {
    tableSchema = signal<DtlDataSchema>(TABLE_SCHEMA);
    sampleData = signal(SAMPLE_DATA);
}
```

## Dataset

Il dataset contiene 50 ordini di esempio con:
- Informazioni cliente
- Dettagli prodotto
- Date e stati ordine
- Importi e totali
- Stakeholders associati

## Note

Questo esempio è progettato per essere il punto di partenza per comprendere tutte le funzionalità del componente. È moderatamente complesso ma ben documentato.