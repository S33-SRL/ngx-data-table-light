import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import { DtlDataSchema, DtlColumnSchema, DtlButtonSchema, DtlExportButtonSchema } from '../models';
import { TemplaterService } from '../services/templater.service';

type SortDirection = 'asc' | 'desc';

interface SortState {
  column: DtlColumnSchema;
  direction: SortDirection;
}

interface ExportColumnDefinition {
  key: string;
  header: string;
  field?: string;
  fieldPath?: string;
  type?: string;
}

interface ExportPresetState {
  name: string;
  keys: string[];
  format?: DtlExportButtonSchema['Type'];
}

interface ExportDialogState {
  button: DtlExportButtonSchema;
  schema: DtlDataSchema;
  columns: ExportColumnDefinition[];
  selectedKeys: string[];
  availableFormats: Array<DtlExportButtonSchema['Type']>;
  selectedFormat: DtlExportButtonSchema['Type'];
  presets: ExportPresetState[];
}

interface StoredExportState {
  format: DtlExportButtonSchema['Type'];
  keys: string[];
}

const STORAGE_KEY = 'dtl-export-state';

/**
 * NgxDataTableLight Component - Angular 20 Zoneless
 * Modernized version with Signals and Standalone architecture
 */
@Component({
  selector: 'ngx-data-table-light',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbTooltip
  ],
  templateUrl: './data-table-light.component.html',
  styleUrls: ['./data-table-light.component.scss']
})
export class NgxDataTableLightComponent implements OnInit, OnDestroy {

  // Injected services
  private templaterService = inject(TemplaterService);

  // Inputs
  @Input() tabTitle?: string;
  @Input() devMode = false;

  // Data signals - Angular 20 zoneless approach
  private sourceData = signal<any[]>([]);
  protected schemaData = signal<DtlDataSchema | null>(null);
  private filterValues = signal<Record<string, string>>({});
  private currentSort = signal<SortState | null>(null);
  private rowsPerPage = signal<number | null>(null);
  private columnWidths = signal<Record<string, number>>({});

  // Computed properties
  filteredRows = computed(() => {
    const data = this.sourceData();
    const schema = this.schemaData();
    const filters = this.filterValues();
    const sortState = this.currentSort();

    if (!data || !schema) return [];

    return this.processTableData(data, schema, filters, sortState);
  });

  totalPages = computed(() => {
    const filtered = this.filteredRows();
    const rowsPerPage = this.rowsPerPage();

    if (!rowsPerPage) return 0;
    return Math.ceil(filtered.length / rowsPerPage);
  });

  showedRows = computed(() => {
    const filtered = this.filteredRows();
    const rowsPerPage = this.rowsPerPage();

    if (!rowsPerPage) return filtered;

    const page = this.currentPage();
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filtered.slice(start, end);
  });
  gridTemplateColumns = computed(() => this.buildGridTemplateColumns());

  // Outputs
  @Output() events = new EventEmitter<any>();

  // State signals
  currentPage = signal(1);
  selectedRows = signal<any[]>([]);
  private selectedRowIndexes = signal<number[]>([]);
  private virtualScrollOffset = signal(0);
  private virtualStartIndexComputed = computed(() => this.calculateVirtualStartIndex());
  private virtualRowsComputed = computed(() => this.calculateVirtualRows());
  private virtualTransformComputed = computed(() => this.useVirtualScroll()
    ? this.virtualStartIndexComputed() * this.getVirtualRowHeight()
    : 0);
  private virtualSpacerHeightComputed = computed(() => this.useVirtualScroll()
    ? this.filteredRows().length * this.getVirtualRowHeight()
    : 0);
  private resizeStartX = 0;
  private resizeStartWidth = 0;
  private resizingColumn?: DtlColumnSchema;
  private resizeMouseMove = (event: MouseEvent) => this.handleResizeMove(event);
  private resizeMouseUp = () => this.stopResizing();
  exportDialogState = signal<ExportDialogState | null>(null);
  footerCollapsed = signal<boolean>(false);  // FASE 2: Footer collapsible
  expandedRowDetails = signal<Map<number, string>>(new Map());  // FASE 2: Row detail expansion

  @Input() set dataSource(data: any[]) {
    const processedData = data
      ? data.map((x, i) => ({ _mainIndex_: i, _source: x, ...x }))
      : [];
    this.sourceData.set(processedData);
    this.currentPage.set(1);
    this.clearSelection();
  }

  @Input() set tableSchema(schema: DtlDataSchema) {
    this.schemaData.set(schema);
    this.setupTemplaterFunctions(schema);

    const rowsPerPage = schema?.virtualScroll ? null : schema?.maxRows ?? null;
    this.rowsPerPage.set(rowsPerPage);
    this.filterValues.set({ ...(schema?.filters || {}) });
    this.currentPage.set(1);
    this.clearSelection();
  }

  ngOnInit(): void {
    // Inizializzazione componente
  }

  ngOnDestroy(): void {
    this.stopResizing();
  }

  private setupTemplaterFunctions(schema?: DtlDataSchema | null): void {
    if (!schema?.functions) {
      this.templaterService.setCustomFunctions({});
      return;
    }
    this.templaterService.setCustomFunctions(schema.functions);
  }

  private processTableData(
    data: any[],
    schema: DtlDataSchema,
    filters: Record<string, string>,
    sortState: SortState | null
  ): any[] {
    let processed = [...data];
    processed = this.applyFilters(processed, schema, filters);
    processed = this.applySorting(processed, sortState);
    processed = this.applyRowOptions(processed, schema);
    return processed;
  }

