# Documentazione Componente DataTableLight

## Panoramica
Il componente **DataTableLight** è una tabella dati avanzata e altamente configurabile per applicazioni Angular. Offre funzionalità complete per la visualizzazione, gestione e manipolazione di dati tabellari con supporto per tipizzazione avanzata, template personalizzabili, esportazione dati e molto altro.

## Caratteristiche Principali
- **Tipizzazione avanzata** per diversi tipi di dati (testo, numeri, date, valute, checkbox, bottoni)
- **Template personalizzabili** per celle, righe e colonne
- **Ordinamento e filtro** dei dati
- **Paginazione** con controlli configurabili
- **Virtual scrolling** per grandi dataset
- **Esportazione** in Excel e CSV
- **Selezione righe** (singola, multipla, con checkbox)
- **Colonne ridimensionabili**
- **Footer personalizzabili** con righe e box riepilogativi
- **Tooltip** configurabili
- **Eventi personalizzabili** per interazioni utente

## Struttura del Componente

### File Principali
```
data-table-light/
├── data-table-light.component.ts       # Logica principale del componente
├── data-table-light.component.html     # Template HTML
├── data-table-light.component.scss     # Stili principali
├── data-table-light-customization.scss # Stili personalizzabili
└── models/                              # Modelli di tipizzazione
    ├── DtlDataSchema.ts                # Schema principale della tabella
    ├── DtlColumnSchema.ts              # Schema delle colonne
    ├── DtlButtonSchema.ts              # Schema dei bottoni
    ├── DtlExportSchema.ts              # Schema per esportazione
    ├── DtlFooterRow.ts                 # Schema righe footer
    ├── DtlFooterColumn.ts              # Schema colonne footer
    ├── DtlFooterBox.ts                 # Schema box footer
    └── ...
```

## Configurazione e Utilizzo

### Input Principali

#### `@Input() dataSource: Array<any>`
Array dei dati da visualizzare nella tabella. Ogni elemento rappresenta una riga.

#### `@Input() tableSchema: DtlDataSchema`
Schema di configurazione principale della tabella.

#### `@Input() functions: DtlFunctions`
Funzioni personalizzate per interpolazione e calcoli.

### Output Principali

#### `@Output() events: EventEmitter<any>`
Emettitore di eventi per tutte le interazioni con la tabella.

## Schema della Tabella (DtlDataSchema)

### Proprietà Principali

```typescript
interface DtlDataSchema {
  // Stili e classi
  contentClass?: any;
  contentStyle?: any;
  tableClass?: any;
  tableStyle?: any;

  // Configurazione colonne
  columns?: Array<DtlColumnSchema>;

  // Configurazione bottoni
  buttons?: Array<DtlButtonSchema>;
  exportButtons?: Array<DtlExportButtonSchema>;

  // Paginazione
  maxRows?: number | null;
  maxRowsOptions?: any | Array<any>;

  // Selezione righe
  selectRows?: DtlSelectionMode; // "none" | "single" | "multi" | "multicheck"

  // Ordinamento
  defaultOrderField?: string;

  // Virtual scroll
  virtualScroll?: boolean;

  // Footer
  footerRows?: Array<DtlFooterRow>;
  footerBoxes?: Array<DtlFooterBox>;

  // Callbacks
  callbackSelectRow?: string;
  callbackDoubleClickRow?: string;
  callbackChangedRowsCount?: string;
  // ... altri callbacks
}
```

## Tipizzazione delle Colonne (DtlColumnSchema)

### Proprietà delle Colonne

```typescript
interface DtlColumnSchema {
  // Identificazione
  name?: string;              // Nome visualizzato nell'header
  field?: string;             // Campo nel datasource
  fieldPath?: string;         // Path per interpolazione complessa

  // Tipizzazione
  type?: "string" | "text" | "nowrap" | "currency" | "decimal" |
         "number" | "date" | "dateTime" | "time" | "check" | "button";

  // Template e rendering
  template?: string;          // Template HTML personalizzato

  // Dimensioni
  width?: string | number | {min: number | string, max: number | string};

  // Stili e classi
  thStyle?: { [className: string]: string | number };
  tdStyle?: { [className: string]: string | number };

  // Funzionalità
  canFilter?: boolean;
  canOrder?: boolean;
  canResize?: boolean;

  // Allineamento
  horizontalAlign?: "left" | "center" | "right";

  // Tooltip
  tooltip?: string;
  tooltipTrigger?: "hover" | "click";
}
```

## Tipizzazione delle Celle

### 1. Tipi di Base

#### **string / text / nowrap**
Visualizzazione di testo semplice.
```typescript
{
  field: "nome",
  type: "string"
}
```

#### **number**
Visualizzazione di numeri senza formattazione.
```typescript
{
  field: "quantita",
  type: "number"
}
```

### 2. Tipi Numerici Formattati

