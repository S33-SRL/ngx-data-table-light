import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDataTableLightComponent, DtlDataSchema, DtlValidatorService } from 'ngx-data-table-light';
import { TABLE_SCHEMA, SAMPLE_DATA } from './constants';
import { TemplatingTestComponent } from './templating-test.component';
import { TableComparisonComponent } from './table-comparison.component';

@Component({
    selector: 'app-root',
    imports: [CommonModule, NgxDataTableLightComponent, TemplatingTestComponent, TableComparisonComponent],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App implements OnInit {

    /**
     * Tab attiva (demo, test o comparison)
     */
    activeTab: 'demo' | 'test' | 'comparison' = 'demo';

    /**
     * Schema della tabella per la visualizzazione degli ordini clienti
     */
    tableSchema = signal<DtlDataSchema>(TABLE_SCHEMA);

    /**
     * Dati di esempio per la dimostrazione della tabella
     */
    sampleData = signal(SAMPLE_DATA);

    constructor(private validator: DtlValidatorService) {}

    ngOnInit() {
        // Esempio: Validazione automatica di schema e dati all'avvio
        this.validateTableData();
    }

    /**
     * Valida schema e dati prima di passarli al componente
     */
    private validateTableData() {
        const result = this.validator.validateAll(this.sampleData(), this.tableSchema());

        console.log('='.repeat(60));
        console.log('VALIDAZIONE DATATABLE');
        console.log('='.repeat(60));
        console.log(this.validator.formatValidationResult(result));
        console.log('='.repeat(60));

        if (!result.valid) {
            console.error('⚠️ ATTENZIONE: Sono stati rilevati errori nella configurazione della tabella');
        } else if (result.warnings.length > 0) {
            console.warn('⚠️ Ci sono alcuni warning da considerare');
        } else {
            console.log('✅ Configurazione corretta!');
        }
    }

    onTableEvent(event: any) {
        console.log('Table event:', event);
    }
}
