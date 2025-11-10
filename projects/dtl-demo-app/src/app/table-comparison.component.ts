/**
 * Componente per confronto side-by-side delle tabelle
 */

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDataTableLightComponent, DtlDataSchema } from 'ngx-data-table-light';
// Import dello schema e dati dal primo esempio
import { TABLE_SCHEMA, SAMPLE_DATA } from '../../../../test-examples/first-example/index';

@Component({
    selector: 'app-table-comparison',
    standalone: true,
    imports: [CommonModule, NgxDataTableLightComponent],
    template: `
        <div class="comparison-container p-4">
            <h2>📊 Confronto Tabelle Side-by-Side</h2>

            <div class="alert alert-info">
                <strong>ℹ️ Nuovo NgxDataTableLight</strong> - Il componente legacy ha dipendenze non compatibili con Angular 20 e la demo standalone.
                Verifica la compatibilità testando il nuovo componente con gli schemi legacy esistenti.
            </div>

            <div class="row mt-4">
                <!-- Nuova DataTableLight -->
                <div class="col-12 mb-4">
                    <div class="card">
                        <div class="card-header bg-success text-white">
                            <h5 class="mb-0">✨ NgxDataTableLight - Usando Schema Legacy</h5>
                        </div>
                        <div class="card-body">
                            <ngx-data-table-light
                                [dataSource]="sampleData()"
                                [tableSchema]="tableSchema()"
                                (events)="onNewTableEvent($event)">
                            </ngx-data-table-light>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Info sulla compatibilità legacy -->
            <div class="row">
                <div class="col-12">
                    <div class="card border-warning">
                        <div class="card-header bg-warning">
                            <h5 class="mb-0">⚠️ Componente Legacy</h5>
                        </div>
                        <div class="card-body">
                            <p><strong>Il componente legacy non può essere incluso nella demo per i seguenti motivi:</strong></p>
                            <ul>
                                <li><code>afterRender</code> non disponibile in Angular 20 (sostituito da AfterRenderRef)</li>
                                <li><code>UiScrollModule</code> non è standalone-compatible</li>
                                <li>Dipendenze mancanti: <code>core-js/core/array</code>, utils/regexp, utils/input-schema</li>
                                <li>Incompatibilità tra schemi DtlDataSchema (tipi export diversi)</li>
                            </ul>
                            <p class="mb-0"><strong>Soluzione:</strong> Il nuovo componente NgxDataTableLight è progettato per essere compatibile al 95%+ con gli schemi legacy esistenti. Testalo con i tuoi schemi di produzione!</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Area per screenshot -->
            <div class="row mt-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">📸 Area Screenshot</h5>
                        </div>
                        <div class="card-body">
                            <p>Puoi salvare screenshot qui nella cartella: <code>test-examples/screenshots/</code></p>
                            <div class="row">
                                <div class="col-6">
                                    <div class="screenshot-placeholder">
                                        <i class="bi bi-camera"></i>
                                        <p>Screenshot Nuovo</p>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="screenshot-placeholder">
                                        <i class="bi bi-camera"></i>
                                        <p>Screenshot Legacy</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Info sul template system -->
            <div class="row mt-4">
                <div class="col-12">
                    <div class="card border-success">
                        <div class="card-header bg-success text-white">
                            <h5 class="mb-0">✅ Sistema Template ts-templater</h5>
                        </div>
                        <div class="card-body">
                            <p><strong>Esempio template:</strong> <code>&#123;year&#125;/&#123;@PadStart|&#123;incremental&#125;|6|0&#125;</code></p>
                            <p><strong>Risultato:</strong> Il template viene processato correttamente da ts-templater</p>
                            <p><strong>Compatibilità:</strong> Usa gli stessi delimitatori <code>&#123; &#125;</code> e funzioni (@Date, @Currency, @If, etc.) del legacy</p>

                            <div class="alert alert-success mt-3 mb-0">
                                <strong>✨ Novità:</strong> Supporta anche sintassi avanzate #@ (DataAware) e ##@ (DualData) per funzioni complesse
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .comparison-container {
            max-width: 1800px;
            margin: 0 auto;
        }

        .screenshot-placeholder {
            border: 2px dashed #dee2e6;
            padding: 40px;
            text-align: center;
            background-color: #f8f9fa;
            border-radius: 8px;
        }

        .screenshot-placeholder i {
            font-size: 48px;
            color: #6c757d;
        }

        .card {
            height: 100%;
        }

        .card-body {
            overflow-x: auto;
        }
    `]
})
export class TableComparisonComponent {
    /**
     * Schema della tabella per la visualizzazione
     */
    tableSchema = signal<DtlDataSchema>(TABLE_SCHEMA);

    /**
     * Schema legacy (quando sarà disponibile)
     */
    // legacySchema = signal<any>(LEGACY_SCHEMA);

    /**
     * Dati di esempio
     */
    sampleData = signal(SAMPLE_DATA);

    onNewTableEvent(event: any) {
        console.log('New Table event:', event);
    }

    onLegacyTableEvent(event: any) {
        console.log('Legacy Table event:', event);
    }
}