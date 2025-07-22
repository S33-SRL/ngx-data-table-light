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
    
    // Tooltip system
    tooltip?: string;
    tooltipTrigger?: "hover" | "click";
    tooltipCssClass?: string;
    tooltipStyle?: string;
}