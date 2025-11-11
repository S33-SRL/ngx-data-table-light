# NgxDataTableLight - Angular Data Table Component

NgxDataTableLight è un componente Angular avanzato per la visualizzazione e gestione di dati tabellari, con supporto per tipizzazione avanzata, template personalizzabili, esportazione dati e molto altro.

## 🚀 Caratteristiche Principali

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

## 📋 Requisiti

- Angular 17+ (testato con Angular 20.1.1)
- Node.js 18+
- npm o yarn

## 🛠️ Installazione e Setup

### 1. Clonare il repository

```bash
git clone <repository-url>
cd ngx-data-table-light-workspace
npm install
```

### 2. Build della libreria

Prima di utilizzare il componente, è necessario compilare la libreria:

```bash
ng build ngx-data-table-light
```

### 3. Avviare l'applicazione demo

```bash
ng serve dtl-demo-app
```

L'applicazione sarà disponibile su `http://localhost:4200`

### 4. Build completo (libreria + demo)

```bash
ng build ngx-data-table-light && ng build dtl-demo-app
```

## 📦 Struttura del Progetto

```
ngx-data-table-light-workspace/
├── projects/
│   ├── ngx-data-table-light/           # Libreria del componente
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── components/     # Componente principale
│   │   │   │   │   ├── data-table-light.component.ts
│   │   │   │   │   ├── data-table-light.component.html
│   │   │   │   │   ├── data-table-light.component.scss
│   │   │   │   │   └── data-table-light-customization.scss
│   │   │   │   ├── models/         # Modelli e interfacce
│   │   │   │   │   ├── dtl-data-schema.ts
│   │   │   │   │   ├── dtl-column-schema.ts
│   │   │   │   │   ├── dtl-button-schema.ts
│   │   │   │   │   ├── dtl-export-schema.ts
│   │   │   │   │   ├── dtl-footer-row.ts
│   │   │   │   │   ├── dtl-footer-column.ts
│   │   │   │   │   ├── dtl-footer-box.ts
│   │   │   │   │   ├── dtl-row-options.ts
│   │   │   │   │   └── dtl-functions.ts
│   │   │   │   └── types/          # Tipi TypeScript
│   │   │   └── public-api.ts       # API pubblica
│   │   └── package.json
│   │
│   └── dtl-demo-app/               # Applicazione demo
│       └── src/
│           └── app/
│               ├── app.ts           # Component principale
│               ├── app.html         # Template
│               └── constants/       # Configurazioni demo
│                   ├── config.constants.ts
│                   ├── sample-data.constants.ts
│                   └── table.constants.ts
│
├── dist/                           # Build output
├── angular.json                    # Configurazione Angular
├── package.json                    # Dipendenze
└── README.md                       # Questo file
```

## 🎯 Utilizzo Base

### Importare il componente

```typescript
import { NgxDataTableLightComponent, DtlDataSchema } from 'ngx-data-table-light';

@Component({
  selector: 'app-example',
  imports: [NgxDataTableLightComponent],
  template: `
    <ngx-data-table-light
      [dataSource]="dataSource"
      [tableSchema]="tableSchema"
      (events)="onTableEvent($event)">
    </ngx-data-table-light>
  `
})
export class ExampleComponent {
  dataSource = [
    { id: 1, nome: 'Mario', cognome: 'Rossi', eta: 30, salario: 30000 },
    { id: 2, nome: 'Luigi', cognome: 'Verdi', eta: 25, salario: 25000 }
  ];

  tableSchema: DtlDataSchema = {
    columns: [
      { field: 'id', name: 'ID', type: 'number' },
      { field: 'nome', name: 'Nome', type: 'string' },
      { field: 'cognome', name: 'Cognome', type: 'string' },
      { field: 'eta', name: 'Età', type: 'number' },
      { field: 'salario', name: 'Salario', type: 'currency' }
    ]
  };

  onTableEvent(event: any) {
    console.log('Evento tabella:', event);
  }
}
```

## 📊 Tipizzazione delle Colonne

### Tipi Disponibili

