# Test Comparativo Sistemi di Templating

## Setup Completato ✅

Abbiamo creato un sistema di test per confrontare tre implementazioni di templating:

1. **NgxDataTableLight** (nuovo sistema)
2. **InterpolateService** (legacy da `legacy-project/src/functions/`)
3. **ts-templater** (libreria npm v0.4.2)

## Come Testare

### 1. Avviare la Demo App
```bash
ng build ngx-data-table-light && ng serve dtl-demo-app
```

### 2. Navigare al Test
- Apri: http://localhost:4200
- Clicca sul tab "Test Templating"
- Clicca su "Esegui Test"

## Test Implementati

### Template di Test
```typescript
const TEST_TEMPLATES = {
    simple: '{code}',                    // Interpolazione semplice
    nested: '{customer.name}',           // Path nidificato
    complex: '{stakeholders[0].stakeholder.name}', // Array access
    multiple: '{code} - {customer.name} {customer.surname}', // Multiple
    dateFormat: '{@Date|{date}|DD/MM/YYYY}', // Formattazione date
    currency: '{@Currency|{total}|EUR}',     // Formattazione valuta
    conditional: '{@If|{status}|==|completed|Completato|In Corso}', // If
    mathSum: '{@Math|{unitPrice}|+|{quantity}}', // Operazioni matematiche
    switchCase: '{@Switch|{status}|completed|Completato|pending|In Attesa|...}' // Switch
};
```

## Risultati Attesi

### Sintassi Simili ✅
- **Interpolazione base**: `{field}` - Uguale in tutti e tre
- **Path nidificati**: `{obj.prop}` - Uguale in tutti e tre
- **Funzioni**: `{@Function|param}` - Sintassi molto simile

### Differenze Chiave 🔍

#### 1. Nome del Metodo
- **InterpolateService**: `parserStringNasted()` (nota il typo "Nasted")
- **TsTemplater**: `parseTemplate()`
- **NgxDataTableLight**: Da implementare

#### 2. Funzioni Disponibili

| Funzione | InterpolateService | TsTemplater | NgxDataTableLight |
|----------|-------------------|-------------|----------------|
| If | ✅ | ✅ | Da verificare |
| Date | ✅ | ✅ | Da verificare |
| Currency | ✅ | ❌ (commentato) | Da verificare |
| Math | ✅ | ✅ | Da verificare |
| Switch | ✅ | ✅ | Da verificare |
| Sum | ✅ | ✅ | Da verificare |
| IsNull | ✅ | ✅ | Da verificare |
| Not | ✅ | ✅ | Da verificare |
| ToBool | ✅ | ✅ (come Bool) | Da verificare |
| ToNumber | ✅ | ✅ (come Number) | Da verificare |
| PadStart/End | ✅ | ✅ | Da verificare |
| ArrayConcat | ✅ | ✅ | Da verificare |
| ArraySum | ✅ | ✅ | Da verificare |
| FromOther | ✅ | ❌ | Da verificare |
| Contains | ✅ | ✅ | Da verificare |
| Json | ❌ | ✅ | Da verificare |

#### 3. Dipendenze
- **InterpolateService**: Richiede `CurrencyPipe` di Angular
- **TsTemplater**: Standalone, no dipendenze Angular
- **NgxDataTableLight**: Integrato nel componente

## Osservazioni Importanti

### 1. InterpolateService vs TsTemplater
Sono MOLTO simili nel codice! Probabilmente:
- `TsTemplater` è una versione refactored e pubblicata su npm
- `InterpolateService` è la versione originale integrata con Angular
- Condividono la maggior parte della logica

### 2. Currency Support
- `InterpolateService` ha Currency completo (usa Angular CurrencyPipe)
- `TsTemplater` ha Currency commentato (per non dipendere da Angular)
- Questo spiega perché ci sono due versioni

### 3. Eval Warning
Entrambi usano `eval()` per le operazioni matematiche (riga 258 di InterpolateService).
Questo genera warning nel bundler ma funziona.

## Prossimi Passi

1. **Eseguire i test** nella demo app
2. **Documentare le differenze** reali trovate
3. **Implementare il templating** in NgxDataTableLight per allinearlo
4. **Decidere** quale sistema usare:
   - Mantenere compatibilità con legacy?
   - Usare ts-templater come dipendenza?
   - Implementazione custom ottimizzata?

## Codice di Test

### Componente: `projects/dtl-demo-app/src/app/templating-test.component.ts`
Test UI per confronto visuale

### Test Logic: `test-examples/comparisons/templating-test.ts`
Logica di test isolata

### Schema Legacy: `test-examples/legacy-format/example-legacy-schema.ts`
Esempio di schema nel formato legacy

## Conclusioni Preliminari

1. **La migrazione dovrebbe essere relativamente semplice** perché la sintassi è molto simile
2. **Il sistema legacy è ben progettato** con funzioni utili
3. **ts-templater è probabilmente la stessa codebase** pubblicata come libreria
4. **NgxDataTableLight potrebbe usare ts-templater** direttamente invece di reimplementare

---

**NOTA**: I test reali devono essere eseguiti nella demo app per confermare queste ipotesi!