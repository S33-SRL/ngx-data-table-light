import { Component, Input, Output, EventEmitter, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';

import { DtlDataSchema, DtlColumnSchema, DtlButtonSchema } from '../models';
import { TemplaterService } from '../services/templater.service';

/**
 * DataTableLight Component - Angular 20 Zoneless
 * Modernized version with Signals and Standalone architecture
 */
@Component({
  selector: 'dtl-data-table-light',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
    NgSelectComponent
  ],
  templateUrl: './data-table-light.component.html',
  styleUrls: ['./data-table-light.component.scss']
})
export class DataTableLightComponent implements OnInit {

  // Injected services
  private templaterService = inject(TemplaterService);

  // Inputs
  @Input() tabTitle?: string;
  @Input() devMode = false;

  // Data signals - Angular 20 zoneless approach
  private sourceData = signal<any[]>([]);
  protected schemaData = signal<DtlDataSchema | null>(null);

  // Computed properties
  filteredRows = computed(() => {
    const data = this.sourceData();
    const schema = this.schemaData();

    if (!data || !schema) return [];

    // Apply filtering logic here
    return this.processTableData(data, schema);
  });

  totalPages = computed(() => {
    const filtered = this.filteredRows();
    const schema = this.schemaData();

    if (!schema?.maxRows) return 0;
    return Math.ceil(filtered.length / schema.maxRows);
  });

  showedRows = computed(() => {
    const filtered = this.filteredRows();
    const schema = this.schemaData();

    if (!schema?.maxRows) return filtered;

    const page = this.currentPage();
    const start = (page - 1) * schema.maxRows;
    const end = start + schema.maxRows;

    return filtered.slice(start, end);
  });

  // Outputs
  @Output() events = new EventEmitter<any>();

  // State signals
  currentPage = signal(1);
  selectedRows = signal<any[]>([]);

  @Input() set dataSource(data: any[]) {
    const processedData = data ? data.map((x, i) => ({ _mainIndex_: i, ...x })) : [];
    this.sourceData.set(processedData);
  }

  @Input() set tableSchema(schema: DtlDataSchema) {
    this.schemaData.set(schema);
    this.setupTemplaterFunctions();
  }

  ngOnInit(): void {
    // Inizializzazione componente
  }

  private setupTemplaterFunctions(): void {
    // Setup custom functions per TsTemplater
    // TODO: implementare funzioni custom
  }

  private processTableData(data: any[], schema: DtlDataSchema): any[] {
    // TODO: implementare processing completo
    return data;
  }

  private paginateData(data: any[], schema: DtlDataSchema): any[] {
    if (!schema.maxRows) return data;

    const page = this.currentPage();
    const start = (page - 1) * schema.maxRows;
    const end = start + schema.maxRows;

    const totalPages = Math.ceil(data.length / schema.maxRows);

    return data.slice(start, end);
  }

  // Template method implementations
  onFilterChange(event: Event, fieldName: string): void {
    const target = event.target as HTMLInputElement;
    // TODO: implement filtering logic
    this.templaterService.clearCache();
  }

  onSort(fieldName: string): void {
    // TODO: implement sorting logic
  }

  getCellValue(row: any, column: DtlColumnSchema): string {
    if (!column.field) return '';

    let value = row[column.field];

    // Apply template if present
    if (column.template) {
      value = this.templaterService.parseTemplate(column.template, row._source || row);
    }

    return value?.toString() || '';
  }

  getRowClasses(row: any): Record<string, boolean> {
    const schema = this.schemaData();
    return {
      ...schema?.trBodyClass,
      'dtl-selected': row.selected || false
    };
  }

  getColumnAlignment(column: DtlColumnSchema): string {
    switch (column.horizontalAlign) {
      case 'center': return 'center';
      case 'right': return 'flex-end';
      default: return 'flex-start';
    }
  }

  onRowClick(row: any, event: MouseEvent): void {
    this.events.emit({
      callback: 'rowClick',
      row: row._source || row,
      event
    });
  }

  onRowDoubleClick(row: any, event: MouseEvent): void {
    this.events.emit({
      callback: 'rowDoubleClick',
      row: row._source || row,
      event
    });
  }

  onButtonClick(button: DtlButtonSchema, row: any, event: MouseEvent): void {
    event.stopPropagation();
    this.events.emit({
      callback: button.callback || button.name,
      row: row._source || row,
      button
    });
  }

  onExportClick(exportButton: any): void {
    this.events.emit({
      callback: 'export',
      exportType: exportButton.Type,
      exportButton
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  previousPage(): void {
    const current = this.currentPage();
    if (current > 1) {
      this.currentPage.set(current - 1);
    }
  }

  nextPage(): void {
    const current = this.currentPage();
    if (current < this.totalPages()) {
      this.currentPage.set(current + 1);
    }
  }
}
