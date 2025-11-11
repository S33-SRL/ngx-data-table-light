# 📊 Report Comparativo: Legacy vs NgxDataTableLight

**Data**: 2025-11-10
**Versione Legacy**: DataTableLightComponent (Angular pre-20)
**Versione Nuova**: NgxDataTableLightComponent v1.0.0 (Angular 20)

---

## 🎯 Executive Summary

Il componente **NgxDataTableLight** è una riscrittura moderna che introduce architettura Signal-based e zoneless, ma presenta **alcuni gap funzionali critici** rispetto al legacy che è già in produzione.

### ⚠️ CRITICITÀ IDENTIFICATE

1. **Mancano metodi pubblici essenziali** per aggiornamento dinamico
2. **Sistema di templating non completamente integrato**
3. **Dipendenze mancanti** (SafePipe, CheckListSelector)
4. **Virtual scroll reimplementato** (invece di ngx-ui-scroll)

---

## 📋 Tabella Comparativa Funzionalità

### ✅ = Implementato | ⚠️ = Parziale | ❌ = Mancante | 🆕 = Migliorato

| Funzionalità | Legacy | NgxDataTableLight | Note |
|--------------|--------|-------------------|------|
| **CORE** | | | |
| Data binding | ✅ | ✅ | |
| Signal-based reactive | ❌ | 🆕 | Nuovo usa Signals |
| Zoneless architecture | ❌ | 🆕 | Angular 20+ |
| **COLONNE** | | | |
| Tipizzazione colonne | ✅ | ✅ | |
| Ridimensionamento | ✅ | ✅ | |
| Ordinamento | ✅ | ✅ | |
| Filtri | ✅ | ✅ | |
| Template custom | ✅ | ⚠️ | Vedi sezione templating |
| Tooltip | ✅ | ❌ | **MANCANTE** |
| Eventi cella (click, hover) | ✅ | ❌ | **MANCANTE** |
| **RIGHE** | | | |
| Selezione singola | ✅ | ✅ | |
| Selezione multipla | ✅ | ✅ | |
| Selezione con checkbox | ✅ | ✅ | |
| Doppio click | ✅ | ✅ | |
| Row detail expansion | ✅ | ❌ | **MANCANTE** |
| Row options (visible, disable) | ✅ | ❌ | **MANCANTE** |
| **PAGINAZIONE** | | | |
| Paginazione standard | ✅ | ✅ | |
| Opzioni righe/pagina | ✅ | ✅ | |
| Controlli paginazione | ✅ | ✅ | |
| **VIRTUAL SCROLL** | | | |
| Virtual scrolling | ✅ (ngx-ui-scroll) | ✅ (custom) | Implementazioni diverse |
| Buffer configurabile | ✅ | ✅ | |
| **EXPORT** | | | |
| Export Excel | ✅ | ✅ | |
| Export CSV | ✅ | ✅ | |
| Export PDF | ❌ | ✅ | **NUOVO** |
| Selezione colonne export | ✅ (CheckListSelector) | ⚠️ | Dialog semplificato |
| Preset export | ✅ | ✅ | |
| **FOOTER** | | | |
| Footer rows | ✅ | ✅ | |
| Footer boxes | ✅ | ✅ | |
| Footer collapsible | ✅ | ❌ | **MANCANTE** |
| **BOTTONI** | | | |
| Bottoni riga | ✅ | ✅ | |
| Template condizionali | ✅ | ⚠️ | Vedi templating |
| **TEMPLATING** | | | |
| InterpolateService | ✅ | ❌ | Sostituito da ts-templater |
| ts-templater | ❌ | ⚠️ | Presente ma non integrato |
| Funzioni custom | ✅ | ⚠️ | Metodo diverso |
| **METODI PUBBLICI** | | | |
| setInterpolateFunction() | ✅ | ❌ | **MANCANTE** |
| resetFooter() | ✅ | ❌ | **MANCANTE** |
| updateElement(index, newVal) | ✅ | ❌ | **CRITICO MANCANTE** |
| CleanFilter() | ✅ | ❌ | **MANCANTE** |
| ChangeFilter() | ✅ | ✅ (interno) | Non pubblico |
| exportSchema() | ✅ | ❌ | **MANCANTE** |
| getPagesArray() | ✅ | ✅ (interno) | Non pubblico |

