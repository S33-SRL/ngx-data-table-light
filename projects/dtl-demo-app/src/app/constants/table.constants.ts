import { DtlDataSchema } from 'ngx-data-table-light';
import { CUSTOM_FUNCTIONS } from './functions.constants';

/**
 * Configurazione dello schema della tabella per gli ordini clienti
 */
export const TABLE_SCHEMA: DtlDataSchema = {
  "functions": CUSTOM_FUNCTIONS,
  "tableClass": ["table", "table-bordered", "table-striped", "table-list-container-pssstyle"],
  "tableStyle": { "min-width": "200px", "background-color": "white" },
  "theadStyle": { 
    "background-color": "#e6e6e6", 
    "display": "grid", 
    "grid-template-columns": "minmax(80px,100px) minmax(70px,85px) minmax(50px,65px) minmax(150px,1fr) minmax(80px,150px) minmax(80px,150px) minmax(150px,1fr) 95px 95px 40px minmax(100px,120px) 277px" 
  },
  "resizable": true,
  "tableStriped": true,
  "maxRows": null,
  "maxRowsOptions": [10, 15, 20, 30, 50, 100, 200, 300, 500],
  "noRowStr": "Nessun dato",
  "pagerBoundary": true,
  "pagerDirection": true,
  "pagerRotate": true,
  "pagerRowsName": "Righe:",
  "pagerPageName": "Pagina:",
  "otherData": { "kind": null },
  "virtualScroll": true,
  "contentClass": ["full-screen-grid"],
  "tbodycontainerStyle": { "height": "100%" },
  "selectRows": "multi",
  "columns": [
    { 
      "name": "Codice", 
      "field": "code", 
      "type": "nowrap", 
      "width": { "min": 80, "max": 100 }, 
      "canOrder": true, 
      "sortField": "code_ord", 
      "sortFieldPath": "{year}/{@PadStart|{incremental}|6|0}", 
      "nameRendered": "Codice" 
    },
    { 
      "name": "Data", 
      "field": "documentDate", 
      "type": "date", 
      "width": { "min": 70, "max": 85 }, 
      "canOrder": true, 
      "nameRendered": "Data" 
    },
    { 
      "name": "Cod.Cli", 
      "field": "codcli", 
      "type": "nowrap", 
      "fieldPath": "{stakeholders[customer,kind].stakeholder.code}", 
      "width": { "min": 50, "max": 65 }, 
      "canOrder": true, 
      "sortField": "codcli_ord", 
      "sortFieldPath": "{@Number|{stakeholders[customer,kind].stakeholder.code}}", 
      "nameRendered": "Cod.Cli" 
    },
    { 
      "name": "Cliente", 
      "field": "customer", 
      "type": "nowrap", 
      "fieldPath": "{stakeholders[customer,kind].stakeholder.name}", 
      "width": { "min": 150, "max": "1fr" }, 
      "canOrder": true, 
      "nameRendered": "Cliente" 
    },
    { 
      "name": "Riferimento", 
      "field": "reference", 
      "type": "nowrap", 
      "width": { "min": 80, "max": 150 }, 
      "canOrder": true, 
      "nameRendered": "Riferimento" 
    },
    { 
      "name": "Indirizzo", 
      "field": "addressRif", 
      "type": "nowrap", 
      "fieldPath": "{@IsNull|{address.city}|{address.city}{@IsNull|{address.province}| ({address.province})|}|}", 
      "width": { "min": 80, "max": 150 }, 
      "tooltip": "<div style=\"min-width:400px\">{#@toAddress|}</div>", 
      "canOrder": true, 
      "nameRendered": "Indirizzo" 
    },
    { 
      "name": "Descrizione", 
      "field": "description", 
      "type": "nowrap", 
      "width": { "min": 150, "max": "1fr" }, 
      "canOrder": true, 
      "nameRendered": "Descrizione" 
    },
    { 
      "name": "Imponibile", 
      "field": "rateable", 
      "type": "currency", 
      "width": "95px", 
      "horizontalAlign": "right", 
      "canOrder": true, 
      "nameRendered": "Imponibile" 
    },
    { 
      "name": "Totale", 
      "field": "total", 
      "type": "currency", 
      "width": "95px", 
      "horizontalAlign": "right", 
      "canOrder": true, 
      "nameRendered": "Totale" 
    },
    { 
      "name": "C.", 
      "field": "isClosed", 
      "width": "40px", 
      "template": "<div class=\"badge badge-dark\" style=\"background-color: {@If|{isClosed}|green|{@If|{movedInChildrenRows}|orange|darkorange}}\" title=\"{@If|{isClosed}|Chiuso|{@If|{movedInChildrenRows}|Parzialmente evaso|Aperto}}\"><i class=\"{@If|{isClosed}|ft-check-circle|{@If|{movedInChildrenRows}|ft-minus|ft-x}}\"></i></div>", 
      "canOrder": true, 
      "sortField": "isClosed_ord", 
      "sortFieldPath": "{@If|{isClosed}|2|{@If|{movedInChildrenRows}|1|0}}", 
      "nameRendered": "C." 
    },
    { 
      "name": "Stato", 
      "field": "status", 
      "fieldPath": "{status.status.description}", 
      "width": { "min": 100, "max": 120 }, 
      "type": "button", 
      "tooltip": "<div style=\"min-width:300px\">Stato: <span class=\"text-bold\">{status.status.description}</span><br/>Data: {@IsNull|{status.date}|{@Date|{status.date}|DD/MM/YYYY HH:mm}|Non disponibile}<br/>Autore: {@IsNull|{status.stakeholder}|{status.stakeholder.name}|Non disponibile}<br/>Commento: <span class=\"text-italic\">{@IsNull|{status.notes}|Non disponibile}</span><br/></div>", 
      "buttonConfig": { 
        "name": "statusBtn", 
        "callback": "changeStatus", 
        "class": ["btn", "btn-sm"], 
        "color": "{status.status.color}" 
      }, 
      "canOrder": true, 
      "nameRendered": "Stato" 
    }
  ],
  "buttons": [
    { 
      "name": "print", 
      "callback": "printReport", 
      "iconClass": ["fa", "ft-printer"], 
      "class": ["btn-warning", "btn", "btn-sm"], 
      "title": "Stampa" 
    },
    { 
      "name": "delete", 
      "callback": "delete", 
      "iconClass": ["fa", "ft-trash-2"], 
      "class": ["btn-danger", "btn", "btn-sm"], 
      "title": "Elimina" 
    },
    { 
      "name": "relateDocuments", 
      "callback": "relateDocuments", 
      "iconClass": ["fa", "ft-layers"], 
      "class": ["btn-primary", "btn", "btn-sm"], 
      "title": "Visualizza documenti collegati" 
    },
    { 
      "name": "detailGroupRows", 
      "callback": "detailGroupRows", 
      "iconClass": ["fa", "ft-grid"], 
      "class": ["btn-primary", "btn", "btn-sm"], 
      "title": "Visualizza dettagli evasioni righe in documenti collegati" 
    },
    { 
      "name": "openBottomSheet", 
      "callback": "openBottomSheet", 
      "iconClass": ["fa", "ft-chevrons-down"], 
      "class": ["btn-secondary", "btn", "btn-sm"], 
      "title": "Espandi dettagli" 
    }
  ],
  "exportButtons": [
    { 
      "name": "exportCsv", 
      "Type": "Excel", 
      "allowColumnsSelection": true, 
      "iconClass": { "fa": true, "fa-file-excel-o": true }, 
      "class": { "btn-default": true, "btn": true, "btn-sm": true }, 
      "title": "Esporta excel (xlsx)" 
    }
  ],
  "externalButtons": [
    { 
      "name": "detailRows", 
      "callback": "detailRows", 
      "iconClass": ["fa", "ft-list"], 
      "class": ["btn-primary", "btn", "btn-sm"], 
      "title": "Visualizza righe del documento" 
    },
    { 
      "name": "documentRecap", 
      "callback": "documentRecap", 
      "iconClass": ["fa", "ft-layers"], 
      "class": ["btn-warning", "btn", "btn-sm"], 
      "title": "Visualizza riepilogo documento " 
    },
    { 
      "name": "statusHistory", 
      "callback": "statusHistory", 
      "iconClass": ["icon-notebook"], 
      "text": "Stati", 
      "class": ["btn-primary", "btn", "btn-sm"], 
      "title": "Visualizza lo storico stati del documento" 
    }
  ],
  "exportSchema": {
    "filename": "ordini_cliente",
    "exportColumns": [
      { "name": "Codice", "field": "code" },
      { "name": "Data", "field": "documentDate", "type": "date" },
      { "name": "Cod.Cli", "field": "codcli", "fieldPath": "{stakeholders[customer,kind].stakeholder.code}" },
      { "name": "Cliente", "field": "customer", "fieldPath": "{stakeholders[customer,kind].stakeholder.name}" },
      { "name": "Riferimento", "field": "reference" },
      { "name": "Indirizzo", "field": "addressRif", "fieldPath": "{@IsNull|{address.city}|{address.city}{@IsNull|{address.province}| ({address.province})|}|}" },
      { "name": "Descrizione", "field": "description" },
      { "name": "Imponibile", "field": "rateable", "type": "currency" },
      { "name": "Stato", "field": "status", "fieldPath": "{status.status.description}" },
      { "name": "Ordinato", "field": "ordered_null" },
      { "name": "Data arrivo", "field": "arrivalDate_null" },
      { "name": "Consegnato / installato", "field": "installed_null" },
      { "name": "Note", "field": "notes_null" }
    ]
  },
  "tbodyStyle": { 
    "display": "grid", 
    "grid-template-columns": "minmax(80px,100px) minmax(70px,85px) minmax(50px,65px) minmax(150px,1fr) minmax(80px,150px) minmax(80px,150px) minmax(150px,1fr) 95px 95px 40px minmax(100px,120px) 277px" 
  },
  "filters": {}
};

