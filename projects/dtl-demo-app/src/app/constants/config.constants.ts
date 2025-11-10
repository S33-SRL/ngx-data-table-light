/**
 * Configurazioni generali dell'applicazione
 */

/**
 * Configurazioni per la tabella
 */
export const TABLE_CONFIG = {
  /** Righe massime visualizzabili di default */
  DEFAULT_MAX_ROWS: null,
  
  /** Abilita il ridimensionamento delle colonne */
  RESIZABLE: true,
  
  /** Abilita lo scroll virtuale per performance migliori */
  VIRTUAL_SCROLL: true,
  
  /** Abilita la selezione multipla delle righe */
  MULTI_SELECT: true,
  
  /** Abilita le strisce per migliorare la leggibilità */
  STRIPED: true,
  
  /** Abilita i controlli di paginazione */
  PAGER_BOUNDARY: true,
  PAGER_DIRECTION: true,
  PAGER_ROTATE: true
} as const;

/**
 * Stili di base per l'interfaccia
 */
export const UI_COLORS = {
  /** Colore di sfondo per l'intestazione della tabella */
  HEADER_BACKGROUND: "#e6e6e6",
  
  /** Colore di sfondo per la tabella */
  TABLE_BACKGROUND: "white",
  
  /** Colori per gli stati */
  STATUS_COLORS: {
    SUCCESS: "#1CBCD8",
    WARNING: "orange", 
    DANGER: "darkorange",
    CLOSED: "green"
  }
} as const;

/**
 * Dimensioni e layout
 */
export const LAYOUT_CONFIG = {
  /** Larghezza minima della tabella */
  MIN_TABLE_WIDTH: "200px",
  
  /** Altezza del contenitore del corpo tabella */
  TBODY_CONTAINER_HEIGHT: "100%",
  
  /** Griglia CSS per le colonne */
  GRID_TEMPLATE_COLUMNS: "minmax(80px,100px) minmax(70px,85px) minmax(50px,65px) minmax(150px,1fr) minmax(80px,150px) minmax(80px,150px) minmax(150px,1fr) 95px 95px 40px minmax(100px,120px) 277px"
} as const;