| Tipo | Descrizione | Output Esempio |
|------|-------------|----------------|
| `string` | Testo semplice | "Testo" |
| `text` | Testo con wrap | "Testo lungo..." |
| `nowrap` | Testo senza wrap | "Testo senza wrap" |
| `number` | Numero senza formattazione | 1234 |
| `decimal` | Numero con 2 decimali | 12.34 |
| `currency` | Valore monetario | €1,234.56 |
| `date` | Data formato breve | 01/12/2024 |
| `dateTime` | Data e ora | 01/12/2024 14:30 |
| `time` | Solo ora | 14:30 |
| `check` | Checkbox (readonly) | ☑ / ☐ |
| `button` | Bottone azione | [Bottone] |

### Esempio Configurazione Colonna

```typescript
{
  name: 'Prezzo',                    // Nome visualizzato
  field: 'price',                    // Campo nei dati
  type: 'currency',                  // Tipo di dato
  width: 120,                       // Larghezza (px o %)
  horizontalAlign: 'right',         // Allineamento
  canFilter: true,                  // Abilitare filtro
  canOrder: true,                   // Abilitare ordinamento
  canResize: true,                  // Ridimensionabile
  tooltip: 'Prezzo unitario'        // Tooltip
}
```

## 🎨 Template Personalizzati

### Template di Cella

```typescript
{
  field: 'stato',
  template: `
    <span class="badge"
          [ngClass]="{'badge-success': {stato} === 'attivo',
                      'badge-danger': {stato} === 'inattivo'}">
      {stato}
    </span>
  `
}
```

### Interpolazione nei Template

- Campo semplice: `{field}`
- Path nidificato: `{user.details.name}`
- Funzioni: `{@FunctionName|{param1}|param2}`
- Condizionali: `{@If|{condition}|valueIfTrue|valueIfFalse}`

## 🔘 Configurazione Bottoni

### Bottoni di Riga

```typescript
buttons: [{
  name: 'edit',
  iconClass: 'fa fa-edit',
  title: 'Modifica',
  callback: 'editRow',
  width: 40,
  color: '#28a745',
  templateDisable: '{readonly}',    // Condizione disabilitazione
  templateHide: '{!canEdit}'         // Condizione visibilità
}]
```

### Bottoni di Esportazione

```typescript
exportButtons: [{
  title: 'Esporta Excel',
  Type: 'Excel',
  iconClass: 'fa fa-file-excel',
  allowColumnsSelection: true
}]
```

## 📑 Paginazione

```typescript
{
  maxRows: 10,                      // Righe per pagina
  maxRowsOptions: [5, 10, 25, 50],  // Opzioni righe
  pagerBoundary: true,              // Mostra prima/ultima
  pagerDirection: true,             // Mostra avanti/indietro
  pagerMaxSize: 5,                  // Max pagine visibili
  pagerRotate: true                 // Rotazione automatica
}
```

## 🎯 Selezione Righe

```typescript
{
  selectRows: 'single',    // 'none' | 'single' | 'multi' | 'multicheck'
  selectRowClass: { 'table-primary': true },
  callbackSelectRow: 'onRowSelected'
}
```

## 🚀 Virtual Scrolling

Per grandi dataset (>1000 righe):

```typescript
{
  virtualScroll: true,
  maxRows: null,           // Disabilita paginazione
  rowOptions: {
    virtualHeight: 600,    // Altezza viewport (px)
    virtualBuffer: 10,     // Righe buffer
    rowHeight: 50          // Altezza riga (px)
  }
}
```

## 📊 Footer Personalizzabili

### Footer con Righe

```typescript
footerRows: [{
  columns: [{
    template: 'Totale: {rows.length} righe',
    colspan: 2,
    align: 'right'
  }, {
    template: '€{@Sum|{rows}|salario}',
    cellClass: 'font-weight-bold'
  }]
}]
```

### Footer con Box

```typescript
footerBoxes: [{
  label: 'Totale',
  template: '€{@Sum|{rows}|importo}',
  type: 'primary',     // primary, success, warning, danger
  boxClass: 'custom-box'
}]
```

## 📤 Esportazione Dati

### Configurazione Export