---

## 🔴 GAP CRITICI (Production Blocker)

### 1. **Metodo `updateElement()` - CRITICO**

**Legacy:**
```typescript
public updateElement(index: number, newVal: any) {
  // Aggiorna elemento nel dataSource e riprocessa
}
```

**NgxDataTableLight:** ❌ **MANCANTE**

**Impatto:** Se il codice di produzione usa questo metodo per aggiornare righe dinamicamente, **l'applicazione si romperà**.

**Soluzione richiesta:** Implementare metodo pubblico compatibile.

---

### 2. **Tooltip su celle - CRITICO**

**Legacy:**
```typescript
@Input() col.tooltip?: string;
@Input() col.tooltipPlacement?: string;
@Input() col.tooltipTemplate?: string;

public showTooltip(row: any, col: DtlColumnSchema, $event: any)
public hideTooltip()
cellMouseEnterEvent(row, col, $event)
cellMouseLeaveEvent(row, col)
```

**NgxDataTableLight:** ❌ **COMPLETAMENTE MANCANTE**

**Impatto:** Funzionalità UX critica non disponibile.

**Soluzione richiesta:** Implementare sistema tooltip completo.

---

### 3. **Eventi di Cella - CRITICO**

**Legacy:**
```typescript
cellClickEvent(row: any, col: DtlColumnSchema, $event: any)
cellMouseEnterEvent(row: any, col: DtlColumnSchema, $event: any)
cellMouseLeaveEvent(row: any, col: DtlColumnSchema)
```

**NgxDataTableLight:** ❌ **MANCANTE**

**Impatto:** Eventi custom su celle non funzioneranno.

**Soluzione richiesta:** Implementare eventi di cella.

---

### 4. **Row Detail Expansion - MEDIO**

**Legacy:**
```typescript
private displayRowDetail(row: any)
private clearRowDetail()
```

**NgxDataTableLight:** ❌ **MANCANTE**

**Impatto:** Se il legacy usa row expansion, feature persa.

**Soluzione richiesta:** Implementare o documentare come alternativa.

---

### 5. **Row Options (visible/disable) - MEDIO**

**Legacy:**
```typescript
interface DtlRowOptions {
  visible?: string;    // Template condizionale per visibilità
  disable?: string;    // Template condizionale per disable
  class?: string;      // Classe CSS condizionale
  style?: string;      // Stili condizionali
}

private applyRowOptions(row: any): void
```

**NgxDataTableLight:** ❌ **MANCANTE**

**Impatto:** Righe non possono essere nascoste/disabilitate dinamicamente.

**Soluzione richiesta:** Implementare sistema row options.

---

## 🟡 GAP IMPORTANTI (Funzionalità Significative)

### 6. **Footer Collapsible**

**Legacy:**
```typescript
footerCollapsed: boolean = false;
```

**NgxDataTableLight:** ❌ **MANCANTE**

**Soluzione:** Aggiungere toggle per collassare footer.

---

### 7. **Metodo `setInterpolateFunction()`**

**Legacy:**
```typescript
public setInterpolateFunction(func: any) {
  this.interpolate.setFunctions(func);
}
```

**NgxDataTableLight:** ❌ **MANCANTE** (ma possibile via @Input functions)

**Nota:** Il nuovo usa `@Input() functions: DtlFunctions` ma non ha metodo pubblico per cambiarle runtime.

**Soluzione:** Verificare se @Input è sufficiente o implementare metodo pubblico.

---

### 8. **Metodo `resetFooter()`**