/**
 * Opzioni per le righe massime visualizzabili nella tabella
 */
export const MAX_ROWS_OPTIONS = [10, 15, 20, 30, 50, 100, 200, 300, 500];

/**
 * Messaggio da visualizzare quando non ci sono dati
 */
export const NO_DATA_MESSAGE = "Nessun dato";

/**
 * Etichette per il paginatore
 */
export const PAGER_LABELS = {
  ROWS: "Righe:",
  PAGE: "Pagina:"
} as const;

/**
 * Classi CSS per la tabella
 */
export const TABLE_CSS_CLASSES = {
  TABLE: ["table", "table-bordered", "table-striped", "table-list-container-pssstyle"],
  CONTENT: ["full-screen-grid"]
} as const;

/**
 * Stili di base per la tabella
 */
export const TABLE_STYLES = {
  TABLE: { "min-width": "200px", "background-color": "white" },
  THEAD: { 
    "background-color": "#e6e6e6", 
    "display": "grid", 
    "grid-template-columns": "minmax(80px,100px) minmax(70px,85px) minmax(50px,65px) minmax(150px,1fr) minmax(80px,150px) minmax(80px,150px) minmax(150px,1fr) 95px 95px 40px minmax(100px,120px) 277px" 
  },
  TBODY_CONTAINER: { "height": "100%" },
  TBODY: { 
    "display": "grid", 
    "grid-template-columns": "minmax(80px,100px) minmax(70px,85px) minmax(50px,65px) minmax(150px,1fr) minmax(80px,150px) minmax(80px,150px) minmax(150px,1fr) 95px 95px 40px minmax(100px,120px) 277px" 
  }
} as const;