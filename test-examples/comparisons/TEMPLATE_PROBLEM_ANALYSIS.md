# Analisi Problema Template NgxDataTableLight

## 🚨 Problema Identificato

### Template problematico
```
{year}/{@PadStart|{incremental}|6|0}
```

### Comportamento atteso
- **year**: dovrebbe essere l'anno (es. "2024")
- **incremental**: dovrebbe essere un numero (es. "42")
- **@PadStart**: dovrebbe formattare il numero con padding di zeri
- **Risultato atteso**: "2024/000042"

### Comportamento attuale
NgxDataTableLight non sta processando correttamente i template e mostra il template raw o risultati errati.

## 🔍 Causa del Problema

NgxDataTableLight attualmente:
1. **NON usa ts-templater** per processare i template
2. Ha una sua implementazione interna che non supporta tutte le funzioni
3. Non è compatibile con la sintassi legacy

## ✅ Soluzione Proposta

### Integrare ts-templater in NgxDataTableLight

```typescript
// In ngx-data-table-light.component.ts
import { TsTemplater } from 'ts-templater';

export class NgxDataTableLightComponent {
    private templater = new TsTemplater('it');

    processTemplate(template: string, data: any): string {
        return this.templater.parse(template, data);
    }
}
```

### Vantaggi
1. **Compatibilità totale** con il sistema legacy
2. **Tutte le funzioni** già implementate e testate
3. **Nessuna duplicazione** di codice
4. **Manutenzione semplificata**

## 📊 Confronto Side-by-Side

### Struttura creata
```
projects/dtl-demo-app/src/app/
├── table-comparison.component.ts  # Nuovo componente per confronto
├── app.html                       # Aggiunto tab "Confronto Side-by-Side"
└── app.ts                         # Aggiornato con nuovo componente
```

### Componente Legacy
- **Rinominato selector**: da `app-ngx-data-table-light` a `app-ngx-data-table-light-legacy`
- Evita conflitti di nome
- Permette uso side-by-side quando sarà pronto

## 📸 Screenshot

Salvare screenshot in: `test-examples/screenshots/`

Suggerimenti per screenshot:
1. Screenshot del template errato in NgxDataTableLight
2. Screenshot dello stesso template nel legacy (se disponibile)
3. Confronto dei risultati

## 🛠️ Prossimi Passi

### 1. Immediato (Quick Fix)
Aggiungere ts-templater a NgxDataTableLight per processare i template:
```bash
# Il componente già ha accesso a ts-templater
# Solo integrare nel codice
```

### 2. Test
- Verificare che tutti i template funzionino
- Confrontare output con legacy
- Testare performance

### 3. Documentazione
- Documentare tutte le funzioni supportate
- Esempi di utilizzo
- Migration guide

## 📝 Note Tecniche

### Funzioni da supportare
- `@PadStart` - Padding a sinistra
- `@PadEnd` - Padding a destra
- `@Date` - Formattazione date
- `@Currency` - Formattazione valuta
- `@If` - Condizionali
- `@Switch` - Switch case
- `@Math` - Operazioni matematiche
- `@Sum` - Somme
- Tutte le altre in ts-templater

### Template complessi
Il sistema deve supportare template nidificati come:
- `{@Function1|{@Function2|{field}}}`
- `{field1}/{@PadStart|{field2}|6|0}`
- Array access: `{items[0].name}`

## 🎯 Conclusione

**Il problema è chiaro**: NgxDataTableLight deve usare ts-templater per essere compatibile con il sistema legacy.

La soluzione è semplice e già disponibile. Non c'è bisogno di reimplementare tutto da zero.