```typescript
exportSchema: {
  filename: 'export_dati',
  sheetname: 'Foglio1',
  allowColumnsSelection: true,
  exportColumns: [{
    name: 'Nome Completo',
    fieldPath: '{nome} {cognome}',
    type: 'string',
    width: 25
  }],
  presets: [{
    name: 'Essenziale',
    keys: ['id', 'nome', 'totale'],
    format: 'Excel'
  }]
}
```

## 📡 Eventi

### Eventi Principali

| Evento | Descrizione | Payload |
|--------|-------------|---------|
| `dglRowSelected` | Selezione singola riga | `{ row, index }` |
| `dglRowsSelected` | Selezione multipla | `{ rows, indexes }` |
| `dglDoubleClickRow` | Doppio click riga | `{ row, index }` |
| `dglChangedRowsCount` | Cambio numero righe | `{ count }` |
| `dglSelectedPageChange` | Cambio pagina | `{ page }` |
| `dglRowsOptionChange` | Cambio righe/pagina | `{ maxRows }` |

### Gestione Eventi

```typescript
onTableEvent(event: any) {
  switch(event.callback) {
    case 'dglRowSelected':
      console.log('Riga selezionata:', event.row);
      break;
    case 'editRow':
      this.editRecord(event.row);
      break;
    case 'deleteRow':
      this.deleteRecord(event.row);
      break;
  }
}
```

## 🎨 Personalizzazione Stili

### Classi CSS Principali

- `.table-list-container` - Container principale
- `.table-list-header` - Header tabella
- `.table-list-body` - Body tabella
- `.table-row-content` - Singola riga
- `.dtl-cell-class` - Singola cella
- `.dtl-footer-section` - Sezione footer

### Stili Custom

```scss
// Nel tuo component.scss
:host ::ng-deep {
  .table-list-container {
    border: 1px solid #dee2e6;

    .table-list-header {
      background-color: #f8f9fa;

      th {
        font-weight: 600;
        color: #495057;
      }
    }

    .table-row-content {
      &:hover {
        background-color: #f8f9fa;
      }

      &.selected {
        background-color: #e7f1ff;
      }
    }
  }
}
```

## 🔧 API Reference

### Input Properties

| Proprietà | Tipo | Default | Descrizione |
|-----------|------|---------|-------------|
| `dataSource` | `any[]` | `[]` | Array dei dati da visualizzare |
| `tableSchema` | `DtlDataSchema` | `{}` | Schema configurazione tabella |
| `functions` | `DtlFunctions` | `{}` | Funzioni custom per template |
| `tabTitle` | `string` | `''` | Titolo tab (opzionale) |

### Output Events

| Evento | Tipo | Descrizione |
|--------|------|-------------|
| `events` | `EventEmitter<any>` | Emettitore eventi tabella |

### Interfacce Principali

#### DtlDataSchema

```typescript
interface DtlDataSchema {
  // Stili e classi
  contentClass?: any;
  contentStyle?: any;
  tableClass?: any;
  tableStyle?: any;

  // Configurazione
  columns?: DtlColumnSchema[];
  buttons?: DtlButtonSchema[];
  exportButtons?: DtlExportButtonSchema[];

  // Paginazione
  maxRows?: number | null;
  maxRowsOptions?: number[];

  // Selezione
  selectRows?: '' | 'none' | 'single' | 'multi' | 'multicheck';

  // Virtual scroll
  virtualScroll?: boolean;
  rowOptions?: DtlRowOptions;

  // Footer
  footerRows?: DtlFooterRow[];
  footerBoxes?: DtlFooterBox[];

  // Callbacks
  callbackSelectRow?: string;
  callbackDoubleClickRow?: string;
  // ... altri
}
```

#### DtlColumnSchema

```typescript
interface DtlColumnSchema {
  name?: string;           // Nome header
  field?: string;          // Campo dati
  fieldPath?: string;      // Path interpolazione
  type?: string;           // Tipo dato
  template?: string;       // Template custom
  width?: any;             // Larghezza
  canFilter?: boolean;     // Filtro
  canOrder?: boolean;      // Ordinamento
  canResize?: boolean;     // Ridimensionamento
  horizontalAlign?: string; // Allineamento
  tooltip?: string;        // Tooltip
  // ... altre proprietà
}
```

#### DtlRowOptions