#### **currency**
Visualizzazione di valori monetari con simbolo EUR.
```typescript
{
  field: "prezzo",
  type: "currency"  // Output: €1,234.56
}
```

#### **decimal**
Visualizzazione di numeri con 2 cifre decimali.
```typescript
{
  field: "percentuale",
  type: "decimal"  // Output: 12.34
}
```

### 3. Tipi Data/Ora

#### **date**
Visualizzazione di date in formato breve.
```typescript
{
  field: "dataCreazione",
  type: "date"  // Output: 01/12/2024
}
```

#### **dateTime**
Visualizzazione di data e ora.
```typescript
{
  field: "ultimoAccesso",
  type: "dateTime"  // Output: 01/12/2024 14:30
}
```

#### **time**
Visualizzazione solo dell'ora.
```typescript
{
  field: "orario",
  type: "time"  // Output: 14:30
}
```

### 4. Tipi Speciali

#### **check**
Checkbox non editabile che visualizza lo stato boolean.
```typescript
{
  field: "attivo",
  type: "check",
  horizontalAlign: "center"  // Automaticamente centrato
}
```

#### **button**
Bottone configurabile all'interno della cella.
```typescript
{
  field: "azione",
  type: "button",
  buttonConfig: {
    name: "dettagli",
    text: "Vedi",
    iconClass: "fa fa-eye",
    callback: "viewDetails",
    color: "#007bff",
    templateDisable: "{{disabled}}",
    templateHide: "{{hidden}}"
  }
}
```

## Template Personalizzati

### Template di Cella
I template permettono di personalizzare completamente il rendering di una cella:

```typescript
{
  field: "stato",
  template: `
    <span class="badge"
          [ngClass]="{'badge-success': {{stato}} === 'attivo',
                      'badge-danger': {{stato}} === 'inattivo'}">
      {{stato}}
    </span>
  `
}
```

### Interpolazione nei Template
Il sistema supporta interpolazione avanzata con accesso a:
- Dati della riga corrente: `{{field}}`
- Path nidificati: `{{utente.dettagli.nome}}`
- Dati esterni: disponibili tramite `otherData` nello schema

### Template con Funzioni
È possibile utilizzare funzioni personalizzate nei template:

```typescript
{
  field: "totale",
  template: "{{prezzo}} x {{quantita}} = {{prezzo * quantita}}"
}
```

## Gestione dei Bottoni

### Bottoni di Riga
Configurabili tramite la proprietà `buttons` dello schema:

```typescript
buttons: [{
  name: "edit",
  iconClass: "fa fa-edit",
  title: "Modifica",
  callback: "editRow",
  width: 40,
  templateDisable: "{{readonly}}",  // Condizione per disabilitare
  templateHide: "{{!canEdit}}",      // Condizione per nascondere
  color: "#28a745"                   // Colore dinamico
}]
```

### Bottoni di Esportazione
Configurabili tramite `exportButtons`:

```typescript
exportButtons: [{
  title: "Esporta Excel",
  Type: "Excel",
  iconClass: "fa fa-file-excel",
  allowColumnsSelection: true  // Permette selezione colonne
}]
```

## Ordinamento e Filtri

### Configurazione Ordinamento
```typescript
{
  field: "nome",
  canOrder: true,
  sortField: "cognome",      // Campo diverso per ordinamento
  sortFieldPath: "{{utente.cognome}}"
}
```

### Configurazione Filtri
```typescript
{
  field: "nome",
  canFilter: true,
  filterForcedType: "string",  // Forza tipo di filtro
  placeholder: "Cerca nome...",
  autocomplete: true
}
```

## Footer Personalizzabili

### Footer con Righe
```typescript
footerRows: [{
  columns: [{
    template: "Totale: {{rows.length}} righe",
    colspan: 2,
    align: "right"
  }, {
    template: "€{{rows | sum:'prezzo'}}",
    cellClass: "font-weight-bold"
  }]
}]
```

### Footer con Box Riepilogativi
```typescript
footerBoxes: [{
  label: "Totale",
  template: "€{{rows | sum:'importo'}}",
  type: "primary",  // primary, success, warning, danger
  boxClass: "custom-box"
}]
```

## Eventi e Callbacks

### Eventi Principali
- `dglRowSelected`: Selezione singola riga
- `dglRowsSelected`: Selezione multipla righe
- `dglDoubleClickRow`: Doppio click su riga
- `dglChangedRowsCount`: Cambio numero righe
- `dglSelectedPageChange`: Cambio pagina
- `dglRowsOptionChange`: Cambio opzioni righe per pagina

### Gestione Eventi
```typescript
handleTableEvents(event: any) {
  switch(event.callback) {
    case 'dglRowSelected':
      console.log('Riga selezionata:', event.row);
      break;
    case 'editRow':
      this.editRecord(event.row);
      break;
  }
}
```

## Virtual Scrolling

Per dataset di grandi dimensioni:

