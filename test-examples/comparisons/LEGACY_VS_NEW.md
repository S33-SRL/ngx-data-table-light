# Analisi Confronto: Legacy DataTable vs DataTableLight

## Sistema di Templating

### Legacy System
- **Libreria**: Custom - `InterpolateService` e `TsTemplater`
- **Sintassi**: `{campo}` con funzioni `{@NomeFunzione|param1|param2}`
- **Path**: `legacy-project/src/functions/`

### Funzioni Disponibili nel Legacy

#### InterpolateService
- `@If` - Condizionale
- `@IsNull` - Check null
- `@Switch` / `@SwitchInsensitive` - Switch case
- `@Date` - Formattazione date
- `@Currency` - Formattazione valuta
- `@Not` - Negazione
- `@ToBool` / `@ToNumber` - Conversioni
- `@PadStart` / `@PadEnd` - Padding stringhe
- `@ArrayConcat` / `@ArraySum` - Operazioni array
- `@Sum` - Somma valori
- `@FromOther` - Dati da altra fonte
- `@Math` - Operazioni matematiche
- `@Contains` - Check contenuto

#### TsTemplater (versione semplificata)
Versione più leggera con subset di funzioni, usata per template più semplici.

### Nuovo Sistema (DataTableLight)
- **Sistema**: Templating integrato nel componente
- **Sintassi**: Simile `{campo}` con `{@Funzione|params}`
- **Differenza chiave**: Sistema più integrato e ottimizzato

## Dipendenze

### Legacy
```json
{
  "dependencies": {
    "@ng-bootstrap/ng-bootstrap": "versione?",
    "@ng-select/ng-select": "versione?",
    "ngx-ui-scroll": "per virtual scroll",
    "export-xlsx": "per export Excel",
    "bignumber.js": "calcoli precisi",
    "dayjs": "gestione date",
    "moment": "anche moment (duplicazione?)"
  }
}
```

### Nuovo
- Dipendenze minime
- Export integrato
- Virtual scroll custom

## Struttura Modelli

### Similitudini
Entrambi i sistemi usano nomi simili per i modelli:
- `DtlDataSchema` - Schema principale
- `DtlColumnSchema` - Configurazione colonne
- `DtlButtonSchema` - Configurazione bottoni
- `DtlExportSchema` - Export configuration
- `DtlFooterRow/Column/Box` - Footer elements

### Differenze Principali

#### Naming Convention
- **Legacy**: PascalCase nei file (`DtlDataSchema.ts`)
- **Nuovo**: kebab-case (`dtl-data-schema.ts`)

#### Import Paths
- **Legacy**: Percorsi assoluti (`app/shared/functions/...`)
- **Nuovo**: Percorsi relativi e barrel exports

## Funzionalità Comparate

| Feature | Legacy | Nuovo | Note |
|---------|--------|-------|------|
| Virtual Scroll | ✅ ngx-ui-scroll | ✅ Custom | Nuovo più integrato |
| Export Excel | ✅ export-xlsx | ✅ Integrato | |
| Templating | ✅ InterpolateService | ✅ Built-in | Sintassi simile |
| Multi-lingua | ✅ dayjs locales | ⚠️ Da verificare | |
| BigNumber | ✅ bignumber.js | ⚠️ Da verificare | Per calcoli precisi |
| Pipes Safe | ✅ SafePipe custom | ❌ | Security feature |
| CheckList Selector | ✅ Component esterno | ⚠️ | Da integrare |

## Componenti Mancanti nel Nuovo

1. **SafePipe** - Pipe per sanitizzazione HTML
2. **CheckListSelectorComponent** - Selezione multipla per export colonne
3. **NgbModal** - Modali Bootstrap (sostituibile)
4. **NgSelect** - Select avanzata (sostituibile)

## Come Procedere con l'Integrazione

### 1. NON Modificare il Legacy
Il codice legacy deve restare intatto per confronti.

### 2. Creare Adapter Layer
```typescript
// adapter/legacy-adapter.ts
export class LegacyAdapter {
    // Converte schema legacy in nuovo formato
    static convertSchema(legacy: LegacyDataTable.DataSchema): DtlDataSchema {
        // Mappatura proprietà
    }
}
```

### 3. Test Side-by-Side
Nella demo app mostrare entrambe le versioni:
- Legacy table (se possibile con dipendenze)
- New table con stesso schema convertito
- Metriche performance comparative

## Note Importanti

### Sistema di Templating Legacy
Il legacy usa DUE sistemi di templating:
1. **InterpolateService** - Completo con CurrencyPipe Angular
2. **TsTemplater** - Versione standalone senza dipendenze Angular

Questo suggerisce che il legacy era usato sia in contesti Angular che non-Angular.

### Virtual Scroll
Legacy usa `ngx-ui-scroll` che è una libreria esterna matura.
Il nuovo sistema ha un'implementazione custom che potrebbe necessitare ottimizzazioni.

### Export
Legacy usa `export-xlsx` library esterna.
Nuovo ha implementazione integrata - verificare feature parity.

## Prossimi Passi

1. ✅ Analizzare struttura legacy
2. ✅ Identificare sistema templating
3. ⬜ Creare schema di esempio in formato legacy
4. ⬜ Convertire in formato nuovo
5. ⬜ Testare nella demo app
6. ⬜ Documentare differenze performance
7. ⬜ Creare guida migrazione