  private applyFilters(data: any[], schema: DtlDataSchema, filters: Record<string, string>): any[] {
    if (!schema.columns?.length) return data;

    return data.filter(row => {
      return schema.columns!.every(column => {
        if (!column.canFilter || !column.field) return true;
        const filterValue = (filters[column.field] ?? '').trim();
        if (!filterValue) return true;
        const compareValue = this.getComparableValue(row, column);
        if (compareValue === undefined || compareValue === null) return false;
        return compareValue.toString().toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }

  private applySorting(data: any[], sortState: SortState | null): any[] {
    if (!sortState) return data;

    const sorted = [...data];
    sorted.sort((a, b) => {
      const valueA = this.getComparableValue(a, sortState.column);
      const valueB = this.getComparableValue(b, sortState.column);

      if (valueA === valueB) return 0;
      if (valueA === undefined || valueA === null) return sortState.direction === 'asc' ? -1 : 1;
      if (valueB === undefined || valueB === null) return sortState.direction === 'asc' ? 1 : -1;

      if (valueA > valueB) return sortState.direction === 'asc' ? 1 : -1;
      if (valueA < valueB) return sortState.direction === 'asc' ? -1 : 1;
      return 0;
    });

    return sorted;
  }

  /**
   * Applica rowOptions alle righe (visible, disable, class, style)
   * COMPATIBILITÀ LEGACY: Supporto completo per DtlRowOptions
   */
  private applyRowOptions(data: any[], schema: DtlDataSchema): any[] {
    if (!schema.rowOptions) return data;

    const rowOptions = schema.rowOptions;

    return data.map(row => {
      const enhancedRow = { ...row };

      // Visible - Visibilità condizionale della riga
      if (rowOptions.visible) {
        const visibleResult = this.resolveBooleanFlag(rowOptions.visible, row);
        enhancedRow._visible = visibleResult !== false; // Default true se null
      } else {
        enhancedRow._visible = true;
      }

      // Disable - Disabilitazione condizionale della riga
      if (rowOptions.disable) {
        const disableResult = this.resolveBooleanFlag(rowOptions.disable, row);
        enhancedRow._disabled = disableResult === true; // Default false se null
      } else {
        enhancedRow._disabled = false;
      }

      // Class - Classe CSS condizionale
      if (rowOptions.class) {
        try {
          enhancedRow._class = this.getTemplateValue(rowOptions.class, row, schema);
        } catch (error) {
          if (this.devMode) {
            console.warn('[NgxDataTableLight] rowOptions.class error:', error);
          }
          enhancedRow._class = '';
        }
      } else {
        enhancedRow._class = '';
      }

      // Style - Stile inline condizionale
      if (rowOptions.style) {
        try {
          enhancedRow._style = this.getTemplateValue(rowOptions.style, row, schema);
        } catch (error) {
          if (this.devMode) {
            console.warn('[NgxDataTableLight] rowOptions.style error:', error);
          }
          enhancedRow._style = '';
        }
      } else {
        enhancedRow._style = '';
      }

      if (this.devMode && (rowOptions.visible || rowOptions.disable || rowOptions.class || rowOptions.style)) {
        console.log('[NgxDataTableLight] applyRowOptions:', {
          row: enhancedRow,
          _visible: enhancedRow._visible,
          _disabled: enhancedRow._disabled,
          _class: enhancedRow._class,
          _style: enhancedRow._style
        });
      }

      return enhancedRow;
    });
  }

  private buildGridTemplateColumns(): string {
    const schema = this.schemaData();
    if (!schema) return '';

    const templateParts: string[] = [];
    if (schema.selectRows === 'multicheck') {
      templateParts.push(`${this.getSelectionColumnWidth()}px`);
    }

    (schema.columns || [])
      .filter(column => !column.hide)
      .forEach(column => templateParts.push(this.getColumnTemplateSize(column)));

    if ((schema.buttons?.length || 0) > 0) {
      templateParts.push(`${this.getRowButtonsWidth()}px`);
    }

    if (templateParts.length === 0) {
      templateParts.push('1fr');
    }

    return templateParts.join(' ');
  }

  private getColumnTemplateSize(column: DtlColumnSchema): string {
    if (!column) {
      return 'minmax(120px, 1fr)';
    }

    const storedWidth = column.field ? this.columnWidths()[column.field] : null;
    if (storedWidth) {
      return `${storedWidth}px`;
    }

    const width = column.width;
    if (typeof width === 'number') {
      return `${width}px`;
    }

    if (typeof width === 'string' && width.trim().length > 0) {
      return width;
    }

    if (width && typeof width === 'object') {
      const min = this.normalizeSize(width.min, '80px');
      const max = this.normalizeSize(width.max, '1fr');
      return `minmax(${min}, ${max})`;
    }

    return 'minmax(120px, 1fr)';
  }

  private normalizeSize(value: number | string | undefined, fallback: string): string {
    if (typeof value === 'number') {
      return `${value}px`;
    }
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
    return fallback;
  }

  private parseSizeValue(value: number | string | undefined): number | null {
    if (typeof value === 'number' && !Number.isNaN(value)) {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = Number.parseFloat(value);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
    return null;
  }

  onResizeMouseDown(event: MouseEvent, column: DtlColumnSchema): void {
    if (!column.field) return;

    event.preventDefault();
    event.stopPropagation();
    this.resizingColumn = column;

    const headerCell = (event.target as HTMLElement)?.parentElement as HTMLElement | null;
    const fallbackWidth = headerCell?.offsetWidth ?? 150;
    this.resizeStartWidth = this.getCurrentColumnWidth(column, fallbackWidth);
    this.resizeStartX = event.pageX;

    window.addEventListener('mousemove', this.resizeMouseMove);
    window.addEventListener('mouseup', this.resizeMouseUp);
  }

  private handleResizeMove(event: MouseEvent): void {
    if (!this.resizingColumn || !this.resizingColumn.field) return;

    const delta = event.pageX - this.resizeStartX;
    let newWidth = this.resizeStartWidth + delta;
    const { minWidth, maxWidth } = this.getResizeLimits(this.resizingColumn);

    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

    const updated = { ...this.columnWidths() };
    updated[this.resizingColumn.field] = newWidth;
    this.columnWidths.set(updated);
  }

  private stopResizing(): void {
    window.removeEventListener('mousemove', this.resizeMouseMove);
    window.removeEventListener('mouseup', this.resizeMouseUp);
    this.resizingColumn = undefined;
  }

  private getCurrentColumnWidth(column: DtlColumnSchema, fallback: number): number {
    if (column.field) {
      const stored = this.columnWidths()[column.field];
      if (stored) return stored;
    }

    if (typeof column.width === 'number') {
      return column.width;
    }

    if (typeof column.width === 'string') {
      const parsed = Number.parseInt(column.width, 10);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }

    if (column.width && typeof column.width === 'object' && column.width.min) {
      const min = this.parseSizeValue(column.width.min);
      if (min) {
        return min;
      }
    }

    return fallback;
  }

  private getResizeLimits(column: DtlColumnSchema): { minWidth: number; maxWidth: number } {
    const defaultMin = 60;
    const defaultMax = 800;

    if (!column.width || typeof column.width !== 'object') {
      return { minWidth: defaultMin, maxWidth: defaultMax };
    }

    const minParsed = this.parseSizeValue(column.width.min);
    const maxParsed = this.parseSizeValue(column.width.max);
    const minWidth = minParsed ?? defaultMin;
    const maxWidth = maxParsed ?? defaultMax;

    return { minWidth, maxWidth };
  }

  private getSelectionColumnWidth(): number {
    return 48;
  }

  private getRowButtonsWidth(): number {
    return 120;
  }

  useVirtualScroll(): boolean {
    return !!this.schemaData()?.virtualScroll;
  }

  virtualRows(): any[] {
    return this.virtualRowsComputed();
  }

  virtualTransform(): number {
    return this.virtualTransformComputed();
  }

  virtualSpacerHeight(): number {
    return this.virtualSpacerHeightComputed();
  }

  virtualStartIndex(): number {
    return this.virtualStartIndexComputed();
  }

  onVirtualScroll(event: Event): void {
    const target = event.target as HTMLElement;
    this.virtualScrollOffset.set(target?.scrollTop || 0);
  }

  getVirtualViewportHeight(): number {
    return this.schemaData()?.rowOptions?.virtualHeight ?? 420;
  }

  getVirtualViewportCount(): number {
    if (!this.schemaData()?.virtualScroll) {
      return 0;
    }
    const visibleCount = Math.ceil(this.getVirtualViewportHeight() / this.getVirtualRowHeight());
    const buffer = this.schemaData()?.rowOptions?.virtualBuffer ?? 5;
    return visibleCount + buffer;
  }

  private getVirtualRowHeight(): number {
    return this.schemaData()?.rowOptions?.rowHeight ?? 48;
  }

  private openExportDialog(button: DtlExportButtonSchema, schema: DtlDataSchema): void {
    const columns = this.getExportColumns(schema);
    const availableFormats = this.getAvailableFormats(schema, button);
    const presets = this.getExportPresets(schema, columns);
    const storageKey = this.getStorageKey(button, schema);
    const storedState = this.readStoredExportState(storageKey);
    const defaultKeys = storedState?.keys?.length ? storedState.keys : columns.map(column => column.key);
    const defaultFormat = storedState?.format || button.Type;

    this.exportDialogState.set({
      button,
      schema,
      columns,
      selectedKeys: defaultKeys,
      availableFormats,
      selectedFormat: defaultFormat,
      presets
    });
  }

  closeExportDialog(): void {
    this.exportDialogState.set(null);
  }

  toggleExportColumn(key: string): void {
    const state = this.exportDialogState();
    if (!state) return;

    const selectedKeys = state.selectedKeys.includes(key)
      ? state.selectedKeys.filter(existing => existing !== key)
      : [...state.selectedKeys, key];

    if (selectedKeys.length === 0) {
      return;
    }

    this.exportDialogState.set({
      ...state,
      selectedKeys
    });
  }

  selectAllExportColumns(selectAll: boolean): void {
    const state = this.exportDialogState();
    if (!state) return;

    this.exportDialogState.set({
      ...state,
      selectedKeys: selectAll ? state.columns.map(column => column.key) : []
    });
  }

  isExportColumnSelected(key: string): boolean {
    const state = this.exportDialogState();
    if (!state) return false;
    return state.selectedKeys.includes(key);
  }

  applyPreset(preset: ExportPresetState): void {
    const state = this.exportDialogState();
    if (!state) return;

    this.exportDialogState.set({
      ...state,
      selectedKeys: preset.keys,
      selectedFormat: preset.format || state.selectedFormat
    });
  }

  changeExportFormat(format: DtlExportButtonSchema['Type']): void {
    const state = this.exportDialogState();
    if (!state) return;

    this.exportDialogState.set({
      ...state,
      selectedFormat: format
    });
  }

  resetSavedExport(): void {
    const state = this.exportDialogState();
    if (!state) return;

    const storageKey = this.getStorageKey(state.button, state.schema);
    this.clearStoredExportState(storageKey);

    this.exportDialogState.set({
      ...state,
      selectedFormat: state.button.Type,
      selectedKeys: state.columns.map(column => column.key)
    });
  }

  async confirmExportColumns(): Promise<void> {
    const state = this.exportDialogState();
    if (!state) return;

    const storageKey = this.getStorageKey(state.button, state.schema);
    this.saveExportState(storageKey, {
      format: state.selectedFormat,
      keys: state.selectedKeys
    });

    await this.executeExport(state.button, state.schema, state.selectedKeys, state.selectedFormat);
    this.closeExportDialog();
  }

  private async executeExport(
    button: DtlExportButtonSchema,
    schema: DtlDataSchema,
    selectedKeys?: string[],
    forcedFormat?: DtlExportButtonSchema['Type']
  ): Promise<void> {
    const rows = this.filteredRows().map(row => this.getRowSource(row));
    const columns = this.getExportColumns(schema, selectedKeys);
    const format = forcedFormat || button.Type;

    try {
      if (format === 'Excel') {
        await this.exportToExcel(rows, schema, columns);
      } else if (format === 'CSV') {
        this.exportToCsv(rows, schema, columns);
      } else if (format === 'PDF') {
        this.exportToPdf(rows, schema, columns);
      }
    } catch (error) {
      console.error('Export error', error);
    }

    this.emitEvent('export', {
      exportType: format,
      exportButton: button
    });
  }

  private getExportColumns(schema: DtlDataSchema, selectedKeys?: string[]): ExportColumnDefinition[] {
    const exportColumns = schema.exportSchema?.exportColumns?.filter(col => col.visible !== false);
    if (exportColumns && exportColumns.length > 0) {
      const mapped = exportColumns.map((column, index) => ({
        key: column.field || column.fieldPath || `col_${index}`,
        header: column.name,
        field: column.field,
        fieldPath: column.fieldPath,
        type: column.type
      }));
      return this.filterSelectedColumns(mapped, selectedKeys);
    }

    const mappedColumns = (schema.columns || [])
      .filter(column => !column.hide)
      .map((column, index) => ({
        key: column.field || column.fieldPath || `col_${index}`,
        header: column.name || column.field || `Column ${index + 1}`,
        field: column.field,
        fieldPath: column.fieldPath,
        type: column.type
      }));

    return this.filterSelectedColumns(mappedColumns, selectedKeys);
  }

  private filterSelectedColumns(columns: ExportColumnDefinition[], selectedKeys?: string[]): ExportColumnDefinition[] {
    if (!selectedKeys?.length) {
      return columns;
    }

    const keyOrder = new Map(selectedKeys.map((key, index) => [key, index]));
    return columns
      .filter(column => keyOrder.has(column.key))
      .sort((a, b) => (keyOrder.get(a.key)! - keyOrder.get(b.key)!));
  }

  private getAvailableFormats(schema: DtlDataSchema, currentButton: DtlExportButtonSchema): Array<DtlExportButtonSchema['Type']> {
    const buttons = schema.exportButtons || [];
    const formats = buttons
      .map(button => button.Type)
      .filter((type): type is DtlExportButtonSchema['Type'] => !!type);

    if (formats.length === 0) {
      return [currentButton.Type];
    }

    return Array.from(new Set(formats));
  }

  private getExportPresets(schema: DtlDataSchema, columns: ExportColumnDefinition[]): ExportPresetState[] {
    const presets = schema.exportSchema?.presets;
    const columnKeys = new Set(columns.map(column => column.key));

    const mappedPresets = (presets || [])
      .map(preset => ({
        name: preset.name,
        keys: preset.keys.filter(key => columnKeys.has(key)),
        format: preset.format
      }))
      .filter(preset => preset.keys.length > 0);

    if (mappedPresets.length > 0) {
      return mappedPresets;
    }

    return [{
      name: 'Colonne visibili',
      keys: columns.map(column => column.key),
      format: undefined
    }];
  }

  private getStorageKey(button: DtlExportButtonSchema, schema: DtlDataSchema): string {
    const schemaId = schema.exportSchema?.filename || 'default';
    return `${STORAGE_KEY}:${button.name || button.Type}:${schemaId}`;
  }

  private readStoredExportState(key: string): StoredExportState | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as StoredExportState;
    } catch {
      return null;
    }
  }

  private saveExportState(key: string, state: StoredExportState): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }

  private clearStoredExportState(key: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.removeItem(key);
    } catch {
      // ignore storage errors
    }
  }

  private resolveExportValue(row: any, column: ExportColumnDefinition, schema: DtlDataSchema): string {
    let rawValue: any;
    if (column.fieldPath) {
      rawValue = this.templaterService.parseTemplate(column.fieldPath, row, schema.otherData, '{', '}');
    } else if (column.field) {
      rawValue = row[column.field];
    } else {
      rawValue = '';
    }

    return this.formatValue(rawValue, column.type as DtlColumnSchema['type']);
  }

  private exportToCsv(rows: any[], schema: DtlDataSchema, columns: ExportColumnDefinition[]): void {
    const separator = ';';
    const headers = columns.map(column => `"${column.header}"`).join(separator);
    const csvRows = rows.map(row => {
      const values = columns.map(column => {
        const value = this.resolveExportValue(row, column, schema).replace(/"/g, '""');
        return `"${value}"`;
      });
      return values.join(separator);
    });
    const csvContent = [headers, ...csvRows].join('\n');
    const filename = `${schema.exportSchema?.filename || 'export'}.csv`;
    this.downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
  }

  private async exportToExcel(rows: any[], schema: DtlDataSchema, columns: ExportColumnDefinition[]): Promise<void> {
    const data = rows.map(row => {
      const record: Record<string, any> = {};
      columns.forEach(column => {
        record[column.key] = this.resolveExportValue(row, column, schema);
      });
      return record;
    });

    const settings = {
      fileName: schema.exportSchema?.filename || 'export',
      workSheets: [
        {
          sheetName: schema.exportSchema?.sheetname || 'Sheet1',
          tableSettings: {
            table: {
              tableTitle: this.tabTitle || 'DataTableLight Export',
              headerDefinition: columns.map(column => ({
                name: column.header,
                key: column.key
              }))
            }
          }
        }
      ]
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - export-xlsx does not provide type definitions
    const { default: ExcelExport } = await import('export-xlsx');
    const exporter = new ExcelExport();
    await exporter.downloadExcel(settings, { table: data });
  }

  private exportToPdf(rows: any[], schema: DtlDataSchema, columns: ExportColumnDefinition[]): void {
    const title = this.tabTitle || schema.exportSchema?.filename || 'DataTableLight Export';
    const headerLine = columns.map(column => column.header).join(' | ');
    const valueLines = rows.map(row =>
      columns.map(column => this.resolveExportValue(row, column, schema)).join(' | ')
    );
    const lines = [title, '', headerLine, ...valueLines];
    const pdfContent = this.generatePdfDocument(lines);
    const filename = `${schema.exportSchema?.filename || 'export'}.pdf`;
    this.downloadBlob(pdfContent, filename, 'application/pdf');
  }

  private downloadBlob(content: BlobPart, filename: string, type: string): void {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private generatePdfDocument(lines: string[]): string {
    const linesPerPage = 40;
    const chunked: string[][] = [];
    for (let i = 0; i < lines.length; i += linesPerPage) {
      chunked.push(lines.slice(i, i + linesPerPage));
    }
    if (chunked.length === 0) {
      chunked.push(['']);
    }

    const objects: string[] = [];
    objects.push('<< /Type /Catalog /Pages 2 0 R >>'); // 1
    objects.push(''); // placeholder for pages (2)
    const fontObjNumber = objects.length + 1;
    objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'); // font object

    const pageObjectNumbers: number[] = [];
    const textEncoder = new TextEncoder();

    chunked.forEach(pageLines => {
      const streamLines = [
        'BT',
        '/F1 12 Tf',
        ...pageLines.map((line, index) => {
          const y = 800 - index * 16;
          return `1 0 0 1 50 ${y} Tm\n(${this.escapePdfText(line)}) Tj`;
        }),
        'ET'
      ];
      const streamContent = streamLines.join('\n');
      const streamLength = textEncoder.encode(streamContent).length;
      const contentObjNumber = objects.length + 1;
      objects.push(`<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream`);
      const pageObjNumber = objects.length + 1;
      pageObjectNumbers.push(pageObjNumber);
      objects.push(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontObjNumber} 0 R >> >> /Contents ${contentObjNumber} 0 R >>`
      );
    });

    objects[1] = `<< /Type /Pages /Kids [${pageObjectNumbers.map(num => `${num} 0 R`).join(' ')}] /Count ${pageObjectNumbers.length} >>`;

    return this.composePdf(objects);
  }

  private composePdf(objects: string[]): string {
    const encoder = new TextEncoder();
    const chunks: string[] = [];
    let byteLength = 0;
    const pushChunk = (chunk: string) => {
      chunks.push(chunk);
      byteLength += encoder.encode(chunk).length;
    };

    pushChunk('%PDF-1.3\n');
    const offsets: number[] = [0];

    objects.forEach((object, index) => {
      offsets.push(byteLength);
      pushChunk(`${index + 1} 0 obj\n${object}\nendobj\n`);
    });

    const xrefStart = byteLength;
    let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i < offsets.length; i++) {
      xref += `${offsets[i].toString().padStart(10, '0')} 00000 n \n`;
    }
    pushChunk(xref);

    const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
    pushChunk(trailer);

    return chunks.join('');
  }

  private escapePdfText(value: string): string {
    return (value || '')
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
  }

  private calculateVirtualStartIndex(): number {
    const schema = this.schemaData();
    if (!schema?.virtualScroll) return 0;
    const rowHeight = this.getVirtualRowHeight();
    if (rowHeight <= 0) return 0;
    return Math.floor(this.virtualScrollOffset() / rowHeight);
  }

  private calculateVirtualRows(): any[] {
    const schema = this.schemaData();
    if (!schema?.virtualScroll) return [];

    const rows = this.filteredRows();
    const startIndex = this.virtualStartIndexComputed();
    const viewportCount = this.getVirtualViewportCount();
    return rows.slice(startIndex, Math.min(rows.length, startIndex + viewportCount));
  }

  // Template method implementations
  onFilterChange(event: Event, fieldName: string | undefined): void {
    const target = event.target as HTMLInputElement;
    if (!fieldName) return;

    const updatedFilters = { ...this.filterValues() };
    updatedFilters[fieldName] = target.value;

    this.filterValues.set(updatedFilters);
    this.currentPage.set(1);
  }

  onSort(column: DtlColumnSchema): void {
    const fieldName = column.sortField || column.field;
    if (!fieldName) return;

    const current = this.currentSort();
    let direction: SortDirection = 'asc';

    if (current && current.column === column) {
      direction = current.direction === 'asc' ? 'desc' : 'asc';
    }

    this.clearRowDetail();  // FASE 2: Clear expanded details on sort
    this.currentSort.set({ column, direction });
  }

  getCellValue(row: any, column: DtlColumnSchema): string {
    const schema = this.schemaData();
    if (!schema) return '';

    if (column.template) {
      return this.getTemplateValue(column.template, row, schema);
    }

    const value = this.getComparableValue(row, column);
    return this.formatValue(value, column.type);
  }

  getTooltipValue(row: any, column: DtlColumnSchema): string | null {
    const schema = this.schemaData();
    if (!schema || !column.tooltip) return null;

    return this.templaterService.parseTemplate(column.tooltip, this.getRowSource(row), schema.otherData, '{', '}');
  }

  getFilterValue(fieldName: string | undefined): string {
    if (!fieldName) {
      return '';
    }
    return this.filterValues()[fieldName] ?? '';
  }

  getRowsPerPageValue(): number | null {
    return this.rowsPerPage();
  }

  getRowClasses(row: any): Record<string, boolean> {
    const schema = this.schemaData();
    return {
      ...schema?.trBodyClass,
      'dtl-selected': this.isRowSelected(row)
    };
  }

  getColumnAlignment(column: DtlColumnSchema): string {
    switch (column.horizontalAlign) {
      case 'center': return 'center';
      case 'right': return 'flex-end';
      default: return 'flex-start';
    }
  }

  getFooterAlignment(alignment?: string): string {
    switch (alignment) {
      case 'center': return 'center';
      case 'right': return 'flex-end';
      default: return 'flex-start';
    }
  }

  onRowClick(row: any, event: MouseEvent): void {
    const schema = this.schemaData();
    if (schema?.selectRows && schema.selectRows !== 'none' && schema.selectRows !== 'multicheck') {
      this.toggleRowSelection(row, schema.selectRows === 'single');
    }

    this.emitEvent('rowClick', {
      row: this.getRowSource(row),
      event
    });
  }

  onRowDoubleClick(row: any, event: MouseEvent): void {
    const schema = this.schemaData();
    const callback = schema?.callbackDoubleClickRow || 'dglDoubleClickRow';

    this.emitEvent(callback, {
      row: this.getRowSource(row),
      event
    });
  }

  onButtonClick(button: DtlButtonSchema, row: any, event: MouseEvent): void {
    event.stopPropagation();
    if (this.isButtonHidden(button, row)) {
      return;
    }

    const callbackName = button.callback || button.name;
    const schema = this.schemaData();

    // FASE 2: Row detail expansion - Compatibilità legacy
    const detailCallback = schema?.callbackRowsDetail || 'dglRowdetail';
    if (callbackName === detailCallback && schema?.rowDetailTemplate) {
      this.displayRowDetail(row);
    }

    this.emitEvent(callbackName, {
      row: this.getRowSource(row),
      button
    });
  }

  async onExportClick(exportButton: DtlExportButtonSchema): Promise<void> {
    const schema = this.schemaData();
    if (!schema) return;

    if (exportButton.allowColumnsSelection) {
      this.openExportDialog(exportButton, schema);
      return;
    }

    await this.executeExport(exportButton, schema);
  }

  goToPage(page: number): void {
    const totalPages = this.totalPages();
    const schema = this.schemaData();

    if (page < 1 || page > totalPages) return;

    this.clearRowDetail();  // FASE 2: Clear expanded details on page change
    this.currentPage.set(page);

    const callback = schema?.callbackSelectedPageChange || 'dglSelectedPageChange';
    this.emitEvent(callback, { page });
  }

  previousPage(): void {
    const current = this.currentPage();
    if (current > 1) {
      this.goToPage(current - 1);
    }
  }

  nextPage(): void {
    const current = this.currentPage();
    if (current < this.totalPages()) {
      this.goToPage(current + 1);
    }
  }

  onRowsPerPageChange(value: string): void {
    const schema = this.schemaData();
    const rows = Number(value) || null;
    this.rowsPerPage.set(rows);
    this.currentPage.set(1);

    const changeCallback = schema?.callbackChangedRowsCount || 'dglChangedRowsCount';
    const optionCallback = schema?.callbackRowsOptionChange || 'dglRowsOptionChange';

    this.emitEvent(changeCallback, { rows });
    this.emitEvent(optionCallback, { rows });
  }

  isRowSelected(row: any): boolean {
    return this.selectedRowIndexes().includes(row._mainIndex_);
  }

  isAllCurrentPageSelected(): boolean {
    const currentIndexes = this.showedRows().map(row => row._mainIndex_);
    if (!currentIndexes.length) return false;
    return currentIndexes.every(index => this.selectedRowIndexes().includes(index));
  }

  hasPartialSelection(): boolean {
    const currentIndexes = this.showedRows().map(row => row._mainIndex_);
    if (!currentIndexes.length) return false;
    const selected = this.selectedRowIndexes().filter(index => currentIndexes.includes(index));
    return selected.length > 0 && selected.length < currentIndexes.length;
  }

  onRowCheckboxChange(row: any, checked: boolean): void {
    const schema = this.schemaData();
    if (!schema || schema.selectRows !== 'multicheck') return;

    this.toggleRowSelection(row, false, checked);
  }

  toggleSelectAll(checked: boolean): void {
    const schema = this.schemaData();
    if (!schema || schema.selectRows !== 'multicheck') return;

    if (!checked) {
      this.clearSelection();
      return;
    }

    const indexes = this.showedRows().map(row => row._mainIndex_);
    this.selectedRowIndexes.set(indexes);
    this.selectedRows.set(this.showedRows().map(row => this.getRowSource(row)));
    this.emitSelectionEvents();
  }

  isButtonDisabled(button: DtlButtonSchema, row: any): boolean {
    if (button.templateDisable) {
      const result = this.resolveBooleanFlag(button.templateDisable, row);
      if (result !== null) {
        return result;
      }
    }

    return !!button.disable;
  }

  isButtonHidden(button: DtlButtonSchema, row: any): boolean {
    if (button.templateHide) {
      const result = this.resolveBooleanFlag(button.templateHide, row);
      if (result !== null) {
        return result;
      }
    }

    return button.visible === false;
  }

  getButtonStyle(button: DtlButtonSchema): Record<string, string | number> | undefined {
    if (button.color) {
      return {
        ...button.style,
        color: button.color
      };
    }

    return button.style;
  }

  /**
   * Merge delle classi CSS per i bottoni
   * - Se il bottone ha classi specifiche, quelle sovrascrivono le default
   * - Altrimenti usa le classi di default dello schema
   * @param button Schema del bottone
   * @returns Oggetto {[class: string]: boolean} per ngClass
   */
  getButtonClasses(button: DtlButtonSchema): Record<string, boolean> {
    const schema = this.schemaData();
    let classes: string[] | Record<string, boolean>;

    // Se il bottone ha classi specifiche, usa quelle (override completo)
    if (button.class) {
      classes = button.class;
    }
    // Altrimenti usa le classi di default dello schema
    else if (schema?.buttonDefaultClasses && schema.buttonDefaultClasses.length > 0) {
      classes = schema.buttonDefaultClasses;
    }
    // Fallback: classi base
    else {
      classes = ['dtl-btn', 'dtl-btn-sm', 'dtl-btn-primary'];
    }

    // Converti array in oggetto {class: true} per ngClass
    if (Array.isArray(classes)) {
      const result: Record<string, boolean> = {};
      classes.forEach(cls => {
        if (cls && typeof cls === 'string') {
          result[cls] = true;
        }
      });
      return result;
    }

    return classes;
  }

  getFooterTemplateValue(template: string): string {
    const schema = this.schemaData();
    const context = {
      rows: this.filteredRows(),
      showedRows: this.showedRows(),
      selectedRows: this.selectedRows(),
      otherData: schema?.otherData
    };

    return this.templaterService.parseTemplate(template, context, schema?.otherData, '{', '}');
  }

  private toggleRowSelection(row: any, singleSelection: boolean, forceValue?: boolean): void {
    const index = row._mainIndex_;
    let indexes = [...this.selectedRowIndexes()];

    const exists = indexes.includes(index);
    let shouldSelect = !exists;
    if (forceValue !== undefined) {
      shouldSelect = forceValue;
    }

    if (singleSelection) {
      indexes = shouldSelect ? [index] : [];
    } else {
      if (shouldSelect && !exists) {
        indexes.push(index);
      }
      if (!shouldSelect && exists) {
        indexes = indexes.filter(i => i !== index);
      }
    }

    this.selectedRowIndexes.set(indexes);
    const selectedRows = this.sourceData()
      .filter(item => indexes.includes(item._mainIndex_))
      .map(item => this.getRowSource(item));
    this.selectedRows.set(selectedRows);

    this.emitSelectionEvents();
  }

  private emitSelectionEvents(): void {
    const schema = this.schemaData();
    if (!schema) return;

    const selected = this.selectedRows();

    if (selected.length === 1) {
      const callback = schema.callbackSelectRow || 'dglRowSelected';
      this.emitEvent(callback, { row: selected[0] });
    }

    if (selected.length > 0) {
      const callback = schema.callbackSelectRows || 'dglRowsSelected';
      this.emitEvent(callback, { rows: selected });
    }
  }

  private getComparableValue(row: any, column: DtlColumnSchema): any {
    const schema = this.schemaData();
    const source = this.getRowSource(row);

    if (column.sortFieldPath) {
      return this.templaterService.parseTemplate(column.sortFieldPath, source, schema?.otherData, '{', '}');
    }

    if (column.sortField) {
      return source[column.sortField];
    }

    if (column.fieldPath) {
      return this.templaterService.parseTemplate(column.fieldPath, source, schema?.otherData, '{', '}');
    }

    if (column.field) {
      return source[column.field];
    }

    return undefined;
  }

  private getRowSource(row: any): any {
    return row?._source ?? row;
  }

  private getTemplateValue(template: string, row: any, schema: DtlDataSchema): string {
    // FIX CRITICO: Usare delimitatori legacy { } invece di {{ }}
    return this.templaterService.parseTemplate(template, this.getRowSource(row), schema?.otherData, '{', '}');
  }

  private formatValue(value: any, type: DtlColumnSchema['type']): string {
    if (value === undefined || value === null) return '';

    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(Number(value));
      case 'decimal':
        return new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value));
      case 'number':
        return new Intl.NumberFormat('it-IT').format(Number(value));
      case 'date':
        return this.formatDate(value, { dateStyle: 'short' });
      case 'dateTime':
        return this.formatDate(value, { dateStyle: 'short', timeStyle: 'short' });
      case 'time':
        return this.formatDate(value, { timeStyle: 'short' });
      case 'check':
        return value ? '✓' : '✕';
      default:
        return value.toString();
    }
  }

  getCheckboxValue(row: any, column: DtlColumnSchema): boolean {
    const value = this.getComparableValue(row, column);
    return !!value;
  }

  private formatDate(value: any, options: Intl.DateTimeFormatOptions): string {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('it-IT', options).format(date);
  }

  private emitEvent(callback: string, payload: Record<string, any>): void {
    this.events.emit({
      callback,
      ...payload
    });
  }

  private resolveBooleanFlag(expression: string, row: any): boolean | null {
    const schema = this.schemaData();
    const context = this.getRowSource(row);

    try {
      const evaluated = this.templaterService.evaluate(expression, context, schema?.otherData);
      if (typeof evaluated === 'boolean') {
        return evaluated;
      }
      if (evaluated !== undefined && evaluated !== null) {
        return !!evaluated;
      }
    } catch {
      // ignore evaluate errors and try parsing fallback
    }

    try {
      // FIX CRITICO: Usare delimitatori legacy { } invece di {{ }}
      const parsed = this.templaterService.parseTemplate(expression, context, schema?.otherData, '{', '}').trim().toLowerCase();
      if (parsed === 'true') return true;
      if (parsed === 'false') return false;
      if (parsed === '1') return true;
      if (parsed === '0') return false;
      if (parsed) return true;
      return false;
    } catch {
      return null;
    }
  }

  // ========================================================================
  // PUBLIC API METHODS - Compatibilità con Legacy DataTableLightComponent
  // ========================================================================

  /**
   * Aggiorna elemento nel dataSource alla posizione specificata
   * COMPATIBILITÀ LEGACY: Metodo critico per aggiornamenti dinamici
   * @param index Indice dell'elemento da aggiornare
   * @param newVal Nuovi valori da applicare (merge con esistente)
   */
  public updateElement(index: number, newVal: any): void {
    const currentData = this.sourceData();
    if (index >= 0 && index < currentData.length) {
      const updated = [...currentData];
      // Merge dei nuovi valori con l'elemento esistente
      updated[index] = { ...updated[index], ...newVal };
      this.sourceData.set(updated);

      if (this.devMode) {
        console.log('[NgxDataTableLight] updateElement:', { index, newVal, updated: updated[index] });
      }
    } else if (this.devMode) {
      console.warn('[NgxDataTableLight] updateElement: index out of bounds', { index, length: currentData.length });
    }
  }

  /**
   * Pulisce tutti i filtri applicati alla tabella
   * COMPATIBILITÀ LEGACY
   */
  public cleanFilter(): void {
    this.filterValues.set({});

    if (this.devMode) {
      console.log('[NgxDataTableLight] cleanFilter: all filters cleared');
    }
  }

  /**
   * Imposta funzioni custom per il sistema di templating
   * COMPATIBILITÀ LEGACY: Sostituisce setInterpolateFunction()
   * @param functions Oggetto con funzioni custom
   */
  public setCustomFunctions(functions: Record<string, any>): void {
    this.templaterService.setCustomFunctions(functions);

    if (this.devMode) {
      console.log('[NgxDataTableLight] setCustomFunctions:', Object.keys(functions));
    }
  }

  /**
   * Forza ricalcolo altezza footer
   * COMPATIBILITÀ LEGACY: Usato quando si cambiano dinamicamente footer rows/boxes
   */
  public resetFooter(): void {
    // Trigger re-rendering del footer forzando aggiornamento dello schema
    const schema = this.schemaData();
    if (schema) {
      this.schemaData.set({ ...schema });
    }

    if (this.devMode) {
      console.log('[NgxDataTableLight] resetFooter: footer recalculation triggered');
    }
  }

  /**
   * Ritorna lo schema di export corrente
   * COMPATIBILITÀ LEGACY
   */
  public getExportSchema(): any {
    return this.schemaData()?.exportSchema;
  }

  /**
   * Ritorna i dati attualmente filtrati e ordinati
   * NUOVO: Utile per operazioni esterne
   */
  public getFilteredData(): any[] {
    return this.filteredRows();
  }

  /**
   * Ritorna i dati visualizzati nella pagina corrente
   * NUOVO: Utile per operazioni esterne
   */
  public getDisplayedData(): any[] {
    return this.showedRows();
  }

  /**
   * Ritorna le righe selezionate
   * NUOVO: Utile per operazioni esterne
   */
  public getSelectedRows(): any[] {
    const indexes = this.selectedRowIndexes();
    const displayed = this.showedRows();
    return indexes.map(i => displayed[i]).filter(Boolean);
  }

  /**
   * Pulisce la selezione corrente
   * NUOVO: Utile per operazioni esterne
   */
  public clearSelection(): void {
    this.selectedRowIndexes.set([]);
    this.selectedRows.set([]);
  }

  /**
   * Cambia pagina corrente
   * COMPATIBILITÀ LEGACY
   */
  public selectPage(page: number): void {
    const totalPages = this.totalPages();
    if (page >= 1 && page <= totalPages) {
      this.currentPage.set(page);
    }
  }

  // ========================================================================
  // CELL EVENTS & TOOLTIP - Compatibilità Legacy
  // ========================================================================

  private activeTooltip: { content: string; x: number; y: number; placement?: string } | null = null;

  /**
   * Handler per click su cella - COMPATIBILITÀ LEGACY
   */
  onCellClick(event: MouseEvent, row: any, col: DtlColumnSchema): void {
    if (!col.callbackCellClick) return;
    this.emitEvent(col.callbackCellClick, { row: this.getRowSource(row), column: col, event });
  }

  /**
   * Handler per mouse enter su cella - COMPATIBILITÀ LEGACY
   */
  onCellMouseEnter(event: MouseEvent, row: any, col: DtlColumnSchema): void {
    if (col.tooltip || col.tooltipTemplate) {
      this.showCellTooltip(event, row, col);
    }
    if (col.callbackMouseEnter) {
      this.emitEvent(col.callbackMouseEnter, { row: this.getRowSource(row), column: col, event });
    }
  }

  /**
   * Handler per mouse leave su cella - COMPATIBILITÀ LEGACY
   */
  onCellMouseLeave(event: MouseEvent, row: any, col: DtlColumnSchema): void {
    if (col.tooltip || col.tooltipTemplate) {
      this.hideCellTooltip();
    }
    if (col.callbackMouseLeave) {
      this.emitEvent(col.callbackMouseLeave, { row: this.getRowSource(row), column: col, event });
    }
  }

  private showCellTooltip(event: MouseEvent, row: any, col: DtlColumnSchema): void {
    const schema = this.schemaData();
    if (!schema) return;

    let content = '';
    if (col.tooltipTemplate) {
      content = this.getTemplateValue(col.tooltipTemplate, row, schema);
    } else if (col.tooltip) {
      content = col.tooltip;
    }

    if (!content) return;

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const placement = col.tooltipPlacement || 'top';
    let x = rect.left + rect.width / 2;
    let y = placement === 'bottom' ? rect.bottom : rect.top;

    this.activeTooltip = { content, x, y, placement };
  }

  private hideCellTooltip(): void {
    this.activeTooltip = null;
  }

  getActiveTooltip() { return this.activeTooltip; }
  hasCellTooltip(col: DtlColumnSchema): boolean { return !!(col.tooltip || col.tooltipTemplate); }
  hasCellEvents(col: DtlColumnSchema): boolean { return !!(col.callbackCellClick || col.callbackMouseEnter || col.callbackMouseLeave); }

  // ========================================================================
  // ROW OPTIONS - Helper Methods per Template
  // ========================================================================

  /**
   * Verifica se una riga è visibile
   * COMPATIBILITÀ LEGACY: rowOptions.visible
   */
  isRowVisible(row: any): boolean {
    return row._visible !== false;
  }

  /**
   * Verifica se una riga è disabilitata
   * COMPATIBILITÀ LEGACY: rowOptions.disable
   */
  isRowDisabled(row: any): boolean {
    return row._disabled === true;
  }

  /**
   * Ottiene classi CSS per una riga
   * COMPATIBILITÀ LEGACY: rowOptions.class
   */
  getRowClass(row: any): string {
    const classes: string[] = [];

    // Classe base schema
    const schema = this.schemaData();
    if (schema?.trBodyClass) {
      classes.push(...Object.keys(schema.trBodyClass).filter(k => schema.trBodyClass![k]));
    }

    // Classe condizionale da rowOptions
    if (row._class) {
      classes.push(row._class);
    }

    // Classe disabled
    if (this.isRowDisabled(row)) {
      classes.push('disabled');
    }

    // Classe selected
    const displayedRows = this.showedRows();
    const rowIndex = displayedRows.indexOf(row);
    if (rowIndex >= 0 && this.selectedRowIndexes().includes(rowIndex)) {
      classes.push('selected');
      if (schema?.selectRowClass) {
        classes.push(schema.selectRowClass);
      }
    }

    return classes.join(' ');
  }

  /**
   * Ottiene stili inline per una riga
   * COMPATIBILITÀ LEGACY: rowOptions.style
   */
  getRowStyle(row: any): string {
    return row._style || '';
  }

  /**
   * Verifica se rowOptions è configurato
   */
  hasRowOptions(): boolean {
    const schema = this.schemaData();
    return !!(schema?.rowOptions &&
      (schema.rowOptions.visible || schema.rowOptions.disable ||
       schema.rowOptions.class || schema.rowOptions.style));
  }

  // ============================================================================
  // FOOTER COLLAPSIBLE METHODS - FASE 2
  // ============================================================================

  /**
   * Toggle footer collapsed/expanded state
   * Compatibile con legacy footerCollapsible feature
   */
  public toggleFooter(): void {
    const schema = this.schemaData();
    if (schema?.footerCollapsible) {
      this.footerCollapsed.set(!this.footerCollapsed());

      // Emit event for external tracking
      this.emitEvent('footerToggled', {
        collapsed: this.footerCollapsed()
      });
    }
  }

  /**
   * Set footer collapsed state programmatically
   */
  public setFooterCollapsed(collapsed: boolean): void {
    const schema = this.schemaData();
    if (schema?.footerCollapsible) {
      this.footerCollapsed.set(collapsed);
    }
  }

  /**
   * Check if footer is currently collapsed
   */
  public isFooterCollapsed(): boolean {
    return this.footerCollapsed();
  }

  /**
   * Check if footer is collapsible
   */
  public isFooterCollapsible(): boolean {
    const schema = this.schemaData();
    return schema?.footerCollapsible === true;
  }

  /**
   * Check if footer should be rendered (has rows or boxes)
   */
  public hasFooter(): boolean {
    const schema = this.schemaData();
    return !!(
      (schema?.footerRows && schema.footerRows.length > 0) ||
      (schema?.footerBoxes && schema.footerBoxes.length > 0)
    );
  }

  // ============================================================================
  // ROW DETAIL EXPANSION METHODS - FASE 2
  // ============================================================================

  /**
   * Display row detail by parsing template and storing result
   * Compatible with legacy displayRowDetail()
   */
  private displayRowDetail(row: any): void {
    const schema = this.schemaData();
    if (!schema?.rowDetailTemplate) return;

    const rowIndex = row._mainIndex_;
    const currentExpanded = this.expandedRowDetails();
    const isExpanded = currentExpanded.has(rowIndex);

    // Toggle: if already expanded, collapse it
    if (isExpanded) {
      this.clearRowDetail();
      return;
    }

    // Clear all other details (only one expanded at a time)
    this.clearRowDetail();

    // Parse template and store
    const detailHtml = this.getTemplateValue(
      schema.rowDetailTemplate,
      row,
      schema
    );

    const newExpanded = new Map(currentExpanded);
    newExpanded.set(rowIndex, detailHtml);
    this.expandedRowDetails.set(newExpanded);
  }

  /**
   * Clear all row details
   * Compatible with legacy clearRowDetail()
   */
  private clearRowDetail(): void {
    this.expandedRowDetails.set(new Map());
    this.templaterService.clearCache();
  }

  /**
   * Get detail HTML for a specific row
   */
  public getRowDetail(row: any): string | null {
    const rowIndex = row._mainIndex_;
    return this.expandedRowDetails().get(rowIndex) || null;
  }

  /**
   * Check if row has expanded detail
   */
  public isRowDetailExpanded(row: any): boolean {
    const rowIndex = row._mainIndex_;
    return this.expandedRowDetails().has(rowIndex);
  }

  /**
   * Public method to toggle row detail programmatically
   */
  public toggleRowDetail(row: any): void {
    this.displayRowDetail(row);
  }

  /**
   * Check if row detail is enabled in schema
   */
  public hasRowDetailTemplate(): boolean {
    const schema = this.schemaData();
    return !!(schema?.rowDetailTemplate);
  }
}
