/**
 * Dati di esempio per la dimostrazione della tabella
 * Contiene ordini clienti con struttura completa per il test del componente data-table-light
 */
export const SAMPLE_DATA = [
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
      "description": "Customer Order",
      "code": "2",
      "identity": "anon-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
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
          "vatNumber": "xxxxxxxxx",
          "fiscalCode": "",
          "email": "email@example.com",
          "legalEmail": "",
          "invoiceLegalEmail": "",
          "phone": "",
          "mobilePhone": "",
          "interchangeCode": "XXXXXXX",
          "lastModifyDate": "0001-01-01T00:00:00",
          "autoImported": false,
          "firstName": "Company SRL",
          "secondName": "",
          "alias": "",
          "name": "Company SRL",
          "code": "192",
          "identity": "anon-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        },
        "kind": "customer"
      }
    ],
    "address": {
      "description": "Relax Area",
      "street": "Via Example 20",
      "city": "City",
      "province": "PR",
      "zipCode": "00000",
      "country": "ITA",
      "fullCity": "City(PR)",
      "identity": "anon-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    },
    "status": {
      "status": {
        "color": "#1CBCD8",
        "groupType": "bizdoc",
        "locked": false,
        "description": "In verification",
        "code": "26",
        "identity": "anon-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      },
      "date": "2025-06-30T08:55:15.9312812"
    },
    "nextStatus": [],
    "payments": [],
    "paymentHoldingTypes": [],
    "totalHoldingTypesAmount": 0,
    "movedInChildrenRows": false,
    "hasNotifies": false,
    "hasCalls": false,
    "childrenTypes": [],
    "description": "",
    "code": "10/2025",
    "identity": "anon-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
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
      "description": "Customer Order",
      "code": "2",
      "identity": "anon-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
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
          "vatNumber": "xxxxxxxxx",
          "fiscalCode": "",
          "email": "email@example.com",
          "legalEmail": "",
          "invoiceLegalEmail": "",
          "phone": "",
          "mobilePhone": "",
          "interchangeCode": "XXXXXXX",
          "lastModifyDate": "0001-01-01T00:00:00",
          "autoImported": false,
          "firstName": "Company SRL",
          "secondName": "",
          "alias": "",
          "name": "Company SRL",
          "code": "192",
          "identity": "anon-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        },
        "kind": "customer"
      }
    ],
    "address": {
      "description": "Relax Area",
      "street": "Via Example 20",
      "city": "City",
      "province": "PR",
      "zipCode": "00000",
      "country": "ITA",
      "fullCity": "City(PR)",
      "identity": "anon-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    },
    "status": {
      "status": {
        "color": "#1CBCD8",
        "groupType": "bizdoc",
        "locked": false,
        "description": "In verification",
        "code": "26",
        "identity": "anon-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      },
      "date": "2025-06-30T08:54:40.6893924"
    },
    "nextStatus": [],
    "payments": [],
    "paymentHoldingTypes": [],
    "totalHoldingTypesAmount": 0,
    "movedInChildrenRows": false,
    "hasNotifies": false,
    "hasCalls": false,
    "childrenTypes": [],
    "description": "",
    "code": "9/2025",
    "identity": "anon-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
  // Nota: Include solo i primi 2 elementi per mantenere il file gestibile.
  // Per includere tutti i 10 elementi, decommenta e aggiungi gli altri dati seguendo lo stesso pattern.
];

/**
 * Dati di esempio semplificati per test rapidi
 */
export const SIMPLE_SAMPLE_DATA = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, active: true },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, active: false },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, active: true }
];