```typescript
{
  virtualScroll: true,
  maxRows: null  // Disabilita paginazione con virtual scroll
}
```

## Colonne Ridimensionabili

```typescript
{
  resizable: true,
  columns: [{
    field: "nome",
    canResize: true,  // Default true se resizable è attivo
    width: { min: 100, max: 300 }
  }]
}
```

## Tooltip

### Configurazione Tooltip
```typescript
{
  field: "descrizione",
  tooltip: "{{descrizione_completa}}",
  tooltipTrigger: "hover",  // "hover" o "click"
  tooltipCssClass: "custom-tooltip"
}
```

## Esportazione Dati

### Schema di Esportazione
```typescript
exportSchema: {
  filename: "export_dati",
  sheetname: "Foglio1",
  allowColumnsSelection: true,
  exportColumns: [{
    name: "Nome Completo",
    fieldPath: "{{nome}} {{cognome}}",
    type: "string",
    width: 25
  }]
}
```

## Performance e Ottimizzazione

### Best Practices
1. **Usa Virtual Scroll** per dataset > 1000 righe
2. **Limita i template complessi** nelle celle frequenti
3. **Usa `trackBy`** per ottimizzare il rendering
4. **Configura `maxRows`** appropriatamente
5. **Minimizza l'uso di interpolazioni complesse**

### Gestione Memoria
- Il componente pulisce automaticamente la cache di interpolazione
- I tooltip vengono nascosti durante lo scroll
- Il virtual scroll carica solo le righe visibili

## Styling e Personalizzazione

### Classi CSS Principali
- `.table-list-container`: Container principale
- `.table-list-header`: Header della tabella
- `.table-list-body`: Body della tabella
- `.table-row-content`: Singola riga
- `.dtl-cell-class`: Singola cella
- `.dtl-footer-section`: Sezione footer

### Variabili SCSS Personalizzabili
Definite in `data-table-light-customization.scss`:
- Colori tema
- Spaziature
- Font
- Bordi e ombre

## Esempio Completo

```typescript
// Component TypeScript
export class MyComponent {
  dataSource = [
    { id: 1, nome: "Mario", cognome: "Rossi", eta: 30, salario: 30000 },
    { id: 2, nome: "Luigi", cognome: "Verdi", eta: 25, salario: 25000 }
  ];

  tableSchema: DtlDataSchema = {
    maxRows: 10,
    selectRows: "single",
    defaultOrderField: "cognome",
    columns: [
      {
        name: "ID",
        field: "id",
        type: "number",
        width: 60,
        canOrder: true
      },
      {
        name: "Nome Completo",
        field: "nomeCompleto",
        fieldPath: "{{nome}} {{cognome}}",
        type: "string",
        canFilter: true,
        canOrder: true,
        width: { min: 150, max: 300 }
      },
      {
        name: "Età",
        field: "eta",
        type: "number",
        horizontalAlign: "center",
        width: 80
      },
      {
        name: "Salario",
        field: "salario",
        type: "currency",
        horizontalAlign: "right",
        width: 120
      }
    ],
    buttons: [
      {
        name: "edit",
        iconClass: "fa fa-edit",
        title: "Modifica",
        callback: "editRow",
        width: 40
      },
      {
        name: "delete",
        iconClass: "fa fa-trash",
        title: "Elimina",
        callback: "deleteRow",
        width: 40,
        color: "#dc3545"
      }
    ],
    exportButtons: [
      {
        title: "Excel",
        Type: "Excel",
        iconClass: "fa fa-file-excel"
      }
    ],
    footerRows: [{
      columns: [
        {
          template: "Totale dipendenti: {{rows.length}}",
          colspan: 3,
          align: "right"
        },
        {
          template: "€{{rows | sum:'salario'}}",
          align: "right",
          cellClass: "font-weight-bold"
        }
      ]
    }]
  };

  onTableEvent(event: any) {
    console.log('Evento tabella:', event);
  }
}
```

```html
<!-- Component Template -->
<app-data-table-light
  [dataSource]="dataSource"
  [tableSchema]="tableSchema"
  (events)="onTableEvent($event)"
  tabTitle="Gestione Dipendenti">
</app-data-table-light>
```

## Troubleshooting

### Problemi Comuni

1. **Dati non visualizzati**: Verificare che `dataSource` e `columns` siano configurati correttamente
2. **Template non funzionanti**: Controllare la sintassi dell'interpolazione `{{}}`
3. **Performance lente**: Abilitare `virtualScroll` per grandi dataset
4. **Esportazione vuota**: Verificare `exportSchema.exportColumns`
5. **Eventi non ricevuti**: Controllare il binding di `(events)`

## Conclusione

DataTableLight è un componente potente e flessibile che copre la maggior parte delle esigenze di visualizzazione tabellare in applicazioni Angular. La sua architettura modulare e la tipizzazione forte lo rendono facilmente estendibile e manutenibile.