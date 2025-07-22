import { Component, signal } from '@angular/core';
import { DataTableLightComponent, DtlDataSchema, DtlColumnSchema } from 'data-table-light';

@Component({
  selector: 'app-root',
  imports: [DataTableLightComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  // sampleData = signal([
  //   { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, active: true },
  //   { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, active: false },
  //   { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, active: true }
  // ]);

  // tableSchema = signal<DtlDataSchema>({
  //   columns: [
  //     { name: 'ID', field: 'id', canOrder: true, width: 80 },
  //     { name: 'Name', field: 'name', canOrder: true, canFilter: true },
  //     { name: 'Email', field: 'email', canFilter: true },
  //     { name: 'Age', field: 'age', type: 'number', canOrder: true, width: 100 },
  //     { name: 'Active', field: 'active', type: 'check', width: 80 }
  //   ],
  //   maxRows: 10,
  //   tableStriped: true,
  //   selectRows: 'single'
  // });

  tableSchema = signal<DtlDataSchema>( {"tableClass":["table","table-bordered","table-striped","table-list-container-pssstyle"],"tableStyle":{"min-width":"200px","background-color":"white"},"theadStyle":{"background-color":"#e6e6e6","display":"grid","grid-template-columns":"minmax(80px,100px) minmax(70px,85px) minmax(50px,65px) minmax(150px,1fr) minmax(80px,150px) minmax(80px,150px) minmax(150px,1fr) 95px 95px 40px minmax(100px,120px) 277px"},"resizable":true,"tableStriped":true,"maxRows":null,"maxRowsOptions":[10,15,20,30,50,100,200,300,500],"noRowStr":"Nessun dato","pagerBoundary":true,"pagerDirection":true,"pagerRotate":true,"pagerRowsName":"Righe:","pagerPageName":"Pagina:","otherData":{"kind":null},"virtualScroll":true,"contentClass":["full-screen-grid"],"tbodycontainerStyle":{"height":"100%"},"selectRows":"multi","columns":[{"name":"Codice","field":"code","type":"nowrap","width":{"min":80,"max":100},"canOrder":true,"sortField":"code_ord","sortFieldPath":"{year}/{@PadStart|{incremental}|6|0}","nameRendered":"Codice"},{"name":"Data","field":"documentDate","type":"date","width":{"min":70,"max":85},"canOrder":true,"nameRendered":"Data"},{"name":"Cod.Cli","field":"codcli","type":"nowrap","fieldPath":"{stakeholders[customer,kind].stakeholder.code}","width":{"min":50,"max":65},"canOrder":true,"sortField":"codcli_ord","sortFieldPath":"{@ToNumber|{stakeholders[customer,kind].stakeholder.code}}","nameRendered":"Cod.Cli"},{"name":"Cliente","field":"customer","type":"nowrap","fieldPath":"{stakeholders[customer,kind].stakeholder.name}","width":{"min":150,"max":"1fr"},"canOrder":true,"nameRendered":"Cliente"},{"name":"Riferimento","field":"reference","type":"nowrap","width":{"min":80,"max":150},"canOrder":true,"nameRendered":"Riferimento"},{"name":"Indirizzo","field":"addressRif","type":"nowrap","fieldPath":"{@IsNull|{address.city}|{address.city}{@IsNull|{address.province}| ({address.province})|}|}","width":{"min":80,"max":150},"tooltip":"<div style=\"min-width:400px\">{#@toAddress|}</div>","canOrder":true,"nameRendered":"Indirizzo"},{"name":"Descrizione","field":"description","type":"nowrap","width":{"min":150,"max":"1fr"},"canOrder":true,"nameRendered":"Descrizione"},{"name":"Imponibile","field":"rateable","type":"currency","width":"95px","horizontalAlign":"right","canOrder":true,"nameRendered":"Imponibile"},{"name":"Totale","field":"total","type":"currency","width":"95px","horizontalAlign":"right","canOrder":true,"nameRendered":"Totale"},{"name":"C.","field":"isClosed","width":"40px","template":"<div class=\"badge badge-dark\" style=\"background-color: {@If|{isClosed}|green|{@If|{movedInChildrenRows}|orange|darkorange}}\" title=\"{@If|{isClosed}|Chiuso|{@If|{movedInChildrenRows}|Parzialmente evaso|Aperto}}\"><i class=\"{@If|{isClosed}|ft-check-circle|{@If|{movedInChildrenRows}|ft-minus|ft-x}}\"></i></div>","canOrder":true,"sortField":"isClosed_ord","sortFieldPath":"{@If|{isClosed}|2|{@If|{movedInChildrenRows}|1|0}}","nameRendered":"C."},{"name":"Stato","field":"status","fieldPath":"{status.status.description}","width":{"min":100,"max":120},"type":"button","tooltip":"<div style=\"min-width:300px\">Stato: <span class=\"text-bold\">{status.status.description}</span><br/>Data: {@IsNull|{status.date}|{@Date|{status.date}|DD/MM/YYYY HH:mm}|Non disponibile}<br/>Autore: {@IsNull|{status.stakeholder}|{status.stakeholder.name}|Non disponibile}<br/>Commento: <span class=\"text-italic\">{@IsNull|{status.notes}|Non disponibile}</span><br/></div>","buttonConfig":{"name":"statusBtn","callback":"changeStatus","class":["btn","btn-sm"],"color":"{status.status.color}"},"canOrder":true,"nameRendered":"Stato"}],"buttons":[{"name":"print","callback":"printReport","iconClass":["fa","ft-printer"],"class":["btn-warning","btn","btn-sm"],"title":"Stampa"},{"name":"delete","callback":"delete","iconClass":["fa","ft-trash-2"],"class":["btn-danger","btn","btn-sm"],"title":"Elimina"},{"name":"relateDocuments","callback":"relateDocuments","iconClass":["fa","ft-layers"],"class":["btn-primary","btn","btn-sm"],"title":"Visualizza documenti collegati"},{"name":"detailGroupRows","callback":"detailGroupRows","iconClass":["fa","ft-grid"],"class":["btn-primary","btn","btn-sm"],"title":"Visualizza dettagli evasioni righe in documenti collegati"},{"name":"openBottomSheet","callback":"openBottomSheet","iconClass":["fa","ft-chevrons-down"],"class":["btn-secondary","btn","btn-sm"],"title":"Espandi dettagli"}],"exportButtons":[{"name":"exportCsv","Type":"Excel","allowColumnsSelection":true,"iconClass":{"fa":true,"fa-file-excel-o":true},"class":{"btn-default":true,"btn":true,"btn-sm":true},"title":"Esporta excel (xlsx)"}],"externalButtons":[{"name":"detailRows","callback":"detailRows","iconClass":["fa","ft-list"],"class":["btn-primary","btn","btn-sm"],"title":"Visualizza righe del documento"},{"name":"documentRecap","callback":"documentRecap","iconClass":["fa","ft-layers"],"class":["btn-warning","btn","btn-sm"],"title":"Visualizza riepilogo documento "},{"name":"statusHistory","callback":"statusHistory","iconClass":["icon-notebook"],"text":"Stati","class":["btn-primary","btn","btn-sm"],"title":"Visualizza lo storico stati del documento"}],"exportSchema":{"filename":"ordini_cliente","exportColumns":[{"name":"Codice","field":"code"},{"name":"Data","field":"documentDate","type":"date"},{"name":"Cod.Cli","field":"codcli","fieldPath":"{stakeholders[customer,kind].stakeholder.code}"},{"name":"Cliente","field":"customer","fieldPath":"{stakeholders[customer,kind].stakeholder.name}"},{"name":"Riferimento","field":"reference"},{"name":"Indirizzo","field":"addressRif","fieldPath":"{@IsNull|{address.city}|{address.city}{@IsNull|{address.province}| ({address.province})|}|}"},{"name":"Descrizione","field":"description"},{"name":"Imponibile","field":"rateable","type":"currency"},{"name":"Stato","field":"status","fieldPath":"{status.status.description}"},{"name":"Ordinato","field":"ordered_null"},{"name":"Data arrivo","field":"arrivalDate_null"},{"name":"Consegnato / installato","field":"installed_null"},{"name":"Note","field":"notes_null"}]},"tbodyStyle":{"display":"grid","grid-template-columns":"minmax(80px,100px) minmax(70px,85px) minmax(50px,65px) minmax(150px,1fr) minmax(80px,150px) minmax(80px,150px) minmax(150px,1fr) 95px 95px 40px minmax(100px,120px) 277px"},"filters":{}});
  sampleData = signal([
    {
        "type": {
            "groupType": "ORD",
            "originKind": "supplier",
            "refKind": "customer",
            "firstAccountingVisible": false,
            "firstAccountingCreateDocument": false,
            "firstAccountingEditDocument": false,
            "firstAccountingSign": 1,
            "batchSingle": false,
            "batchAutomaticOnly": false,
            "defaultBatchRequired": false,
            "showArticleOverride": false,
            "description": "Ordine cliente",
            "code": "2",
            "identity": "6851aaac-9cd9-455d-8c3a-9dce12719741"
        },
        "incremental": 10,
        "year": 2025,
        "version": 0,
        "creationDate": "2025-06-30T08:55:15.928841",
        "documentDate": "2025-06-30T00:00:00",
        "lastModifyDate": "2025-06-30T08:55:15.9288417",
        "isRevisioned": false,
        "isLocked": false,
        "isClosed": false,
        "isDeleted": false,
        "autoImported": false,
        "ignoreTopCompany": false,
        "rateableRows": 285.35000000,
        "rateable": 285.35000000,
        "levy": 62.78000000,
        "amount": 348.13000000,
        "total": 348.13000000,
        "reference": "08/07/2025",
        "stakeholders": [
            {
                "stakeholder": {
                    "vatNumber": "10146140966",
                    "fiscalCode": "",
                    "email": "danielaschiavon@eatyristorazione.it",
                    "legalEmail": "",
                    "invoiceLegalEmail": "",
                    "phone": "",
                    "mobilePhone": "",
                    "interchangeCode": "USAL8PV",
                    "lastModifyDate": "0001-01-01T00:00:00",
                    "autoImported": false,
                    "firstName": "EATY SRL",
                    "secondName": "",
                    "alias": "",
                    "name": "EATY SRL",
                    "code": "192",
                    "identity": "b25026fc-a88c-40e1-82e0-64f7fb98df1a"
                },
                "kind": "customer"
            }
        ],
        "address": {
            "description": "CRS  RELAXXI",
            "street": "VIA AURELIO DE POL 20",
            "city": "NOALE",
            "province": "VE",
            "zipCode": "30033",
            "country": "ITA",
            "fullCity": "NOALE(VE)",
            "identity": "d2d2ddb8-88ef-4c17-9f4e-eee087e643c9"
        },
        "status": {
            "status": {
                "color": "#1CBCD8",
                "groupType": "bizdoc",
                "locked": false,
                "description": "In verifica",
                "code": "26",
                "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
            },
            "date": "2025-06-30T08:55:15.9312812"
        },
        "nextStatus": [
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#0CC27E",
                    "groupType": "bizdoc",
                    "locked": true,
                    "description": "Chiuso",
                    "code": "09",
                    "identity": "1c6bf1c4-44f9-41e6-9ed7-18758f9c14b0"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-131.41104888916016 -148.3122756958008\",\"link\":{\"fromPort\":\"T\",\"toPort\":\"L\",\"points\":[{\"x\":-346.98590087890625,\"y\":14.468525695800782,\"v\":false},{\"x\":-346.98590087890625,\"y\":-3.531474304199218,\"v\":false},{\"x\":-346.98590087890625,\"y\":-148.3122756958008,\"v\":false},{\"x\":-261.4929504394531,\"y\":-148.3122756958008,\"v\":false},{\"x\":-176,\"y\":-148.3122756958008,\"v\":false},{\"x\":-166,\"y\":-148.3122756958008,\"v\":false}]}}"
            },
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#FF8D60",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "Non completo",
                    "code": "07",
                    "identity": "4aedc3c6-4b15-4e2a-b33d-779076d9a111"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-151.61795043945312 25.68772430419922\",\"link\":{\"fromPort\":\"R\",\"toPort\":\"L\",\"points\":[{\"x\":-288.35479736328125,\"y\":32.15625,\"v\":false},{\"x\":-278.35479736328125,\"y\":32.15625,\"v\":false},{\"x\":-249.29409408569336,\"y\":32.15625,\"v\":false},{\"x\":-249.29409408569336,\"y\":25.68772430419922,\"v\":false},{\"x\":-220.23339080810547,\"y\":25.68772430419922,\"v\":false},{\"x\":-210.23339080810547,\"y\":25.68772430419922,\"v\":false}]}}"
            },
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#ffeb3b",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "Completo",
                    "code": "27",
                    "identity": "1e689f52-cf9f-4e08-8dd6-4bc6520ddb1d"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-158.828125 114.15625\",\"link\":{\"fromPort\":\"B\",\"toPort\":\"L\",\"points\":[{\"x\":-332.328125,\"y\":49.84397430419922,\"v\":false},{\"x\":-332.328125,\"y\":59.84397430419922,\"v\":false},{\"x\":-332.328125,\"y\":114.15625000000001,\"v\":false},{\"x\":-272.3518409729004,\"y\":114.15625000000001,\"v\":false},{\"x\":-212.37555694580078,\"y\":114.15625000000001,\"v\":false},{\"x\":-202.37555694580078,\"y\":114.15625000000001,\"v\":false}]}}"
            }
        ],
        "payments": [],
        "paymentHoldingTypes": [],
        "totalHoldingTypesAmount": 0,
        "movedInChildrenRows": false,
        "hasNotifies": false,
        "hasCalls": false,
        "childrenTypes": [],
        "description": "",
        "code": "10/2025",
        "identity": "60b876d2-ab9b-4666-896a-4f29739af079"
    },
    {
        "type": {
            "groupType": "ORD",
            "originKind": "supplier",
            "refKind": "customer",
            "firstAccountingVisible": false,
            "firstAccountingCreateDocument": false,
            "firstAccountingEditDocument": false,
            "firstAccountingSign": 1,
            "batchSingle": false,
            "batchAutomaticOnly": false,
            "defaultBatchRequired": false,
            "showArticleOverride": false,
            "description": "Ordine cliente",
            "code": "2",
            "identity": "6851aaac-9cd9-455d-8c3a-9dce12719741"
        },
        "incremental": 9,
        "year": 2025,
        "version": 0,
        "creationDate": "2025-06-30T08:54:40.6863093",
        "documentDate": "2025-06-30T00:00:00",
        "lastModifyDate": "2025-06-30T08:54:40.6863097",
        "isRevisioned": false,
        "isLocked": false,
        "isClosed": false,
        "isDeleted": false,
        "autoImported": false,
        "ignoreTopCompany": false,
        "rateableRows": 287.15000000,
        "rateable": 287.15000000,
        "levy": 63.17000000,
        "amount": 350.32000000,
        "total": 350.32000000,
        "reference": "04/07/2025",
        "stakeholders": [
            {
                "stakeholder": {
                    "vatNumber": "10146140966",
                    "fiscalCode": "",
                    "email": "danielaschiavon@eatyristorazione.it",
                    "legalEmail": "",
                    "invoiceLegalEmail": "",
                    "phone": "",
                    "mobilePhone": "",
                    "interchangeCode": "USAL8PV",
                    "lastModifyDate": "0001-01-01T00:00:00",
                    "autoImported": false,
                    "firstName": "EATY SRL",
                    "secondName": "",
                    "alias": "",
                    "name": "EATY SRL",
                    "code": "192",
                    "identity": "b25026fc-a88c-40e1-82e0-64f7fb98df1a"
                },
                "kind": "customer"
            }
        ],
        "address": {
            "description": "CRS  RELAXXI",
            "street": "VIA AURELIO DE POL 20",
            "city": "NOALE",
            "province": "VE",
            "zipCode": "30033",
            "country": "ITA",
            "fullCity": "NOALE(VE)",
            "identity": "d2d2ddb8-88ef-4c17-9f4e-eee087e643c9"
        },
        "status": {
            "status": {
                "color": "#1CBCD8",
                "groupType": "bizdoc",
                "locked": false,
                "description": "In verifica",
                "code": "26",
                "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
            },
            "date": "2025-06-30T08:54:40.6893924"
        },
        "nextStatus": [
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#0CC27E",
                    "groupType": "bizdoc",
                    "locked": true,
                    "description": "Chiuso",
                    "code": "09",
                    "identity": "1c6bf1c4-44f9-41e6-9ed7-18758f9c14b0"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-131.41104888916016 -148.3122756958008\",\"link\":{\"fromPort\":\"T\",\"toPort\":\"L\",\"points\":[{\"x\":-346.98590087890625,\"y\":14.468525695800782,\"v\":false},{\"x\":-346.98590087890625,\"y\":-3.531474304199218,\"v\":false},{\"x\":-346.98590087890625,\"y\":-148.3122756958008,\"v\":false},{\"x\":-261.4929504394531,\"y\":-148.3122756958008,\"v\":false},{\"x\":-176,\"y\":-148.3122756958008,\"v\":false},{\"x\":-166,\"y\":-148.3122756958008,\"v\":false}]}}"
            },
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#FF8D60",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "Non completo",
                    "code": "07",
                    "identity": "4aedc3c6-4b15-4e2a-b33d-779076d9a111"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-151.61795043945312 25.68772430419922\",\"link\":{\"fromPort\":\"R\",\"toPort\":\"L\",\"points\":[{\"x\":-288.35479736328125,\"y\":32.15625,\"v\":false},{\"x\":-278.35479736328125,\"y\":32.15625,\"v\":false},{\"x\":-249.29409408569336,\"y\":32.15625,\"v\":false},{\"x\":-249.29409408569336,\"y\":25.68772430419922,\"v\":false},{\"x\":-220.23339080810547,\"y\":25.68772430419922,\"v\":false},{\"x\":-210.23339080810547,\"y\":25.68772430419922,\"v\":false}]}}"
            },
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#ffeb3b",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "Completo",
                    "code": "27",
                    "identity": "1e689f52-cf9f-4e08-8dd6-4bc6520ddb1d"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-158.828125 114.15625\",\"link\":{\"fromPort\":\"B\",\"toPort\":\"L\",\"points\":[{\"x\":-332.328125,\"y\":49.84397430419922,\"v\":false},{\"x\":-332.328125,\"y\":59.84397430419922,\"v\":false},{\"x\":-332.328125,\"y\":114.15625000000001,\"v\":false},{\"x\":-272.3518409729004,\"y\":114.15625000000001,\"v\":false},{\"x\":-212.37555694580078,\"y\":114.15625000000001,\"v\":false},{\"x\":-202.37555694580078,\"y\":114.15625000000001,\"v\":false}]}}"
            }
        ],
        "payments": [],
        "paymentHoldingTypes": [],
        "totalHoldingTypesAmount": 0,
        "movedInChildrenRows": false,
        "hasNotifies": false,
        "hasCalls": false,
        "childrenTypes": [],
        "description": "",
        "code": "9/2025",
        "identity": "1bbb7867-3366-446e-b28c-027dc8def897"
    },
    {
        "type": {
            "groupType": "ORD",
            "originKind": "supplier",
            "refKind": "customer",
            "firstAccountingVisible": false,
            "firstAccountingCreateDocument": false,
            "firstAccountingEditDocument": false,
            "firstAccountingSign": 1,
            "batchSingle": false,
            "batchAutomaticOnly": false,
            "defaultBatchRequired": false,
            "showArticleOverride": false,
            "description": "Ordine cliente",
            "code": "2",
            "identity": "6851aaac-9cd9-455d-8c3a-9dce12719741"
        },
        "incremental": 8,
        "year": 2025,
        "version": 0,
        "creationDate": "2025-06-27T08:41:15.1520626",
        "documentDate": "2025-06-27T00:00:00",
        "lastModifyDate": "2025-06-27T08:41:15.1520633",
        "isRevisioned": false,
        "isLocked": false,
        "isClosed": false,
        "isDeleted": false,
        "autoImported": false,
        "ignoreTopCompany": false,
        "rateableRows": 246.94000000,
        "rateable": 246.94000000,
        "levy": 9.88000000,
        "amount": 256.82000000,
        "total": 256.82000000,
        "reference": "7503302994",
        "stakeholders": [
            {
                "stakeholder": {
                    "vatNumber": "00501611206",
                    "fiscalCode": "",
                    "email": "camst_fattmerci@legalmail.it",
                    "legalEmail": "",
                    "invoiceLegalEmail": "",
                    "phone": "",
                    "mobilePhone": "",
                    "interchangeCode": "HXZMIME",
                    "lastModifyDate": "0001-01-01T00:00:00",
                    "autoImported": false,
                    "firstName": "CAMST SOC.COOP. A R.L.",
                    "secondName": "",
                    "alias": "",
                    "name": "CAMST SOC.COOP. A R.L.",
                    "code": "14",
                    "identity": "0a2b52f1-847b-4ebf-b6b1-82721a688817"
                },
                "kind": "customer"
            }
        ],
        "address": {
            "description": "Z.F. PADOVA MENSA ",
            "street": "VIA PENGHE N. 28",
            "city": "CASELLE DI SELVAZZANO",
            "province": "PD",
            "zipCode": "35030",
            "country": "",
            "fullCity": "CASELLE DI SELVAZZANO(PD)",
            "identity": "d3379e9a-f119-4825-83d3-ef9bc5bd5fd7"
        },
        "status": {
            "status": {
                "color": "#1CBCD8",
                "groupType": "bizdoc",
                "locked": false,
                "description": "In verifica",
                "code": "26",
                "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
            },
            "date": "2025-06-27T08:41:15.1567521"
        },
        "nextStatus": [
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#0CC27E",
                    "groupType": "bizdoc",
                    "locked": true,
                    "description": "Chiuso",
                    "code": "09",
                    "identity": "1c6bf1c4-44f9-41e6-9ed7-18758f9c14b0"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-131.41104888916016 -148.3122756958008\",\"link\":{\"fromPort\":\"T\",\"toPort\":\"L\",\"points\":[{\"x\":-346.98590087890625,\"y\":14.468525695800782,\"v\":false},{\"x\":-346.98590087890625,\"y\":-3.531474304199218,\"v\":false},{\"x\":-346.98590087890625,\"y\":-148.3122756958008,\"v\":false},{\"x\":-261.4929504394531,\"y\":-148.3122756958008,\"v\":false},{\"x\":-176,\"y\":-148.3122756958008,\"v\":false},{\"x\":-166,\"y\":-148.3122756958008,\"v\":false}]}}"
            },
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#FF8D60",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "Non completo",
                    "code": "07",
                    "identity": "4aedc3c6-4b15-4e2a-b33d-779076d9a111"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-151.61795043945312 25.68772430419922\",\"link\":{\"fromPort\":\"R\",\"toPort\":\"L\",\"points\":[{\"x\":-288.35479736328125,\"y\":32.15625,\"v\":false},{\"x\":-278.35479736328125,\"y\":32.15625,\"v\":false},{\"x\":-249.29409408569336,\"y\":32.15625,\"v\":false},{\"x\":-249.29409408569336,\"y\":25.68772430419922,\"v\":false},{\"x\":-220.23339080810547,\"y\":25.68772430419922,\"v\":false},{\"x\":-210.23339080810547,\"y\":25.68772430419922,\"v\":false}]}}"
            },
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#ffeb3b",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "Completo",
                    "code": "27",
                    "identity": "1e689f52-cf9f-4e08-8dd6-4bc6520ddb1d"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-158.828125 114.15625\",\"link\":{\"fromPort\":\"B\",\"toPort\":\"L\",\"points\":[{\"x\":-332.328125,\"y\":49.84397430419922,\"v\":false},{\"x\":-332.328125,\"y\":59.84397430419922,\"v\":false},{\"x\":-332.328125,\"y\":114.15625000000001,\"v\":false},{\"x\":-272.3518409729004,\"y\":114.15625000000001,\"v\":false},{\"x\":-212.37555694580078,\"y\":114.15625000000001,\"v\":false},{\"x\":-202.37555694580078,\"y\":114.15625000000001,\"v\":false}]}}"
            }
        ],
        "payments": [],
        "paymentHoldingTypes": [],
        "totalHoldingTypesAmount": 0,
        "movedInChildrenRows": false,
        "hasNotifies": false,
        "hasCalls": false,
        "childrenTypes": [],
        "description": "",
        "code": "8/2025",
        "identity": "f6236141-6645-49c1-9042-5044f07bf313"
    },
    {
        "type": {
            "groupType": "ORD",
            "originKind": "supplier",
            "refKind": "customer",
            "firstAccountingVisible": false,
            "firstAccountingCreateDocument": false,
            "firstAccountingEditDocument": false,
            "firstAccountingSign": 1,
            "batchSingle": false,
            "batchAutomaticOnly": false,
            "defaultBatchRequired": false,
            "showArticleOverride": false,
            "description": "Ordine cliente",
            "code": "2",
            "identity": "6851aaac-9cd9-455d-8c3a-9dce12719741"
        },
        "incremental": 7,
        "year": 2025,
        "version": 0,
        "creationDate": "2025-06-26T12:24:13.1634148",
        "documentDate": "2025-06-26T00:00:00",
        "lastModifyDate": "2025-06-26T12:25:35.7385425",
        "isRevisioned": false,
        "isLocked": false,
        "isClosed": false,
        "isDeleted": false,
        "autoImported": false,
        "ignoreTopCompany": true,
        "rateableRows": 1042.50000000,
        "rateable": 1042.50000000,
        "levy": 41.70000000,
        "amount": 1084.20000000,
        "total": 1084.20000000,
        "reference": "7503301844",
        "stakeholders": [
            {
                "stakeholder": {
                    "vatNumber": "00501611206",
                    "fiscalCode": "",
                    "email": "camst_fattmerci@legalmail.it",
                    "legalEmail": "",
                    "invoiceLegalEmail": "",
                    "phone": "",
                    "mobilePhone": "",
                    "interchangeCode": "HXZMIME",
                    "lastModifyDate": "0001-01-01T00:00:00",
                    "autoImported": false,
                    "firstName": "CAMST SOC.COOP. A R.L.",
                    "secondName": "",
                    "alias": "",
                    "name": "CAMST SOC.COOP. A R.L.",
                    "code": "14",
                    "identity": "0a2b52f1-847b-4ebf-b6b1-82721a688817"
                },
                "kind": "customer"
            }
        ],
        "address": {
            "description": "CU.CE. ALTINIA",
            "street": "VIA VOLPATO N. 18",
            "city": "QUARTO D'ALTINO",
            "province": "VE",
            "zipCode": "30020",
            "country": "",
            "fullCity": "QUARTO D'ALTINO(VE)",
            "identity": "393a3fb0-25b3-493d-adf0-f9c43c4ae662"
        },
        "status": {
            "status": {
                "color": "#1CBCD8",
                "groupType": "bizdoc",
                "locked": false,
                "description": "In verifica",
                "code": "26",
                "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
            },
            "date": "2025-06-26T12:24:13.1680979"
        },
        "nextStatus": [
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#0CC27E",
                    "groupType": "bizdoc",
                    "locked": true,
                    "description": "Chiuso",
                    "code": "09",
                    "identity": "1c6bf1c4-44f9-41e6-9ed7-18758f9c14b0"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-131.41104888916016 -148.3122756958008\",\"link\":{\"fromPort\":\"T\",\"toPort\":\"L\",\"points\":[{\"x\":-346.98590087890625,\"y\":14.468525695800782,\"v\":false},{\"x\":-346.98590087890625,\"y\":-3.531474304199218,\"v\":false},{\"x\":-346.98590087890625,\"y\":-148.3122756958008,\"v\":false},{\"x\":-261.4929504394531,\"y\":-148.3122756958008,\"v\":false},{\"x\":-176,\"y\":-148.3122756958008,\"v\":false},{\"x\":-166,\"y\":-148.3122756958008,\"v\":false}]}}"
            },
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#FF8D60",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "Non completo",
                    "code": "07",
                    "identity": "4aedc3c6-4b15-4e2a-b33d-779076d9a111"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-151.61795043945312 25.68772430419922\",\"link\":{\"fromPort\":\"R\",\"toPort\":\"L\",\"points\":[{\"x\":-288.35479736328125,\"y\":32.15625,\"v\":false},{\"x\":-278.35479736328125,\"y\":32.15625,\"v\":false},{\"x\":-249.29409408569336,\"y\":32.15625,\"v\":false},{\"x\":-249.29409408569336,\"y\":25.68772430419922,\"v\":false},{\"x\":-220.23339080810547,\"y\":25.68772430419922,\"v\":false},{\"x\":-210.23339080810547,\"y\":25.68772430419922,\"v\":false}]}}"
            },
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#ffeb3b",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "Completo",
                    "code": "27",
                    "identity": "1e689f52-cf9f-4e08-8dd6-4bc6520ddb1d"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-158.828125 114.15625\",\"link\":{\"fromPort\":\"B\",\"toPort\":\"L\",\"points\":[{\"x\":-332.328125,\"y\":49.84397430419922,\"v\":false},{\"x\":-332.328125,\"y\":59.84397430419922,\"v\":false},{\"x\":-332.328125,\"y\":114.15625000000001,\"v\":false},{\"x\":-272.3518409729004,\"y\":114.15625000000001,\"v\":false},{\"x\":-212.37555694580078,\"y\":114.15625000000001,\"v\":false},{\"x\":-202.37555694580078,\"y\":114.15625000000001,\"v\":false}]}}"
            }
        ],
        "payments": [],
        "paymentHoldingTypes": [],
        "totalHoldingTypesAmount": 0,
        "movedInChildrenRows": false,
        "hasNotifies": false,
        "hasCalls": false,
        "childrenTypes": [],
        "description": "",
        "code": "7/2025",
        "identity": "945fcd81-45b3-4a46-b08d-d46b23884bd8"
    },
    {
        "type": {
            "groupType": "ORD",
            "originKind": "supplier",
            "refKind": "customer",
            "firstAccountingVisible": false,
            "firstAccountingCreateDocument": false,
            "firstAccountingEditDocument": false,
            "firstAccountingSign": 1,
            "batchSingle": false,
            "batchAutomaticOnly": false,
            "defaultBatchRequired": false,
            "showArticleOverride": false,
            "description": "Ordine cliente",
            "code": "2",
            "identity": "6851aaac-9cd9-455d-8c3a-9dce12719741"
        },
        "incremental": 6,
        "year": 2025,
        "version": 0,
        "creationDate": "2025-06-26T12:23:01.6330575",
        "documentDate": "2025-06-26T00:00:00",
        "lastModifyDate": "2025-06-26T12:23:01.6330583",
        "isRevisioned": false,
        "isLocked": false,
        "isClosed": false,
        "isDeleted": false,
        "autoImported": false,
        "ignoreTopCompany": false,
        "rateableRows": 54.30000000,
        "rateable": 54.30000000,
        "levy": 2.17000000,
        "amount": 56.47000000,
        "total": 56.47000000,
        "reference": "LOZZO 30/06",
        "stakeholders": [
            {
                "stakeholder": {
                    "vatNumber": "10146140966",
                    "fiscalCode": "",
                    "email": "danielaschiavon@eatyristorazione.it",
                    "legalEmail": "",
                    "invoiceLegalEmail": "",
                    "phone": "",
                    "mobilePhone": "",
                    "interchangeCode": "USAL8PV",
                    "lastModifyDate": "0001-01-01T00:00:00",
                    "autoImported": false,
                    "firstName": "EATY SRL",
                    "secondName": "",
                    "alias": "",
                    "name": "EATY SRL",
                    "code": "192",
                    "identity": "b25026fc-a88c-40e1-82e0-64f7fb98df1a"
                },
                "kind": "customer"
            }
        ],
        "address": {
            "description": "E20 - CUCINA LOZZO",
            "street": "VIA DELLE ROSE 19",
            "city": "LOZZO ATESTINO",
            "province": "PD",
            "zipCode": "35034",
            "country": "IT",
            "fullCity": "LOZZO ATESTINO(PD)",
            "identity": "91e7a717-c20f-44de-aa97-1a02466d4841"
        },
        "status": {
            "status": {
                "color": "#1CBCD8",
                "groupType": "bizdoc",
                "locked": false,
                "description": "In verifica",
                "code": "26",
                "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
            },
            "date": "2025-06-26T12:23:01.6357468"
        },
        "nextStatus": [
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#0CC27E",
                    "groupType": "bizdoc",
                    "locked": true,
                    "description": "Chiuso",
                    "code": "09",
                    "identity": "1c6bf1c4-44f9-41e6-9ed7-18758f9c14b0"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-131.41104888916016 -148.3122756958008\",\"link\":{\"fromPort\":\"T\",\"toPort\":\"L\",\"points\":[{\"x\":-346.98590087890625,\"y\":14.468525695800782,\"v\":false},{\"x\":-346.98590087890625,\"y\":-3.531474304199218,\"v\":false},{\"x\":-346.98590087890625,\"y\":-148.3122756958008,\"v\":false},{\"x\":-261.4929504394531,\"y\":-148.3122756958008,\"v\":false},{\"x\":-176,\"y\":-148.3122756958008,\"v\":false},{\"x\":-166,\"y\":-148.3122756958008,\"v\":false}]}}"
            },
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#FF8D60",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "Non completo",
                    "code": "07",
                    "identity": "4aedc3c6-4b15-4e2a-b33d-779076d9a111"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-151.61795043945312 25.68772430419922\",\"link\":{\"fromPort\":\"R\",\"toPort\":\"L\",\"points\":[{\"x\":-288.35479736328125,\"y\":32.15625,\"v\":false},{\"x\":-278.35479736328125,\"y\":32.15625,\"v\":false},{\"x\":-249.29409408569336,\"y\":32.15625,\"v\":false},{\"x\":-249.29409408569336,\"y\":25.68772430419922,\"v\":false},{\"x\":-220.23339080810547,\"y\":25.68772430419922,\"v\":false},{\"x\":-210.23339080810547,\"y\":25.68772430419922,\"v\":false}]}}"
            },
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#ffeb3b",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "Completo",
                    "code": "27",
                    "identity": "1e689f52-cf9f-4e08-8dd6-4bc6520ddb1d"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-158.828125 114.15625\",\"link\":{\"fromPort\":\"B\",\"toPort\":\"L\",\"points\":[{\"x\":-332.328125,\"y\":49.84397430419922,\"v\":false},{\"x\":-332.328125,\"y\":59.84397430419922,\"v\":false},{\"x\":-332.328125,\"y\":114.15625000000001,\"v\":false},{\"x\":-272.3518409729004,\"y\":114.15625000000001,\"v\":false},{\"x\":-212.37555694580078,\"y\":114.15625000000001,\"v\":false},{\"x\":-202.37555694580078,\"y\":114.15625000000001,\"v\":false}]}}"
            }
        ],
        "payments": [],
        "paymentHoldingTypes": [],
        "totalHoldingTypesAmount": 0,
        "movedInChildrenRows": false,
        "hasNotifies": false,
        "hasCalls": false,
        "childrenTypes": [],
        "description": "",
        "code": "6/2025",
        "identity": "ea3be9b7-b574-43eb-854f-3722c64dc376"
    },
    {
        "type": {
            "groupType": "ORD",
            "originKind": "supplier",
            "refKind": "customer",
            "firstAccountingVisible": false,
            "firstAccountingCreateDocument": false,
            "firstAccountingEditDocument": false,
            "firstAccountingSign": 1,
            "batchSingle": false,
            "batchAutomaticOnly": false,
            "defaultBatchRequired": false,
            "showArticleOverride": false,
            "description": "Ordine cliente",
            "code": "2",
            "identity": "6851aaac-9cd9-455d-8c3a-9dce12719741"
        },
        "incremental": 5,
        "year": 2025,
        "version": 0,
        "creationDate": "2025-06-26T12:21:20.5393887",
        "documentDate": "2025-06-26T00:00:00",
        "lastModifyDate": "2025-06-26T12:21:20.5393896",
        "isRevisioned": false,
        "isLocked": false,
        "isClosed": false,
        "isDeleted": false,
        "autoImported": false,
        "ignoreTopCompany": false,
        "rateableRows": 55.50000000,
        "rateable": 55.50000000,
        "levy": 2.22000000,
        "amount": 57.72000000,
        "total": 57.72000000,
        "reference": "Sant'Urbano 30/06",
        "stakeholders": [
            {
                "stakeholder": {
                    "vatNumber": "10146140966",
                    "fiscalCode": "",
                    "email": "danielaschiavon@eatyristorazione.it",
                    "legalEmail": "",
                    "invoiceLegalEmail": "",
                    "phone": "",
                    "mobilePhone": "",
                    "interchangeCode": "USAL8PV",
                    "lastModifyDate": "0001-01-01T00:00:00",
                    "autoImported": false,
                    "firstName": "EATY SRL",
                    "secondName": "",
                    "alias": "",
                    "name": "EATY SRL",
                    "code": "192",
                    "identity": "b25026fc-a88c-40e1-82e0-64f7fb98df1a"
                },
                "kind": "customer"
            }
        ],
        "address": {
            "description": "E13 - CUCINA SANT'URBANO",
            "street": "VIA VALGRANDE 43/A",
            "city": "SANT'URBANO",
            "province": "PD",
            "zipCode": "35040",
            "country": "IT",
            "fullCity": "SANT'URBANO(PD)",
            "identity": "abaf1eb8-0a2a-4c33-ace6-59c5746b68a9"
        },
        "status": {
            "status": {
                "color": "#1CBCD8",
                "groupType": "bizdoc",
                "locked": false,
                "description": "In verifica",
                "code": "26",
                "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
            },
            "date": "2025-06-26T12:21:20.5419954"
        },
        "nextStatus": [
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#0CC27E",
                    "groupType": "bizdoc",
                    "locked": true,
                    "description": "Chiuso",
                    "code": "09",
                    "identity": "1c6bf1c4-44f9-41e6-9ed7-18758f9c14b0"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-131.41104888916016 -148.3122756958008\",\"link\":{\"fromPort\":\"T\",\"toPort\":\"L\",\"points\":[{\"x\":-346.98590087890625,\"y\":14.468525695800782,\"v\":false},{\"x\":-346.98590087890625,\"y\":-3.531474304199218,\"v\":false},{\"x\":-346.98590087890625,\"y\":-148.3122756958008,\"v\":false},{\"x\":-261.4929504394531,\"y\":-148.3122756958008,\"v\":false},{\"x\":-176,\"y\":-148.3122756958008,\"v\":false},{\"x\":-166,\"y\":-148.3122756958008,\"v\":false}]}}"
            },
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#FF8D60",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "Non completo",
                    "code": "07",
                    "identity": "4aedc3c6-4b15-4e2a-b33d-779076d9a111"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-151.61795043945312 25.68772430419922\",\"link\":{\"fromPort\":\"R\",\"toPort\":\"L\",\"points\":[{\"x\":-288.35479736328125,\"y\":32.15625,\"v\":false},{\"x\":-278.35479736328125,\"y\":32.15625,\"v\":false},{\"x\":-249.29409408569336,\"y\":32.15625,\"v\":false},{\"x\":-249.29409408569336,\"y\":25.68772430419922,\"v\":false},{\"x\":-220.23339080810547,\"y\":25.68772430419922,\"v\":false},{\"x\":-210.23339080810547,\"y\":25.68772430419922,\"v\":false}]}}"
            },
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#ffeb3b",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "Completo",
                    "code": "27",
                    "identity": "1e689f52-cf9f-4e08-8dd6-4bc6520ddb1d"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-158.828125 114.15625\",\"link\":{\"fromPort\":\"B\",\"toPort\":\"L\",\"points\":[{\"x\":-332.328125,\"y\":49.84397430419922,\"v\":false},{\"x\":-332.328125,\"y\":59.84397430419922,\"v\":false},{\"x\":-332.328125,\"y\":114.15625000000001,\"v\":false},{\"x\":-272.3518409729004,\"y\":114.15625000000001,\"v\":false},{\"x\":-212.37555694580078,\"y\":114.15625000000001,\"v\":false},{\"x\":-202.37555694580078,\"y\":114.15625000000001,\"v\":false}]}}"
            }
        ],
        "payments": [],
        "paymentHoldingTypes": [],
        "totalHoldingTypesAmount": 0,
        "movedInChildrenRows": false,
        "hasNotifies": false,
        "hasCalls": false,
        "childrenTypes": [],
        "description": "",
        "code": "5/2025",
        "identity": "648f679e-b4b1-42e8-88d6-8b046924682d"
    },
    {
        "type": {
            "groupType": "ORD",
            "originKind": "supplier",
            "refKind": "customer",
            "firstAccountingVisible": false,
            "firstAccountingCreateDocument": false,
            "firstAccountingEditDocument": false,
            "firstAccountingSign": 1,
            "batchSingle": false,
            "batchAutomaticOnly": false,
            "defaultBatchRequired": false,
            "showArticleOverride": false,
            "description": "Ordine cliente",
            "code": "2",
            "identity": "6851aaac-9cd9-455d-8c3a-9dce12719741"
        },
        "incremental": 4,
        "year": 2025,
        "version": 0,
        "creationDate": "2025-06-26T12:10:42.8807029",
        "documentDate": "2025-06-26T00:00:00",
        "lastModifyDate": "2025-06-26T12:19:13.7160687",
        "isRevisioned": false,
        "isLocked": false,
        "isClosed": false,
        "isDeleted": false,
        "autoImported": false,
        "ignoreTopCompany": true,
        "rateableRows": 82.00000000,
        "rateable": 82.00000000,
        "levy": 16.24000000,
        "amount": 98.24000000,
        "total": 98.24000000,
        "reference": "Asilo",
        "stakeholders": [
            {
                "stakeholder": {
                    "vatNumber": "03198940276",
                    "fiscalCode": "",
                    "email": "serimi_fattmerci@legalmail.it",
                    "legalEmail": "",
                    "invoiceLegalEmail": "",
                    "phone": "",
                    "mobilePhone": "",
                    "interchangeCode": "9T1V10S",
                    "lastModifyDate": "0001-01-01T00:00:00",
                    "autoImported": false,
                    "firstName": "SE.RI.MI.  S.R.L",
                    "secondName": "",
                    "alias": "",
                    "name": "SE.RI.MI.  S.R.L",
                    "code": "6",
                    "identity": "27f9380c-91ed-4e2f-b7cf-5faf67082ec6"
                },
                "kind": "customer"
            }
        ],
        "address": {
            "description": "SERIMI S.R.L ASILO NIDO",
            "street": "VIA E.TOTI  N.33",
            "city": "MIRA",
            "province": "VE",
            "zipCode": "",
            "country": "",
            "fullCity": "MIRA(VE)",
            "identity": "85d8e766-c646-4e97-996e-f51b7dba79ca"
        },
        "status": {
            "status": {
                "color": "#1CBCD8",
                "groupType": "bizdoc",
                "locked": false,
                "description": "In verifica",
                "code": "26",
                "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
            },
            "date": "2025-06-26T12:10:42.8830986"
        },
        "nextStatus": [
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#0CC27E",
                    "groupType": "bizdoc",
                    "locked": true,
                    "description": "Chiuso",
                    "code": "09",
                    "identity": "1c6bf1c4-44f9-41e6-9ed7-18758f9c14b0"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-131.41104888916016 -148.3122756958008\",\"link\":{\"fromPort\":\"T\",\"toPort\":\"L\",\"points\":[{\"x\":-346.98590087890625,\"y\":14.468525695800782,\"v\":false},{\"x\":-346.98590087890625,\"y\":-3.531474304199218,\"v\":false},{\"x\":-346.98590087890625,\"y\":-148.3122756958008,\"v\":false},{\"x\":-261.4929504394531,\"y\":-148.3122756958008,\"v\":false},{\"x\":-176,\"y\":-148.3122756958008,\"v\":false},{\"x\":-166,\"y\":-148.3122756958008,\"v\":false}]}}"
            },
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#FF8D60",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "Non completo",
                    "code": "07",
                    "identity": "4aedc3c6-4b15-4e2a-b33d-779076d9a111"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-151.61795043945312 25.68772430419922\",\"link\":{\"fromPort\":\"R\",\"toPort\":\"L\",\"points\":[{\"x\":-288.35479736328125,\"y\":32.15625,\"v\":false},{\"x\":-278.35479736328125,\"y\":32.15625,\"v\":false},{\"x\":-249.29409408569336,\"y\":32.15625,\"v\":false},{\"x\":-249.29409408569336,\"y\":25.68772430419922,\"v\":false},{\"x\":-220.23339080810547,\"y\":25.68772430419922,\"v\":false},{\"x\":-210.23339080810547,\"y\":25.68772430419922,\"v\":false}]}}"
            },
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#ffeb3b",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "Completo",
                    "code": "27",
                    "identity": "1e689f52-cf9f-4e08-8dd6-4bc6520ddb1d"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-158.828125 114.15625\",\"link\":{\"fromPort\":\"B\",\"toPort\":\"L\",\"points\":[{\"x\":-332.328125,\"y\":49.84397430419922,\"v\":false},{\"x\":-332.328125,\"y\":59.84397430419922,\"v\":false},{\"x\":-332.328125,\"y\":114.15625000000001,\"v\":false},{\"x\":-272.3518409729004,\"y\":114.15625000000001,\"v\":false},{\"x\":-212.37555694580078,\"y\":114.15625000000001,\"v\":false},{\"x\":-202.37555694580078,\"y\":114.15625000000001,\"v\":false}]}}"
            }
        ],
        "payments": [],
        "paymentHoldingTypes": [],
        "totalHoldingTypesAmount": 0,
        "movedInChildrenRows": false,
        "hasNotifies": false,
        "hasCalls": false,
        "childrenTypes": [],
        "description": "",
        "code": "4/2025",
        "identity": "05a701a5-4564-49de-b639-a8a5ceb2d36e"
    },
    {
        "type": {
            "groupType": "ORD",
            "originKind": "supplier",
            "refKind": "customer",
            "firstAccountingVisible": false,
            "firstAccountingCreateDocument": false,
            "firstAccountingEditDocument": false,
            "firstAccountingSign": 1,
            "batchSingle": false,
            "batchAutomaticOnly": false,
            "defaultBatchRequired": false,
            "showArticleOverride": false,
            "description": "Ordine cliente",
            "code": "2",
            "identity": "6851aaac-9cd9-455d-8c3a-9dce12719741"
        },
        "incremental": 3,
        "year": 2025,
        "version": 0,
        "creationDate": "2025-06-26T12:02:17.1024896",
        "documentDate": "2025-06-26T00:00:00",
        "lastModifyDate": "2025-06-26T12:03:04.4517825",
        "isRevisioned": false,
        "isLocked": false,
        "isClosed": false,
        "isDeleted": false,
        "autoImported": false,
        "ignoreTopCompany": true,
        "rateableRows": 92.05000000,
        "rateable": 92.05000000,
        "levy": 20.25000000,
        "amount": 112.30000000,
        "total": 112.30000000,
        "reference": "7503300975",
        "stakeholders": [
            {
                "stakeholder": {
                    "vatNumber": "00501611206",
                    "fiscalCode": "",
                    "email": "camst_fattmerci@legalmail.it",
                    "legalEmail": "",
                    "invoiceLegalEmail": "",
                    "phone": "",
                    "mobilePhone": "",
                    "interchangeCode": "HXZMIME",
                    "lastModifyDate": "0001-01-01T00:00:00",
                    "autoImported": false,
                    "firstName": "CAMST SOC.COOP. A R.L.",
                    "secondName": "",
                    "alias": "",
                    "name": "CAMST SOC.COOP. A R.L.",
                    "code": "14",
                    "identity": "0a2b52f1-847b-4ebf-b6b1-82721a688817"
                },
                "kind": "customer"
            }
        ],
        "address": {
            "description": "ASILO NIDO \"MARCO DA CLES\" DK",
            "street": "VIA XVI MARZO N. 1",
            "city": "ALBIGNASEGO",
            "province": "PD",
            "zipCode": "35020",
            "country": "",
            "fullCity": "ALBIGNASEGO(PD)",
            "identity": "bb6bdcf2-59f5-404a-b48b-cfd73233d239"
        },
        "status": {
            "status": {
                "color": "#1CBCD8",
                "groupType": "bizdoc",
                "locked": false,
                "description": "In verifica",
                "code": "26",
                "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
            },
            "date": "2025-06-26T12:02:17.1079168"
        },
        "nextStatus": [
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#0CC27E",
                    "groupType": "bizdoc",
                    "locked": true,
                    "description": "Chiuso",
                    "code": "09",
                    "identity": "1c6bf1c4-44f9-41e6-9ed7-18758f9c14b0"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-131.41104888916016 -148.3122756958008\",\"link\":{\"fromPort\":\"T\",\"toPort\":\"L\",\"points\":[{\"x\":-346.98590087890625,\"y\":14.468525695800782,\"v\":false},{\"x\":-346.98590087890625,\"y\":-3.531474304199218,\"v\":false},{\"x\":-346.98590087890625,\"y\":-148.3122756958008,\"v\":false},{\"x\":-261.4929504394531,\"y\":-148.3122756958008,\"v\":false},{\"x\":-176,\"y\":-148.3122756958008,\"v\":false},{\"x\":-166,\"y\":-148.3122756958008,\"v\":false}]}}"
            },
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#FF8D60",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "Non completo",
                    "code": "07",
                    "identity": "4aedc3c6-4b15-4e2a-b33d-779076d9a111"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-151.61795043945312 25.68772430419922\",\"link\":{\"fromPort\":\"R\",\"toPort\":\"L\",\"points\":[{\"x\":-288.35479736328125,\"y\":32.15625,\"v\":false},{\"x\":-278.35479736328125,\"y\":32.15625,\"v\":false},{\"x\":-249.29409408569336,\"y\":32.15625,\"v\":false},{\"x\":-249.29409408569336,\"y\":25.68772430419922,\"v\":false},{\"x\":-220.23339080810547,\"y\":25.68772430419922,\"v\":false},{\"x\":-210.23339080810547,\"y\":25.68772430419922,\"v\":false}]}}"
            },
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#ffeb3b",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "Completo",
                    "code": "27",
                    "identity": "1e689f52-cf9f-4e08-8dd6-4bc6520ddb1d"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-158.828125 114.15625\",\"link\":{\"fromPort\":\"B\",\"toPort\":\"L\",\"points\":[{\"x\":-332.328125,\"y\":49.84397430419922,\"v\":false},{\"x\":-332.328125,\"y\":59.84397430419922,\"v\":false},{\"x\":-332.328125,\"y\":114.15625000000001,\"v\":false},{\"x\":-272.3518409729004,\"y\":114.15625000000001,\"v\":false},{\"x\":-212.37555694580078,\"y\":114.15625000000001,\"v\":false},{\"x\":-202.37555694580078,\"y\":114.15625000000001,\"v\":false}]}}"
            }
        ],
        "payments": [],
        "paymentHoldingTypes": [],
        "totalHoldingTypesAmount": 0,
        "movedInChildrenRows": false,
        "hasNotifies": false,
        "hasCalls": false,
        "childrenTypes": [],
        "description": "",
        "code": "3/2025",
        "identity": "18d63e15-96ee-492e-95e5-68d610342526"
    },
    {
        "type": {
            "groupType": "ORD",
            "originKind": "supplier",
            "refKind": "customer",
            "firstAccountingVisible": false,
            "firstAccountingCreateDocument": false,
            "firstAccountingEditDocument": false,
            "firstAccountingSign": 1,
            "batchSingle": false,
            "batchAutomaticOnly": false,
            "defaultBatchRequired": false,
            "showArticleOverride": false,
            "description": "Ordine cliente",
            "code": "2",
            "identity": "6851aaac-9cd9-455d-8c3a-9dce12719741"
        },
        "incremental": 2,
        "year": 2025,
        "version": 0,
        "creationDate": "2025-06-26T11:59:25.1846421",
        "documentDate": "2025-06-26T00:00:00",
        "lastModifyDate": "2025-06-26T11:59:25.1846432",
        "isRevisioned": false,
        "isLocked": false,
        "isClosed": false,
        "isDeleted": false,
        "autoImported": false,
        "ignoreTopCompany": false,
        "rateableRows": 582.50000000,
        "rateable": 582.50000000,
        "levy": 23.30000000,
        "amount": 605.80000000,
        "total": 605.80000000,
        "reference": "7503302024",
        "stakeholders": [
            {
                "stakeholder": {
                    "vatNumber": "03198940276",
                    "fiscalCode": "",
                    "email": "serimi_fattmerci@legalmail.it",
                    "legalEmail": "",
                    "invoiceLegalEmail": "",
                    "phone": "",
                    "mobilePhone": "",
                    "interchangeCode": "9T1V10S",
                    "lastModifyDate": "0001-01-01T00:00:00",
                    "autoImported": false,
                    "firstName": "SE.RI.MI.  S.R.L",
                    "secondName": "",
                    "alias": "",
                    "name": "SE.RI.MI.  S.R.L",
                    "code": "6",
                    "identity": "27f9380c-91ed-4e2f-b7cf-5faf67082ec6"
                },
                "kind": "customer"
            }
        ],
        "address": {
            "description": "SE.RI.MI. S.R.L.",
            "street": "VIA MARE MEDITERRANEO N. 25/2",
            "city": "MIRA",
            "province": "VE",
            "zipCode": "30034",
            "country": "",
            "fullCity": "MIRA(VE)",
            "identity": "eade0db3-96eb-4a29-8345-15f26e7fb0d6"
        },
        "status": {
            "status": {
                "color": "#1CBCD8",
                "groupType": "bizdoc",
                "locked": false,
                "description": "In verifica",
                "code": "26",
                "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
            },
            "date": "2025-06-26T11:59:25.2856895"
        },
        "nextStatus": [
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#0CC27E",
                    "groupType": "bizdoc",
                    "locked": true,
                    "description": "Chiuso",
                    "code": "09",
                    "identity": "1c6bf1c4-44f9-41e6-9ed7-18758f9c14b0"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-131.41104888916016 -148.3122756958008\",\"link\":{\"fromPort\":\"T\",\"toPort\":\"L\",\"points\":[{\"x\":-346.98590087890625,\"y\":14.468525695800782,\"v\":false},{\"x\":-346.98590087890625,\"y\":-3.531474304199218,\"v\":false},{\"x\":-346.98590087890625,\"y\":-148.3122756958008,\"v\":false},{\"x\":-261.4929504394531,\"y\":-148.3122756958008,\"v\":false},{\"x\":-176,\"y\":-148.3122756958008,\"v\":false},{\"x\":-166,\"y\":-148.3122756958008,\"v\":false}]}}"
            },
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#FF8D60",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "Non completo",
                    "code": "07",
                    "identity": "4aedc3c6-4b15-4e2a-b33d-779076d9a111"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-151.61795043945312 25.68772430419922\",\"link\":{\"fromPort\":\"R\",\"toPort\":\"L\",\"points\":[{\"x\":-288.35479736328125,\"y\":32.15625,\"v\":false},{\"x\":-278.35479736328125,\"y\":32.15625,\"v\":false},{\"x\":-249.29409408569336,\"y\":32.15625,\"v\":false},{\"x\":-249.29409408569336,\"y\":25.68772430419922,\"v\":false},{\"x\":-220.23339080810547,\"y\":25.68772430419922,\"v\":false},{\"x\":-210.23339080810547,\"y\":25.68772430419922,\"v\":false}]}}"
            },
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#ffeb3b",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "Completo",
                    "code": "27",
                    "identity": "1e689f52-cf9f-4e08-8dd6-4bc6520ddb1d"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-158.828125 114.15625\",\"link\":{\"fromPort\":\"B\",\"toPort\":\"L\",\"points\":[{\"x\":-332.328125,\"y\":49.84397430419922,\"v\":false},{\"x\":-332.328125,\"y\":59.84397430419922,\"v\":false},{\"x\":-332.328125,\"y\":114.15625000000001,\"v\":false},{\"x\":-272.3518409729004,\"y\":114.15625000000001,\"v\":false},{\"x\":-212.37555694580078,\"y\":114.15625000000001,\"v\":false},{\"x\":-202.37555694580078,\"y\":114.15625000000001,\"v\":false}]}}"
            }
        ],
        "payments": [],
        "paymentHoldingTypes": [],
        "totalHoldingTypesAmount": 0,
        "movedInChildrenRows": false,
        "hasNotifies": false,
        "hasCalls": false,
        "childrenTypes": [],
        "description": "",
        "code": "2/2025",
        "identity": "b066a4bc-474d-4b36-a42c-f365d096eab7"
    },
    {
        "type": {
            "groupType": "ORD",
            "originKind": "supplier",
            "refKind": "customer",
            "firstAccountingVisible": false,
            "firstAccountingCreateDocument": false,
            "firstAccountingEditDocument": false,
            "firstAccountingSign": 1,
            "batchSingle": false,
            "batchAutomaticOnly": false,
            "defaultBatchRequired": false,
            "showArticleOverride": false,
            "description": "Ordine cliente",
            "code": "2",
            "identity": "6851aaac-9cd9-455d-8c3a-9dce12719741"
        },
        "incremental": 1,
        "year": 2025,
        "version": 0,
        "creationDate": "2025-06-25T12:16:00.2260585",
        "documentDate": "2025-06-25T00:00:00",
        "lastModifyDate": "2025-06-25T12:26:26.2391669",
        "isRevisioned": false,
        "isLocked": false,
        "isClosed": false,
        "isDeleted": false,
        "autoImported": false,
        "ignoreTopCompany": true,
        "rateableRows": 279.35000000,
        "rateable": 279.35000000,
        "levy": 61.46000000,
        "amount": 340.81000000,
        "total": 340.81000000,
        "stakeholders": [
            {
                "stakeholder": {
                    "vatNumber": "10146140966",
                    "fiscalCode": "",
                    "email": "danielaschiavon@eatyristorazione.it",
                    "legalEmail": "",
                    "invoiceLegalEmail": "",
                    "phone": "",
                    "mobilePhone": "",
                    "interchangeCode": "USAL8PV",
                    "lastModifyDate": "0001-01-01T00:00:00",
                    "autoImported": false,
                    "firstName": "EATY SRL",
                    "secondName": "",
                    "alias": "",
                    "name": "EATY SRL",
                    "code": "192",
                    "identity": "b25026fc-a88c-40e1-82e0-64f7fb98df1a"
                },
                "kind": "customer"
            }
        ],
        "address": {
            "description": "CRS  RELAXXI",
            "street": "VIA AURELIO DE POL 20",
            "city": "NOALE",
            "province": "VE",
            "zipCode": "30033",
            "country": "ITA",
            "fullCity": "NOALE(VE)",
            "identity": "d2d2ddb8-88ef-4c17-9f4e-eee087e643c9"
        },
        "status": {
            "status": {
                "color": "#1CBCD8",
                "groupType": "bizdoc",
                "locked": false,
                "description": "In verifica",
                "code": "26",
                "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
            },
            "date": "2025-06-25T12:16:00.326987"
        },
        "nextStatus": [
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#0CC27E",
                    "groupType": "bizdoc",
                    "locked": true,
                    "description": "Chiuso",
                    "code": "09",
                    "identity": "1c6bf1c4-44f9-41e6-9ed7-18758f9c14b0"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-131.41104888916016 -148.3122756958008\",\"link\":{\"fromPort\":\"T\",\"toPort\":\"L\",\"points\":[{\"x\":-346.98590087890625,\"y\":14.468525695800782,\"v\":false},{\"x\":-346.98590087890625,\"y\":-3.531474304199218,\"v\":false},{\"x\":-346.98590087890625,\"y\":-148.3122756958008,\"v\":false},{\"x\":-261.4929504394531,\"y\":-148.3122756958008,\"v\":false},{\"x\":-176,\"y\":-148.3122756958008,\"v\":false},{\"x\":-166,\"y\":-148.3122756958008,\"v\":false}]}}"
            },
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#FF8D60",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "Non completo",
                    "code": "07",
                    "identity": "4aedc3c6-4b15-4e2a-b33d-779076d9a111"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-151.61795043945312 25.68772430419922\",\"link\":{\"fromPort\":\"R\",\"toPort\":\"L\",\"points\":[{\"x\":-288.35479736328125,\"y\":32.15625,\"v\":false},{\"x\":-278.35479736328125,\"y\":32.15625,\"v\":false},{\"x\":-249.29409408569336,\"y\":32.15625,\"v\":false},{\"x\":-249.29409408569336,\"y\":25.68772430419922,\"v\":false},{\"x\":-220.23339080810547,\"y\":25.68772430419922,\"v\":false},{\"x\":-210.23339080810547,\"y\":25.68772430419922,\"v\":false}]}}"
            },
            {
                "previousStatus": {
                    "color": "#1CBCD8",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "In verifica",
                    "code": "26",
                    "identity": "5c76e538-0de9-46d2-90d2-f13ac0105f03"
                },
                "status": {
                    "color": "#ffeb3b",
                    "groupType": "bizdoc",
                    "locked": false,
                    "description": "Completo",
                    "code": "27",
                    "identity": "1e689f52-cf9f-4e08-8dd6-4bc6520ddb1d"
                },
                "payload": "{\"prevloc\":\"-332.328125 32.15625\",\"loc\":\"-158.828125 114.15625\",\"link\":{\"fromPort\":\"B\",\"toPort\":\"L\",\"points\":[{\"x\":-332.328125,\"y\":49.84397430419922,\"v\":false},{\"x\":-332.328125,\"y\":59.84397430419922,\"v\":false},{\"x\":-332.328125,\"y\":114.15625000000001,\"v\":false},{\"x\":-272.3518409729004,\"y\":114.15625000000001,\"v\":false},{\"x\":-212.37555694580078,\"y\":114.15625000000001,\"v\":false},{\"x\":-202.37555694580078,\"y\":114.15625000000001,\"v\":false}]}}"
            }
        ],
        "payments": [],
        "paymentHoldingTypes": [],
        "totalHoldingTypesAmount": 0,
        "movedInChildrenRows": false,
        "hasNotifies": false,
        "hasCalls": false,
        "childrenTypes": [],
        "description": "",
        "code": "1/2025",
        "identity": "c68d8ffb-1c2d-43e9-b6c4-ec4481698f4d"
    }
]);

  onTableEvent(event: any) {
    console.log('Table event:', event);
  }
}
