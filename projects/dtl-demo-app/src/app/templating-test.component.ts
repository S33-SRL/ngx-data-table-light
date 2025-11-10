/**
 * Componente per testare i sistemi di templating
 */

import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { TsTemplater } from 'ts-templater';
import { InterpolateService } from '../../../../legacy-project/src/functions/iterpolate-service';
import { SAMPLE_DATA } from '../../../../test-examples/first-example/data';

@Component({
    selector: 'app-templating-test',
    standalone: true,
    imports: [CommonModule],
    providers: [CurrencyPipe],
    template: `
        <div class="templating-test-container p-4">
            <h2>🧪 Test Comparativo Sistemi di Templating</h2>

            <div class="test-controls mb-4">
                <button class="btn btn-primary me-2" (click)="runTests()">
                    Esegui Test
                </button>
                <button class="btn btn-secondary" (click)="clearResults()">
                    Pulisci Risultati
                </button>
            </div>

            <div *ngIf="testResults.length > 0" class="results-section">
                <h3>📊 Risultati Test</h3>

                <div class="summary mb-3">
                    <span class="badge bg-success me-2">✅ Passati: {{passedTests}}</span>
                    <span class="badge bg-danger">❌ Falliti: {{failedTests}}</span>
                </div>

                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Test</th>
                                <th>Template</th>
                                <th>DataTableLight</th>
                                <th>InterpolateService</th>
                                <th>ts-templater</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let result of testResults"
                                [class.table-success]="result.match && !result.dataTableLight.startsWith('[DTL:')"
                                [class.table-warning]="result.match && result.dataTableLight.startsWith('[DTL:')"
                                [class.table-danger]="!result.match">
                                <td>{{result.test}}</td>
                                <td><code>{{result.template}}</code></td>
                                <td [class.text-muted]="result.dataTableLight.startsWith('[DTL:')">
                                    {{result.dataTableLight}}
                                </td>
                                <td>{{result.interpolateService}}</td>
                                <td>{{result.tsTemplater}}</td>
                                <td>{{result.matchType || (result.match ? '✅' : '❌')}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="mt-3">
                    <small class="text-muted">
                        🟢 Verde = Tutti uguali |
                        🟡 Giallo = Legacy e TS uguali (DTL non implementato) |
                        🔴 Rosso = Differenze reali
                    </small>
                </div>

                <div *ngIf="differences.length > 0" class="differences mt-4">
                    <h4>⚠️ Differenze Trovate</h4>
                    <div class="alert alert-warning" *ngFor="let diff of differences">
                        <strong>{{diff.test}}:</strong> {{diff.template}}<br>
                        <ul>
                            <li>DataTableLight: <code>{{diff.dtl}}</code></li>
                            <li>InterpolateService: <code>{{diff.legacy}}</code></li>
                            <li>ts-templater: <code>{{diff.tsTemp}}</code></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="test-data mt-4">
                <h3>📝 Dati di Test</h3>
                <pre>{{testDataJson}}</pre>
            </div>
        </div>
    `,
    styles: [`
        .templating-test-container {
            max-width: 1400px;
            margin: 0 auto;
        }

        code {
            background-color: #f4f4f4;
            padding: 2px 4px;
            border-radius: 3px;
        }

        pre {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            max-height: 300px;
            overflow-y: auto;
        }

        .table th {
            position: sticky;
            top: 0;
            background-color: white;
            z-index: 10;
        }
    `]
})
export class TemplatingTestComponent implements OnInit {
    testResults: any[] = [];
    differences: any[] = [];
    testDataJson: string = '';

    // Templates da testare
    testTemplates = {
        simple: '{code}',
        nested: '{customer.name}',
        complex: '{stakeholders[0].stakeholder.name}',
        multiple: '{code} - {customer.name} {customer.surname}',
        dateFormat: '{@Date|{date}|DD/MM/YYYY}',
        currency: '{@Currency|{total}|EUR}',
        conditional: '{@If|{status}|==|completed|Completato|In Corso}',
        mathSum: '{@Math|{unitPrice}|+|{quantity}}',
        switchCase: '{@Switch|{status}|completed|Completato|pending|In Attesa|cancelled|Annullato|Sconosciuto}'
    };

