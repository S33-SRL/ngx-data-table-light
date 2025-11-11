import { DtlButtonSchema } from './dtl-button-schema';

/**
 * Schema per definizione colonne DataTable - Angular 20 compatible
 */
export interface DtlColumnSchema {
    name?: string;
    nameRendered?: string;
    field?: string;
    fieldPath?: string;
    sortField?: string;
    sortFieldPath?: string;
    
    // Tipi supportati - estesi per Angular 20
    type?: "" | "string" | "text" | "nowrap" | "currency" | "decimal" | 
           "number" | "date" | "dateTime" | "time" | "check" | "button";
    
    // Template usando TsTemplater
    template?: string;
    
    // Width supporta CSS Grid e Flexbox
    width?: string | number | {min: number | string, max: number | string};
    
    // Styling
    thStyle?: Record<string, string | number>;
    thClass?: Record<string, boolean>;
    tdStyle?: Record<string, string | number>;
    tdClass?: Record<string, boolean>;
    
    // Filtering
    canFilter?: boolean;
    filterForcedType?: "string" | "number" | "date" | "boolean";
    filterStyle?: Record<string, string | number>;
    filterClass?: Record<string, boolean>;
    
    // Ordering & Resizing
    canOrder?: boolean;
    canResize?: boolean;
    
    // Button configuration
    buttonConfig?: DtlButtonSchema;
    
    // Visibility & UI
    hide?: boolean;
    placeholder?: string;
    autocomplete?: boolean;
    horizontalAlign?: "" | "left" | "center" | "right";
    
    // Tooltip system - Compatibilità legacy estesa
    tooltip?: string;
    tooltipTemplate?: string;              // Template dinamico per tooltip
    tooltipTrigger?: "hover" | "click";
    tooltipPlacement?: "top" | "bottom" | "left" | "right" | "auto";
    tooltipCssClass?: string;
    tooltipStyle?: string;

    // Cell event callbacks - COMPATIBILITÀ LEGACY
    callbackCellClick?: string;            // Evento click su cella
    callbackMouseEnter?: string;           // Evento mouse enter su cella
    callbackMouseLeave?: string;           // Evento mouse leave su cella
}