**Legacy:**
```typescript
public resetFooter() {
  this.footerHeightComputed = false;
}
```

**NgxDataTableLight:** ❌ **MANCANTE**

**Soluzione:** Implementare se necessario per aggiornamenti dinamici.

---

### 9. **Metodo `CleanFilter()`**

**Legacy:**
```typescript
public CleanFilter() {
  this.schema!.filters = {};
  this.updateListData(this.source);
}
```

**NgxDataTableLight:** ❌ **Non pubblico**

**Soluzione:** Esporre metodo pubblico per pulire filtri programmaticamente.

---

### 10. **Metodo `exportSchema()`**

**Legacy:**
```typescript
public exportSchema() {
  // Ritorna schema export configurato
}
```

**NgxDataTableLight:** ❌ **MANCANTE**

**Soluzione:** Implementare getter per schema export.

---

## 🔵 SISTEMA DI TEMPLATING - Analisi Dettagliata

### Architettura

| Aspetto | Legacy (InterpolateService) | Nuovo (ts-templater) |
|---------|---------------------------|---------------------|
| **Libreria** | Custom in-app | NPM package (v0.4.2) |
| **Dipendenze** | Angular CurrencyPipe | Standalone |
| **Sintassi base** | `{field}` | `{field}` ✅ |
| **Sintassi funzioni** | `{@Func\|params}` | `{@Func\|params}` ✅ |
| **Path nidificati** | `{obj.prop}` | `{obj.prop}` ✅ |
| **Array access** | `{arr[0]}`, `{arr[first]}`, `{arr[last]}` | ✅ Supportato |
| **Array filter** | `{arr[value,field1,field2]}` | ⚠️ Da verificare |
| **Cache** | ✅ | ✅ |

### Funzioni Supportate

| Funzione | InterpolateService | ts-templater | Note |
|----------|-------------------|--------------|------|
| `@If` | ✅ | ✅ | Condizionali |
| `@IsNull` | ✅ | ✅ | Null checking |
| `@Switch` | ✅ | ✅ | Switch case |
| `@SwitchInsensitive` | ✅ | ⚠️ | Da verificare |
| `@Date` | ✅ | ✅ | Date formatting (dayjs) |
| `@Currency` | ✅ (Angular pipe) | ❌ | **PROBLEMA CRITICO** |
| `@Math` | ✅ | ✅ | Operazioni matematiche |
| `@Sum` | ✅ | ✅ | Somma |
| `@Not` | ✅ | ✅ | Negazione booleana |
| `@ToBool` | ✅ | ✅ (come `Bool`) | Conversione bool |
| `@ToNumber` | ✅ | ✅ (come `Number`) | Conversione number |
| `@PadStart` | ✅ | ✅ | Padding sinistra |
| `@PadEnd` | ✅ | ✅ | Padding destra |
| `@ArrayConcat` | ✅ | ✅ | Concatenazione array |
| `@ArraySum` | ✅ | ✅ | Somma array |
| `@FromOther` | ✅ | ❌ | **MANCANTE** |
| `@Contains` | ✅ | ✅ | String contains |
| `@Json` | ❌ | ✅ | JSON stringify |

### 🔴 PROBLEMA TEMPLATING IDENTIFICATO

**Il nuovo componente ha `ts-templater` come dipendenza ma NON lo sta usando correttamente!**

**Evidenza dal codice:**

```typescript
// projects/ngx-data-table-light/src/lib/services/templater.service.ts
export class TemplaterService {
  private templater: TsTemplater;

  parseTemplate(template: string, data: any, otherData?: any): string {
    return this.templater.parse(template, data, otherData, '{', '}');
  }
}
```

**MA** il componente non usa sempre TemplaterService per tutti i template!

**Test falliti documentati:**
```
Template: {year}/{@PadStart|{incremental}|6|0}
Atteso: 2024/000042
Risultato: Template raw o errore
```

### Sintassi Speciali Legacy da Verificare

