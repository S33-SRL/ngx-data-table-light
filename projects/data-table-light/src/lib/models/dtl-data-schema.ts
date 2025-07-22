import { DtlButtonSchema } from './dtl-button-schema';
import { DtlColumnSchema } from './dtl-column-schema';
import { DtlExportButtonSchema } from './dtl-export-button-schema';
import { DtlExportSchema } from './dtl-export-schema';
import { DtlRowOptions } from './dtl-row-options';

/**
 * Schema principale DataTable - Angular 20 Zoneless compatible
 */
export interface DtlDataSchema {
    // Development
    devMode?: boolean;

    // Layout styling
    contentClass?: Record<string, boolean> | string[];
    contentStyle?: Record<string, string | number>;
    tbContentClass?: Record<string, boolean>;
    tbContentStyle?: Record<string, string | number>;
    tableClass?: Record<string, boolean> | string[];
    tableStyle?: Record<string, string | number>;

    // Header styling
    theadClass?: Record<string, boolean>;
    theadStyle?: Record<string, string | number>;
    headRowClass?: Record<string, boolean>;

    // Body styling
    tbodyClass?: Record<string, boolean>;
    tbodyStyle?: Record<string, string | number>;
    tbodycontainerStyle?: Record<string, string | number>;
    tableStriped?: boolean;

    // Filters
    filterClass?: Record<string, boolean> | string[];
    filterStyle?: Record<string, string | number>;
    filterContentClass?: Record<string, boolean> | string[] ;
    filterContentStyle?: Record<string, string | number>;

    // Row styling
    trBodyClass?: Record<string, boolean>;

    // Button areas
    thBtnClass?: Record<string, boolean>;
    thBtnStyle?: Record<string, string | number>;
    tdBtnStyle?: Record<string, string | number>;

    // Pagination
    maxRows?: number | null;
    maxRowsOptions?: number[];
    noRowStr?: string;

    // Selection
    selectRows?: DtlSelectionMode;
    selectRowClass?: string;
    selectRowTemplateDisable?: string;
    defaultOrderField?: string;

    // Pager configuration
    pagerBoundary?: boolean;
    pagerDirection?: boolean;
    pagerMaxSize?: number;
    pagerRotate?: boolean;
    pagerHidePages?: boolean;
    pagerHideRows?: boolean;
    pagerPageName?: string;
    pagerRowsName?: string;
    pagerButtonClass?: Record<string, boolean>;

    // Core data structure
    columns?: DtlColumnSchema[];
    buttonDefault?: DtlButtonSchema;
    buttons?: DtlButtonSchema[];
    exportButtons?: DtlExportButtonSchema[];
    exportSchema?: DtlExportSchema;

    // Callbacks - Angular 20 zoneless friendly
    callbackSelectRow?: string;
    callbackSelectRows?: string;
    callbackChangedRowsCount?: string;
    callbackSelectedPageChange?: string;
    callbackDoubleClickRow?: string;
    callbackRowsOptionChange?: string;
    callbackRowsDetail?: string;

    // Data context
    otherData?: any; // For TsTemplater context
    filters?: Record<string, any>;
    csvFileName?: string;

    // Row options
    rowOptions?: DtlRowOptions;

    // Detail templates
    rowDeatailTemplate?: string;
    rowDeatailClass?: Record<string, boolean>;
    rowDeatailStyle?: Record<string, string | number>;

    // Modern features
    resizable?: boolean;
    virtualScroll?: boolean;

    // External integration
    externalButtons?: any[];
}

export type DtlSelectionMode = "" | "none" | "single" | "multi" | "multicheck";
