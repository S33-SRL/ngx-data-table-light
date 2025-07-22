/**
 * Schema per bottoni DataTable - Angular 20 compatible
 */
export interface DtlButtonSchema {
    name: string;
    iconClass?: Record<string, boolean> | string[];
    class?: Record<string, boolean> | string[];
    title?: string;
    text?: string;
    style?: Record<string, string | number>;
    callback?: string;
    visible?: boolean;
    disable?: boolean;
    width?: number;

    // Template system con TsTemplater
    template?: string;
    templateDisable?: string;
    templateHide?: string;
    color?: string;
}