    // Dati di test
    testData = SAMPLE_DATA[0];

    constructor(private currencyPipe: CurrencyPipe) {}

    ngOnInit() {
        this.testDataJson = JSON.stringify(this.testData, null, 2);
    }

    get passedTests(): number {
        return this.testResults.filter(r => r.match).length;
    }

    get failedTests(): number {
        return this.testResults.filter(r => !r.match).length;
    }

    runTests() {
        console.log('🚀 Avvio test comparativo templating...');

        this.testResults = [];
        this.differences = [];

        // Test per ogni template
        for (const [key, template] of Object.entries(this.testTemplates)) {
            const dtlResult = this.testDataTableLight(template);
            const legacyResult = this.testInterpolateService(template);
            const tsTemplaterResult = this.testTsTemplater(template);

            // Confronto più intelligente:
            // - Se DTL non è implementato (inizia con [DTL:), confronta solo legacy vs ts-templater
            // - Altrimenti confronta tutti e tre
            const dtlNotImplemented = dtlResult.startsWith('[DTL:');
            const legacyVsTsMatch = legacyResult === tsTemplaterResult;
            const allMatch = dtlResult === legacyResult && legacyResult === tsTemplaterResult;

            // Il match è true se:
            // - DTL non è implementato E legacy e ts-templater sono uguali
            // - OPPURE tutti e tre sono uguali
            const match = dtlNotImplemented ? legacyVsTsMatch : allMatch;

            const result = {
                test: key,
                template: template,
                dataTableLight: dtlResult,
                interpolateService: legacyResult,
                tsTemplater: tsTemplaterResult,
                match: match,
                // Aggiungi info su quale confronto stiamo facendo
                matchType: dtlNotImplemented ?
                    (legacyVsTsMatch ? '✅ Legacy=TS' : '❌ Legacy≠TS') :
                    (allMatch ? '✅ Tutti uguali' : '❌ Differenze')
            };

            this.testResults.push(result);

            // Solo segnala differenze quando legacy e ts-templater non corrispondono
            // (ignora DTL per ora se non è implementato)
            if (!legacyVsTsMatch) {
                this.differences.push({
                    test: key,
                    template: template,
                    dtl: dtlNotImplemented ? '(non implementato)' : dtlResult,
                    legacy: legacyResult,
                    tsTemp: tsTemplaterResult,
                    note: 'InterpolateService e ts-templater danno risultati diversi!'
                });
            } else if (!dtlNotImplemented && !allMatch) {
                // DTL è implementato ma diverso dagli altri
                this.differences.push({
                    test: key,
                    template: template,
                    dtl: dtlResult,
                    legacy: legacyResult,
                    tsTemp: tsTemplaterResult,
                    note: 'DataTableLight dà un risultato diverso!'
                });
            }
        }

        console.log('✅ Test completati');
        console.table(this.testResults);
    }

    testDataTableLight(template: string): string {
        // TODO: Implementare il vero templating di DataTableLight
        // Per ora simuliamo alcuni risultati
        try {
            if (template === '{code}') {
                return this.testData.code;
            }
            if (template === '{customer.name}') {
                return (this.testData as any).customer?.name || '';
            }
            // Altri casi...
            return `[DTL: ${template}]`;
        } catch (error) {
            return `ERROR: ${error}`;
        }
    }

    testInterpolateService(template: string): string {
        try {
            const interpolate = new InterpolateService(this.currencyPipe, 'it');
            // Il metodo si chiama parserStringNasted nel legacy
            return interpolate.parserStringNasted(template, this.testData, {});
        } catch (error) {
            return `ERROR: ${error}`;
        }
    }

    testTsTemplater(template: string): string {
        try {
            const templater = new TsTemplater('it');
            // Il metodo si chiama parse, non parseTemplate
            return templater.parse(template, this.testData, {});
        } catch (error) {
            return `ERROR: ${error}`;
        }
    }

    clearResults() {
        this.testResults = [];
        this.differences = [];
    }
}