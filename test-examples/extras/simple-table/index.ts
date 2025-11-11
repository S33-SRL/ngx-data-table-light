/**
 * Simple Table - Tabella base minimale
 */

import { DtlDataSchema } from '../../../projects/ngx-data-table-light/src/lib/models';

export const SCHEMA: DtlDataSchema = {
    columns: [
        {
            name: 'ID',
            field: 'id',
            type: 'number',
            width: 80
        },
        {
            name: 'Nome',
            field: 'nome',
            type: 'string'
        },
        {
            name: 'Cognome',
            field: 'cognome',
            type: 'string'
        },
        {
            name: 'Email',
            field: 'email',
            type: 'string'
        }
    ],
    maxRows: 10
};

export const DATA = [
    { id: 1, nome: 'Mario', cognome: 'Rossi', email: 'mario.rossi@email.com' },
    { id: 2, nome: 'Luigi', cognome: 'Verdi', email: 'luigi.verdi@email.com' },
    { id: 3, nome: 'Anna', cognome: 'Bianchi', email: 'anna.bianchi@email.com' },
    { id: 4, nome: 'Paolo', cognome: 'Neri', email: 'paolo.neri@email.com' },
    { id: 5, nome: 'Sara', cognome: 'Gialli', email: 'sara.gialli@email.com' }
];

export const INFO = {
    name: 'Simple Table',
    description: 'Tabella base con solo colonne di testo',
    features: ['Rendering base', 'Paginazione semplice'],
    dataRows: 5,
    complexity: 'basic'
};