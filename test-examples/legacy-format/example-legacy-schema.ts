/**
 * Esempio di schema nel formato LEGACY
 *
 * NOTA: Questo schema usa la struttura del vecchio sistema
 * per permettere confronti con il nuovo DataTableLight
 */

// Import dei tipi legacy (non modificare il codice legacy!)
import type {
    DtlDataSchema,
    DtlColumnSchema,
    DtlButtonSchema
} from '../../legacy-project/src/data-table-light/models/DtlDataSchema';

/**
 * Schema Legacy per tabella ordini
 * Usa la sintassi e struttura del vecchio sistema
 */
export const LEGACY_SCHEMA: DtlDataSchema = {
    // Configurazione base
    devMode: false,

    // Stili tabella (legacy usa molte proprietà di styling)
    contentClass: { 'table-responsive': true },
    tableClass: { 'table': true, 'table-striped': true },

    // Paginazione
    maxRows: 10,
    maxRowsOptions: [5, 10, 25, 50],

    // Selezione
    selectRows: 'single',

    // Colonne con sintassi legacy
    columns: [
        {
            name: 'Codice',
            field: 'code',
            fieldPath: '{code}',
            type: 'string',
            width: 120,
            canOrder: true,
            canFilter: true
        },
        {
            name: 'Cliente',
            field: 'customer',
            // Template con sintassi legacy
            fieldPath: '{customer.name} {customer.surname}',
            type: 'string',
            canOrder: true,
            canFilter: true
        },
        {
            name: 'Data',
            field: 'date',
            fieldPath: '{@Date|{date}|DD/MM/YYYY}',
            type: 'date',
            canOrder: true
        },
        {
            name: 'Importo',
            field: 'amount',
            fieldPath: '{@Currency|{amount}|EUR}',
            type: 'currency',
            horizontalAlign: 'right'
        },
        {
            name: 'Stato',
            field: 'status',
            // Template con condizionale legacy
            template: '<span class="badge" [ngClass]="{' +
                "'badge-success': {@If|{status}|==|completed|true|false}," +
                "'badge-warning': {@If|{status}|==|pending|true|false}," +
                "'badge-danger': {@If|{status}|==|cancelled|true|false}" +
                '}">{status}</span>',
            type: 'string'
        }
    ] as DtlColumnSchema[],

    // Bottoni azione (sintassi legacy)
    buttons: [
        {
            name: 'view',
            iconClass: 'fa fa-eye',
            title: 'Visualizza',
            callback: 'viewOrder',
            width: 40,
            templateDisable: '{@If|{status}|==|cancelled|true|false}'
        },
        {
            name: 'edit',
            iconClass: 'fa fa-edit',
            title: 'Modifica',
            callback: 'editOrder',
            width: 40,
            templateHide: '{@If|{status}|==|completed|true|false}'
        }
    ] as DtlButtonSchema[],

    // Export (legacy)
    exportButtons: [
        {
            title: 'Excel',
            Type: 'Excel',
            iconClass: 'fa fa-file-excel-o',
            allowColumnsSelection: true
        }
    ],

    // Callbacks legacy
    callbackSelectRow: 'onRowSelected',
    callbackDoubleClickRow: 'onDoubleClick',

    // Virtual scroll legacy (usa ngx-ui-scroll)
    virtualScroll: false // Per ora disabilitato per semplicità
};

/**
 * Dati di esempio compatibili con schema legacy
 */
export const LEGACY_DATA = [
    {
        code: 'ORD-001',
        customer: {
            name: 'Mario',
            surname: 'Rossi'
        },
        date: new Date('2024-01-15'),
        amount: 1250.50,
        status: 'completed'
    },
    {
        code: 'ORD-002',
        customer: {
            name: 'Luigi',
            surname: 'Verdi'
        },
        date: new Date('2024-01-16'),
        amount: 890.00,
        status: 'pending'
    },
    {
        code: 'ORD-003',
        customer: {
            name: 'Anna',
            surname: 'Bianchi'
        },
        date: new Date('2024-01-17'),
        amount: 2100.75,
        status: 'cancelled'
    }
];

/**
 * Note per la conversione al nuovo formato
 */
export const MIGRATION_NOTES = {
    templating: {
        old: '{@Date|{date}|DD/MM/YYYY}',
        new: '{@Date|{date}|DD/MM/YYYY}', // Sintassi simile!
        note: 'La sintassi base è molto simile'
    },

    styling: {
        old: 'Molte proprietà di classe separate (contentClass, tableClass, etc)',
        new: 'Sistema più semplificato',
        note: 'Il nuovo sistema ha meno proprietà di styling ma più flessibili'
    },

    buttons: {
        old: 'templateDisable, templateHide con sintassi template',
        new: 'Sistema simile ma ottimizzato',
        note: 'La logica è simile ma più efficiente'
    },

    virtualScroll: {
        old: 'ngx-ui-scroll library',
        new: 'Implementazione custom',
        note: 'Da testare performance comparate'
    }
};