**Legacy supporta 3 tipi di prefissi funzione:**

1. `{@Function|params}` - Funzioni standard
2. `{#@Function|params}` - Funzioni con data come primo parametro
3. `{##@Function|params}` - Funzioni con otherData e data

**Esempio:**
```typescript
// Legacy
{#@ArrayConcat|items|{name}, }  // Passa 'data' come contesto
{##@FromOther|userKey}  // Usa otherData
```

**ts-templater:** ⚠️ Sintassi `#@` e `##@` da verificare

---

## 🟢 MIGLIORAMENTI nel Nuovo Componente

### 1. **Architettura Signal-based** 🆕
- Reactive state management
- Computed properties automatiche
- Migliori performance

### 2. **Zoneless Architecture** 🆕
- Angular 20 compatible
- Change detection ottimizzata

### 3. **Export PDF** 🆕
- Nuova funzionalità non presente in legacy

### 4. **Codice più pulito**
- 1,262 righe vs 1,651 del legacy (-23%)
- Migliore separazione responsabilità

### 5. **TypeScript moderno**
- Type safety migliorato
- Strict mode compatible

---

## 🎯 DIPENDENZE MANCANTI

### SafePipe - CRITICO se usato

**Legacy:**
```typescript
imports: [SafePipe]
```

Usato per sanitizzare HTML nei template.

**NgxDataTableLight:** ❌ **MANCANTE**

**Impatto:** Se i template contengono HTML, potenziale XSS o rendering errato.

**Soluzione:** Implementare SafePipe o usare DomSanitizer.

---

### CheckListSelectorComponent - MEDIO

**Legacy:**
```typescript
imports: [CheckListSelectorComponent]
```

Usato per selezione colonne nell'export.

**NgxDataTableLight:** ❌ **MANCANTE** (usa dialog HTML semplice)

**Impatto:** UX export colonne diversa.

**Soluzione:** Decidere se implementare o mantenere soluzione semplificata.

---

## 🔧 DIFFERENZE DI IMPLEMENTAZIONE

### Virtual Scroll

| Aspetto | Legacy | Nuovo |
|---------|--------|-------|
| **Libreria** | ngx-ui-scroll | Custom implementation |
| **API** | Datasource adapter | Computed signals |
| **Configurazione** | UiScrollModule settings | rowOptions config |
| **Buffer** | settings.bufferSize | virtualBuffer |

**Compatibilità:** ⚠️ API diverse ma funzionalità equivalenti.

---

### Export Excel

| Aspetto | Legacy | Nuovo |
|---------|--------|-------|
| **Libreria** | export-xlsx v0.1.4 | export-xlsx (stesso) |
| **Dialog selezione** | CheckListSelector | HTML nativo |
| **Preset** | ✅ | ✅ |
| **Storage** | ❌ | ✅ (localStorage) |

**Compatibilità:** Funzionalità equivalenti con UX migliorata.

---

## 📊 SCHEMA COMPATIBILITÀ

### Input Properties

| Property | Legacy | Nuovo | Compatibile |
|----------|--------|-------|------------|
| `dataSource` | ✅ | ✅ | ✅ 100% |
| `tableSchema` | ✅ | ✅ | ⚠️ 95% (vedi note) |
| `functions` | ✅ | ✅ | ✅ 100% |
| `tabTitle` | ✅ | ✅ | ✅ 100% |
| `devMode` | ✅ | ✅ | ✅ 100% |

### Output Events

| Event | Legacy | Nuovo | Compatibile |
|-------|--------|-------|------------|
| `events` | ✅ | ✅ | ✅ 100% |

### Schema Properties Compatibility

#### ✅ **100% Compatibili:**
- `columns[]` - Array colonne
- `buttons[]` - Bottoni riga
- `exportButtons[]` - Bottoni export
- `maxRows` - Righe per pagina
- `maxRowsOptions[]` - Opzioni righe
- `selectRows` - Tipo selezione
- `virtualScroll` - Flag virtual scroll
- `footerRows[]` - Footer rows
- `footerBoxes[]` - Footer boxes
- `defaultOrderField` - Ordinamento default

