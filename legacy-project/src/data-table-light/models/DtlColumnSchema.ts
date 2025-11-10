import { DtlButtonSchema } from "./DtlButtonSchema";

export interface DtlColumnSchema {
    name?: string;
    nameRendered?: string;
    field?: string;
    fieldPath?: string;
    sortField?: string;
    sortFieldPath?: string;
    type?: "" | "string" | "text" | "nowrap" | "currency" | "decimal" |"number" | "date" | "dateTime" | "time" | "check" | "button";
    template?: string;
    width?: string | number | {min: number | string, max: number | string};
    thStyle?: { [className: string]: string | number };
    thClass?: { [className: string]: boolean };
    tdStyle?: { [className: string]: string | number };
    tdClass?: { [className: string]: boolean };
    canFilter?: boolean;
    filterForcedType?: "string" | "number" | "date" | "boolean";
    canOrder?: boolean;
    canResize?: boolean;
    filterStyle?: { [className: string]: string | number };
    filterClass?: { [className: string]: boolean };
    buttonConfig?: DtlButtonSchema;
    hide?: boolean;
    placeholder?:string;
    autocomplete?:boolean;

    horizontalAlign?: "" | "left" | "center" | "right";

    //Tooltip
    tooltip?: string;
    tooltipTrigger?: "hover" | "click";

    tooltipCssClass?: string;
    tooltipStyle?:string;
}