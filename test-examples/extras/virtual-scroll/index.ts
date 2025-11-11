/**
 * Virtual Scroll - Test performance con grandi dataset
 */

import { DtlDataSchema } from '../../../projects/ngx-data-table-light/src/lib/models';

export const SCHEMA: DtlDataSchema = {
    virtualScroll: true,
    maxRows: null, // Disabilita paginazione per virtual scroll
    rowOptions: {
        virtualHeight: 600,
        virtualBuffer: 10,
        rowHeight: 48
    },
    columns: [
        {
            name: 'ID',
            field: 'id',
            type: 'number',
            width: 100
        },
        {
            name: 'Nome',
            field: 'name',
            type: 'string'
        },
        {
            name: 'Valore',
            field: 'value',
            type: 'currency'
        },
        {
            name: 'Data',
            field: 'date',
            type: 'date'
        },
        {
            name: 'Stato',
            field: 'status',
            type: 'string'
        }
    ]
};

// Genera dataset grande per test performance
export const DATA = Array.from({ length: 10000 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    value: Math.random() * 1000,
    date: new Date(Date.now() - Math.random() * 10000000000),
    status: ['active', 'pending', 'completed'][Math.floor(Math.random() * 3)]
}));

export const INFO = {
    name: 'Virtual Scroll',
    description: 'Test performance con 10.000 righe e virtual scrolling',
    features: ['Virtual scrolling', 'Performance ottimizzata', 'Grande dataset'],
    dataRows: 10000,
    complexity: 'advanced'
};