```typescript
interface DtlRowOptions {
  class?: string;          // Classe CSS riga
  style?: string;          // Stili inline riga
  visible?: string;        // Condizione visibilità
  disable?: string;        // Condizione disabilitazione
  virtualHeight?: number;  // Altezza viewport virtual scroll
  virtualBuffer?: number;  // Buffer righe virtual scroll
  rowHeight?: number;      // Altezza singola riga
}
```

## 🐛 Troubleshooting

### Problemi Comuni

| Problema | Soluzione |
|----------|-----------|
| Dati non visualizzati | Verificare che `dataSource` e `columns` siano configurati correttamente |
| Template non funzionanti | Controllare la sintassi dell'interpolazione `{}` (non `{{}}`) |
| Performance lente | Abilitare `virtualScroll` per grandi dataset |
| Esportazione vuota | Verificare `exportSchema.exportColumns` |
| Eventi non ricevuti | Controllare il binding di `(events)` |
| Errori di build | Eseguire prima `ng build ngx-data-table-light` |

### Debug Mode

Attivare la modalità debug per log dettagliati:

```typescript
tableSchema: DtlDataSchema = {
  devMode: true,
  // ... altre configurazioni
}
```

## 📚 Esempi Avanzati

### Tabella con tutte le funzionalità

```typescript
tableSchema: DtlDataSchema = {
  // Paginazione
  maxRows: 10,
  maxRowsOptions: [5, 10, 25, 50],

  // Selezione multipla con checkbox
  selectRows: 'multicheck',

  // Virtual scroll per performance
  virtualScroll: false,

  // Colonne configurate
  columns: [
    {
      name: 'ID',
      field: 'id',
      type: 'number',
      width: 60,
      canOrder: true
    },
    {
      name: 'Cliente',
      fieldPath: '{cliente.nome} {cliente.cognome}',
      type: 'string',
      canFilter: true,
      canOrder: true
    },
    {
      name: 'Data Ordine',
      field: 'dataOrdine',
      type: 'date',
      canOrder: true
    },
    {
      name: 'Totale',
      field: 'totale',
      type: 'currency',
      horizontalAlign: 'right'
    },
    {
      name: 'Stato',
      field: 'stato',
      template: `
        <span class="badge"
              [ngClass]="{'badge-success': {stato} === 'completato',
                          'badge-warning': {stato} === 'pending',
                          'badge-danger': {stato} === 'annullato'}">
          {stato}
        </span>
      `
    }
  ],

  // Bottoni azione
  buttons: [
    {
      name: 'view',
      iconClass: 'fa fa-eye',
      title: 'Dettagli',
      callback: 'viewOrder'
    },
    {
      name: 'edit',
      iconClass: 'fa fa-edit',
      title: 'Modifica',
      callback: 'editOrder',
      templateDisable: '{stato === "completato"}'
    }
  ],

  // Export
  exportButtons: [
    {
      title: 'Excel',
      Type: 'Excel',
      iconClass: 'fa fa-file-excel'
    },
    {
      title: 'CSV',
      Type: 'CSV',
      iconClass: 'fa fa-file-csv'
    }
  ],

  // Footer con totali
  footerRows: [{
    columns: [
      {
        template: 'Totale ordini: {rows.length}',
        colspan: 3,
        align: 'right'
      },
      {
        template: '€{@Sum|{rows}|totale}',
        align: 'right',
        cellClass: 'font-weight-bold text-success'
      }
    ]
  }]
};
```

## 🤝 Contribuire

Le contribuzioni sono benvenute! Per contribuire:

1. Fork del repository
2. Crea un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è distribuito con licenza MIT. Vedi il file `LICENSE` per maggiori informazioni.

## 🆘 Supporto

Per problemi o domande:
- Apri una issue su GitHub
- Consulta la [documentazione completa](DOCUMENTAZIONE_DATA_TABLE_LIGHT.md)
- Guarda l'applicazione demo per esempi pratici

## 🔄 Changelog

### v1.0.0
- Release iniziale
- Supporto completo per tipizzazione avanzata
- Virtual scrolling
- Export Excel/CSV
- Footer personalizzabili
- Template system avanzato

---

Sviluppato con ❤️ usando Angular