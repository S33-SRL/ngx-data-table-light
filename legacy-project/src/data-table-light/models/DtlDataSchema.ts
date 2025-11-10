import { DtlButtonSchema } from "./DtlButtonSchema";
import { DtlColumnSchema } from "./DtlColumnSchema";
import { DtlDataSchemaText } from "./DtlDataSchemaText";
import { DtlExportButtonSchema } from "./DtlExportButtonSchema";
import { DtlExportSchema } from "./DtlExportSchema";
import { DtlFooterBox } from "./DtlFooterBox";
import { DtlFooterRow } from "./DtlFooterRow";
import { DtlRowOptions } from "./DtlRowOptions";

export interface DtlDataSchema {
    devMode?:boolean,
    contentClass?: any;
    contentStyle?: any;
    tbContentClass?: any;
    tbContentStyle?: any;
    tableClass?: any;
    tableStyle?: any;
    theadClass?: any;
    theadStyle?: any;
    headRowClass?:any;
    tbodyClass?: any;
    tbodyStyle?: any;
    tableStriped?: boolean;

    // FILTERS
    filterClass?: any;    
    filterStyle?: any;
    filterContentClass?: any;
    filterContentStyle?: any;

    trBodyClass?:any;
    thBtnClass?: any;
    thBtnStyle?: any;
    tdBtnStyle?: any;
    maxRows?: number | null;
    maxRowsOptions?: any | Array<any>;
    noRowStr?: string;
    selectRows?: DtlSelectionMode;
    selectRowClass?: string;
    selectRowTemplateDisable?: string;
    defaultOrderField?: string;

    // PAGER
    pagerBoundary?: boolean;
    pagerDirection?: boolean;
    pagerMaxSize?: number;
    pagerRotate?: boolean;
    pagerHidePages?: boolean;
    pagerHideRows?: boolean;
    pagerPageName?: string;
    pagerRowsName?: string;
    pagerButtonClass?: any;


    // COLUMNS 
    columns?: Array<DtlColumnSchema>;
    buttonDefault?:DtlButtonSchema;
    buttons?: Array<DtlButtonSchema>;
    exportButtons?: Array<DtlExportButtonSchema>;

    exportSchema?: DtlExportSchema;
    texts?: Array<DtlDataSchemaText>;
    

    callbackSelectRow?: string;
    callbackSelectRows?: string;
    callbackChangedRowsCount?: string;
    callbackSelectedPageChange?: string;
    callbackDoubleClickRow?: string;

    //sezione nuova 
    callbackRowsOptionChange?: string;
    callbackRowsDetail?: string;

    otherData?: any;

    filters?:{} | any;

    csvFileName?:string;

    rowOptions?: DtlRowOptions;

    //sezione nuova
    rowDeatailTemplate?:string;
    rowDeatailClass?:any;
    rowDeatailStyle?:any;

    //sezione Filippo
    resizable?: boolean;
    virtualScroll?: boolean;
    tbodycontainerStyle?: any;

    //bottoni angular-bottom-sheet
    externalButtons?: Array<any>;

    //Footer
    footerRows?: Array<DtlFooterRow>;
    footerContainerClass?: string;
    footerContainerStyle?: any;
    footerCollapsible?: boolean;
    footerInitiallyCollapsed?: boolean;

    footerBoxes?: Array<DtlFooterBox>;
    footerBoxesContainerClass?: string;
    footerBoxesContainerStyle?: any;

    footerToggleClass?: string;
    footerToggleStyle?: any;
}

export type DtlSelectionMode = "" | "none" | "single" | "multi" | "multicheck";