#### ⚠️ **Parzialmente Compatibili:**
- `rowOptions` - Supporto parziale (vedi row options)

#### ❌ **Non Supportate:**
- `otherData` - Dati aggiuntivi per templating `{##@FromOther}`

---

## 🚨 CHECKLIST MIGRAZIONE - VERIFICHE OBBLIGATORIE

Prima di sostituire il legacy con NgxDataTableLight in produzione:

### 🔴 CRITICHE (Blocker)

- [ ] **1. Verificare uso di `updateElement()`** nel codice esistente
  - Cercare: `*.updateElement(`
  - Se trovato → BLOCCA migrazione o implementa metodo

- [ ] **2. Verificare uso tooltip**
  - Cercare: `col.tooltip`, `col.tooltipTemplate`
  - Se trovato → Implementare sistema tooltip

- [ ] **3. Verificare eventi di cella**
  - Cercare: `cellClickEvent`, `cellMouseEnterEvent`
  - Se trovato → Implementare eventi

- [ ] **4. Testare TUTTI i template in uso**
  - Template con funzioni: `{@PadStart`, `{@Currency`, etc.
  - Template con `{#@` e `{##@`
  - Array access: `{arr[0]}`, `{arr[first]}`

- [ ] **5. Verificare uso `@Currency`**
  - ⚠️ ts-templater NON ha @Currency
  - Se usato → Implementare o trovare alternativa

### 🟡 IMPORTANTI

- [ ] **6. Verificare row options**
  - Cercare: `rowOptions.visible`, `rowOptions.disable`
  - Testare righe condizionali

- [ ] **7. Verificare row detail expansion**
  - Se usato → Implementare o documentare alternativa

- [ ] **8. Testare footer collapsible**
  - Se usato → Implementare toggle

- [ ] **9. Verificare SafePipe usage**
  - Cercare HTML in template
  - Se trovato → Implementare SafePipe

- [ ] **10. Testare export con selezione colonne**
  - UX diversa ma funzionale
  - Verificare accettabilità

### 🔵 CONSIGLIATI

- [ ] **11. Performance test**
  - Test con dataset grandi (1k, 10k, 100k righe)
  - Virtual scroll performance

- [ ] **12. Test cross-browser**
  - Chrome, Firefox, Safari, Edge

- [ ] **13. Test mobile/responsive**

- [ ] **14. Test accessibilità**
  - Screen reader
  - Keyboard navigation

---

## 💡 RACCOMANDAZIONI IMMEDIATE

### 1. **Integrare completamente ts-templater** - PRIORITÀ MASSIMA

**Problema attuale:**
```typescript
// Il componente non usa sempre TemplaterService!
// Alcuni template vengono processati in modo custom
```

**Soluzione:**
```typescript
// Usare TemplaterService per TUTTI i template
private getTemplateValue(template: string, row: any, schema: DtlDataSchema): string {
  return this.templaterService.parseTemplate(
    template,
    row,
    schema?.otherData,  // Supporto otherData!
    '{',
    '}'
  );
}
```

**File da modificare:**
- `projects/ngx-data-table-light/src/lib/components/data-table-light.component.ts`
  - Metodo `getTemplateValue()` (linea ~1189)
  - Tutti i punti dove si processano template

---

### 2. **Implementare @Currency in ts-templater** - CRITICO

**Opzioni:**

**A) Fork ts-templater e aggiungere @Currency:**
```typescript
// In ts-templater fork
private intCurrency = (params: any[]) => {
  if (!params || params.length < 1) return null;
  const value = Number(params[0]);
  const currency = params[1] || 'EUR';
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: currency
  }).format(value);
}
```

