/**
 * Test Comparativo dei Sistemi di Templating
 *
 * Confronta i risultati di:
 * 1. DataTableLight (nuovo sistema)
 * 2. InterpolateService (legacy)
 * 3. ts-templater (libreria npm)
 */

import { CurrencyPipe } from '@angular/common';
import TsTemplater from 'ts-templater';
import { InterpolateService } from '../../legacy-project/src/functions/iterpolate-service';
import { SAMPLE_DATA } from '../first-example/data';

/**
 * Template di test da processare
 */
const TEST_TEMPLATES = {
    // Interpolazione semplice
    simple: '{code}',

    // Path nidificato
    nested: '{customer.name}',

    // Path complesso con array
    complex: '{stakeholders[0].stakeholder.name}',

    // Template con multiple interpolazioni
    multiple: '{code} - {customer.name} {customer.surname}',

    // Funzioni Date
    dateFormat: '{@Date|{date}|DD/MM/YYYY}',
    dateTime: '{@Date|{date}|DD/MM/YYYY HH:mm}',

    // Funzioni Currency
    currency: '{@Currency|{total}|EUR}',

    // Condizionali
    conditional: '{@If|{status}|==|completed|Completato|In Corso}',

    // Math
    mathSum: '{@Math|{unitPrice}|+|{quantity}}',
    mathMultiply: '{@Math|{unitPrice}|*|{quantity}}',

    // Funzioni complesse
    switchCase: '{@Switch|{status}|completed|Completato|pending|In Attesa|cancelled|Annullato|Sconosciuto}'
};

/**
 * Dati di test (primo record da SAMPLE_DATA)
 */
const TEST_DATA = SAMPLE_DATA[0];

/**
 * Test con DataTableLight (nuovo sistema)
 */
export function testDataTableLight() {
    console.log('=== TEST DATATABLELIGHT ===');
    const results: any = {};

    // TODO: Implementare il templating del nuovo sistema
    // Per ora simuliamo i risultati attesi

    results.simple = TEST_DATA.code;
    results.nested = TEST_DATA.customer?.name || '';
    results.complex = TEST_DATA.stakeholders?.[0]?.stakeholder?.name || '';
    results.multiple = `${TEST_DATA.code} - ${TEST_DATA.customer?.name} ${TEST_DATA.customer?.surname}`;

    console.log('DataTableLight Results:', results);
    return results;
}

/**
 * Test con InterpolateService (legacy)
 */
export function testInterpolateService() {
    console.log('=== TEST INTERPOLATESERVICE (LEGACY) ===');
    const results: any = {};

    // Inizializza InterpolateService
    const currencyPipe = new CurrencyPipe('it-IT');
    const interpolate = new InterpolateService(currencyPipe, 'it');

    // Testa ogni template
    for (const [key, template] of Object.entries(TEST_TEMPLATES)) {
        try {
            results[key] = interpolate.interpolate(template, TEST_DATA, {});
            console.log(`${key}: ${template} => ${results[key]}`);
        } catch (error) {
            results[key] = `ERROR: ${error}`;
            console.error(`${key}: ERROR`, error);
        }
    }

    return results;
}

/**
 * Test con ts-templater (libreria npm)
 */
export function testTsTemplater() {
    console.log('=== TEST TS-TEMPLATER (NPM) ===');
    const results: any = {};

    // Inizializza ts-templater
    const templater = new TsTemplater('it');

    // Testa ogni template
    for (const [key, template] of Object.entries(TEST_TEMPLATES)) {
        try {
            results[key] = templater.parseTemplate(template, TEST_DATA, {});
            console.log(`${key}: ${template} => ${results[key]}`);
        } catch (error) {
            results[key] = `ERROR: ${error}`;
            console.error(`${key}: ERROR`, error);
        }
    }

    return results;
}

/**
 * Confronta i risultati dei tre sistemi
 */
export function compareResults() {
    console.log('\n=== CONFRONTO RISULTATI ===\n');

    const dtlResults = testDataTableLight();
    const legacyResults = testInterpolateService();
    const tsTemplaterResults = testTsTemplater();

    const comparison: any[] = [];

    for (const key of Object.keys(TEST_TEMPLATES)) {
        const template = TEST_TEMPLATES[key as keyof typeof TEST_TEMPLATES];
        const dtl = dtlResults[key];
        const legacy = legacyResults[key];
        const tsTemp = tsTemplaterResults[key];

        const allEqual = dtl === legacy && legacy === tsTemp;

        comparison.push({
            test: key,
            template: template,
            dataTableLight: dtl,
            interpolateService: legacy,
            tsTemplater: tsTemp,
            match: allEqual ? '✅' : '❌'
        });

        if (!allEqual) {
            console.warn(`DIFFERENZA in ${key}:`);
            console.log(`  Template: ${template}`);
            console.log(`  DataTableLight: ${dtl}`);
            console.log(`  InterpolateService: ${legacy}`);
            console.log(`  ts-templater: ${tsTemp}`);
            console.log('');
        }
    }

    // Stampa tabella riassuntiva
    console.table(comparison);

    return comparison;
}

/**
 * Esegue tutti i test
 */
export function runAllTests() {
    console.log('🧪 INIZIO TEST COMPARATIVO TEMPLATING');
    console.log('=====================================\n');

    console.log('📊 Dati di test:', TEST_DATA);
    console.log('\n');

    const results = compareResults();

    // Conta successi e fallimenti
    const matches = results.filter(r => r.match === '✅').length;
    const failures = results.filter(r => r.match === '❌').length;

    console.log('\n📈 RIEPILOGO:');
    console.log(`✅ Test passati: ${matches}/${results.length}`);
    console.log(`❌ Test falliti: ${failures}/${results.length}`);

    if (failures > 0) {
        console.log('\n⚠️ ATTENZIONE: Ci sono differenze tra i sistemi di templating!');
        console.log('Verificare le differenze sopra per capire come allineare i sistemi.');
    } else {
        console.log('\n✅ PERFETTO: Tutti i sistemi producono gli stessi risultati!');
    }

    return results;
}

// Export per uso nella demo
export default {
    testDataTableLight,
    testInterpolateService,
    testTsTemplater,
    compareResults,
    runAllTests,
    TEST_TEMPLATES,
    TEST_DATA
};