import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableLightComponent, DtlDataSchema } from 'data-table-light';
import { TABLE_SCHEMA, SAMPLE_DATA } from './constants';
import { TemplatingTestComponent } from './templating-test.component';
import { TableComparisonComponent } from './table-comparison.component';

@Component({
    selector: 'app-root',
    imports: [CommonModule, DataTableLightComponent, TemplatingTestComponent, TableComparisonComponent],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {

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

    onTableEvent(event: any) {
        console.log('Table event:', event);
    }
}