**B) Mantenere InterpolateService per Currency:**
```typescript
// Hybrid approach: usa ts-templater ma delega @Currency
if (template.includes('@Currency')) {
  return interpolateService.parse(template, data);
} else {
  return tsTemplater.parse(template, data);
}
```

**C) Implementare @Currency in TemplaterService wrapper:**
```typescript
// In TemplaterService
constructor() {
  this.templater = new TsTemplater();

  // Add custom Currency function
  this.templater.setFunctions({
    Currency: (params: any[]) => {
      // Implementation
    }
  });
}
```

**Raccomandazione:** Opzione C (più pulita e mantenibile).

---

### 3. **Implementare metodi pubblici mancanti** - ALTO

```typescript
// In NgxDataTableLightComponent

/**
 * Aggiorna elemento nel dataSource
 * Compatibilità con legacy
 */
public updateElement(index: number, newVal: any): void {
  const currentData = this.sourceData();
  if (index >= 0 && index < currentData.length) {
    const updated = [...currentData];
    updated[index] = { ...updated[index], ...newVal };
    this.sourceData.set(updated);
  }
}

/**
 * Pulisce tutti i filtri
 * Compatibilità con legacy
 */
public cleanFilter(): void {
  this.filterValues.set({});
}

/**
 * Resetta computazione altezza footer
 * Compatibilità con legacy
 */
public resetFooter(): void {
  // Trigger footer recomputation
  // Implementazione specifica
}

/**
 * Imposta funzioni custom runtime
 * Compatibilità con legacy
 */
public setCustomFunctions(functions: Record<string, any>): void {
  this.templaterService.setCustomFunctions(functions);
}

/**
 * Ritorna schema export corrente
 */
public getExportSchema(): DtlExportSchema | undefined {
  return this.schemaData()?.exportSchema;
}
```

---

### 4. **Implementare sistema Tooltip** - ALTO

```typescript
// Aggiungere a NgxDataTableLightComponent

private activeTooltip: {
  row: any;
  col: DtlColumnSchema;
  element?: HTMLElement;
} | null = null;

onCellMouseEnter(event: MouseEvent, row: any, col: DtlColumnSchema): void {
  if (!col.tooltip && !col.tooltipTemplate) return;

  this.activeTooltip = { row, col };

  // Emit event per compatibilità
  this.emitEvent(col.callbackMouseEnter || 'cellMouseEnter', {
    row: this.getRowSource(row),
    column: col,
    event
  });

  // Show tooltip logic
  this.showTooltip(event, row, col);
}

onCellMouseLeave(event: MouseEvent, row: any, col: DtlColumnSchema): void {
  this.hideTooltip();

  this.emitEvent(col.callbackMouseLeave || 'cellMouseLeave', {
    row: this.getRowSource(row),
    column: col,
    event
  });
}

private showTooltip(event: MouseEvent, row: any, col: DtlColumnSchema): void {
  // Implementazione tooltip con position absolute o ngbTooltip
}

private hideTooltip(): void {
  this.activeTooltip = null;
}
```

**Nel template HTML:**
```html
<div class="dtl-cell-content"
     (mouseenter)="onCellMouseEnter($event, row, col)"
     (mouseleave)="onCellMouseLeave($event, row, col)">
  <!-- content -->
</div>
```

---

### 5. **Supportare otherData** - MEDIO

```typescript
// Aggiungere a DtlDataSchema
export interface DtlDataSchema {
  // ... existing props
  otherData?: any;  // Dati aggiuntivi per templating
}

// Usare in templating
private getTemplateValue(template: string, row: any, schema: DtlDataSchema): string {
  return this.templaterService.parseTemplate(
    template,
    row,
    schema?.otherData,  // ← Pass otherData
    '{',
    '}'
  );
}
```

---

### 6. **Implementare Row Options** - MEDIO

```typescript
// In processTableData o metodo dedicato

private applyRowOptions(rows: any[], schema: DtlDataSchema): any[] {
  if (!schema.rowOptions) return rows;

  return rows.map(row => {
    const options = { ...schema.rowOptions };

    // Visible
    if (options.visible) {
      row._visible = this.resolveBooleanFlag(options.visible, row);
    }

    // Disable
    if (options.disable) {
      row._disabled = this.resolveBooleanFlag(options.disable, row);
    }

    // Class
    if (options.class) {
      row._class = this.getTemplateValue(options.class, row, schema);
    }

    // Style
    if (options.style) {
      row._style = this.getTemplateValue(options.style, row, schema);
    }

    return row;
  });
}
```

**Nel template:**
```html
<div *ngFor="let row of displayedRows()"
     [hidden]="row._visible === false"
     [class]="row._class"
     [style]="row._style"
     [class.disabled]="row._disabled">
  <!-- row content -->
</div>
```

---

## 📈 PIANO DI AZIONE RACCOMANDATO

### FASE 1: CRITICAL FIXES (Settimana 1-2)

1. ✅ Integrare completamente ts-templater
2. ✅ Implementare @Currency
3. ✅ Implementare `updateElement()`
4. ✅ Testare tutti i template legacy
5. ✅ Implementare tooltip base

**Deliverable:** Componente con funzionalità critiche compatibili

---

### FASE 2: IMPORTANT FEATURES (Settimana 3-4)

1. ✅ Implementare eventi di cella completi
2. ✅ Supportare otherData
3. ✅ Implementare row options
4. ✅ Aggiungere metodi pubblici mancanti
5. ✅ Implementare SafePipe

**Deliverable:** Parità funzionale con legacy

---

### FASE 3: ENHANCEMENTS (Settimana 5-6)

1. ✅ Footer collapsible
2. ✅ Row detail expansion (se necessario)
3. ✅ Migliorare UX export
4. ✅ Performance optimization
5. ✅ Test completi

**Deliverable:** Componente production-ready migliorato

---

### FASE 4: MIGRATION (Settimana 7+)

1. ✅ Migration guide dettagliata
2. ✅ Esempi di migrazione
3. ✅ Testing in staging
4. ✅ Gradual rollout
5. ✅ Monitoring e feedback

**Deliverable:** Migrazione completata

---

## 🎓 CONCLUSIONI

### ✅ Punti di Forza del Nuovo Componente

1. **Architettura moderna** (Signals, Zoneless)
2. **Codice più pulito** e manutenibile
3. **Performance migliori** (teoricamente)
4. **Export PDF** aggiunto
5. **Type safety** migliorato

### ⚠️ Rischi della Migrazione

1. **Gap funzionali critici** presenti
2. **Templating non completamente testato**
3. **Metodi pubblici mancanti** potrebbero rompere codice esistente
4. **Virtual scroll diverso** (potrebbe avere comportamenti diversi)
5. **Tooltip mancante** (funzionalità UX critica)

### 🎯 Raccomandazione Finale

**NON procedere con la sostituzione in produzione** fino a quando:

✅ **TUTTI i punti della checklist critica** sono verificati
✅ **Gap funzionali critici** sono implementati
✅ **Test completi** su dataset reali sono passati
✅ **Templating** è 100% compatibile con legacy
✅ **Performance testing** conferma miglioramenti

### Stima Effort

- **Fase 1 (Critical):** 40-60 ore
- **Fase 2 (Important):** 30-40 ore
- **Fase 3 (Enhancements):** 20-30 ore
- **Fase 4 (Migration):** 20-30 ore

**Totale stimato:** 110-160 ore (3-4 settimane developer)

---

## 📞 PROSSIMI PASSI IMMEDIATI

1. **Review di questo documento** con il team
2. **Prioritizzazione** delle funzionalità mancanti
3. **Decisione go/no-go** per la migrazione
4. **Planning** dettagliato Fase 1

---

**Report generato automaticamente dall'analisi del codice**
**Per domande o chiarimenti, consultare la documentazione tecnica**
