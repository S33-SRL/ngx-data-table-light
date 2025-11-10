// -------------------------------------------------------------
// Deep BigDiff con hashing e supporto array order-insensitive
// -------------------------------------------------------------

export type DiffOptions = {
  // ignora l'ordine degli array (alias compatibili con tua richiesta)
  ignoreArrayOrder?: boolean;

  // considera null/undefined equivalenti a proprietà mancanti
  treatNullAsUndefined?: boolean;

  // considera stringa vuota come undefined (utile per form)
  treatEmptyStringAsUndefined?: boolean;
  
  // chiave o funzione per accoppiare elementi di array (es. 'id' o (x)=>x.id)
  matchBy?: string | ((item: any) => string | number) | null;

  // funzione di hash/fingerprint (di default: stableStringify)
  hashFn?: (x: any) => string;

  // abilita short-circuit su hash uguali (default true)
  shortCircuitWithHash?: boolean;
};

export function BigDiff(lhs: any, rhs: any, options: DiffOptions = {}): any {
  const opts = normalizeOptions(options);

  // short-circuit globale (evita discese costose)
  if (opts.shortCircuitWithHash && fingerprint(lhs, opts) === fingerprint(rhs, opts)) {
    return {};
  }

  // identità stretta
  if (lhs === rhs) return {};

  // null handling
  if (lhs === null) return rhs;
  if (rhs === null) return lhs;

  // Date come valori
  if (isDate(lhs) || isDate(rhs)) {
    return (isDate(lhs) && isDate(rhs) && lhs.valueOf() === rhs.valueOf()) ? {} : rhs;
  }

  // Array
  if (Array.isArray(lhs) && Array.isArray(rhs)) {
    return diffArrays(lhs, rhs, opts);
  }

  // se uno non è oggetto → valore rimpiazzato
  if (!isObject(lhs) || !isObject(rhs)) return rhs;

  // Oggetti plain: diff per chiavi
  const l = properObject(lhs);
  const r = properObject(rhs);

  const result: any = {};

  // Set di tutte le chiavi da confrontare
  const allKeys = new Set([...Object.keys(l), ...Object.keys(r)]);

  for (const key of allKeys) {
    const lHasKey = Object.prototype.hasOwnProperty.call(l, key);
    const rHasKey = Object.prototype.hasOwnProperty.call(r, key);
    
    const lValue = lHasKey ? l[key] : undefined;
    const rValue = rHasKey ? r[key] : undefined;

    // Con treatNullAsUndefined: normalizza null a undefined per il confronto
    const lNorm = normalizeForComparison(lValue, opts);
    const rNorm = normalizeForComparison(rValue, opts);

    // Se entrambi sono undefined (o normalizzati a undefined), sono uguali
    if (lNorm === undefined && rNorm === undefined) {
      continue;
    }
    
    // Se solo uno è undefined, c'è differenza
    if (lNorm === undefined) {
      result[key] = rNorm;
      continue;
    }
    if (rNorm === undefined) {
      result[key] = undefined;
      continue;
    }
    
    // Altrimenti confronta ricorsivamente
    const sub = BigDiff(lNorm, rNorm, opts);
    if (!isEmptyObject(sub)) {
      result[key] = sub;
    }
  }

  return isEmptyObject(result) ? {} : result;
}

// ------------------------
// Array diff
// ------------------------

function diffArrays(lhsArr: any[], rhsArr: any[], opts: NormalizedOptions): any {
  // Caso order-sensitive → diff per indice
  if (!opts.ignoreArrayOrder) {
    const lObj = indexObject(lhsArr);
    const rObj = indexObject(rhsArr);
    return BigDiff(lObj, rObj, opts);
  }

  // Caso order-insensitive
  const keyFn = makeKeyFn(opts.matchBy);

  // Con chiave: aggiornamenti "in place" dove possibile
  if (keyFn) {
    return diffArraysByKey(lhsArr, rhsArr, keyFn, opts);
  }

  // Senza chiave: usa solo hash → added/removed (niente "updated" affidabile)
  return diffArraysByHash(lhsArr, rhsArr, opts);
}

// Accoppia per chiave logica (es. 'id'). Usa hash per saltare uguali e scendere solo dove serve.
function diffArraysByKey(
  lhs: any[],
  rhs: any[],
  keyFn: (x: any) => string,
  opts: NormalizedOptions
) {
  const left = groupByKey(lhs, keyFn);
  const right = groupByKey(rhs, keyFn);

  const added: any[] = [];
  const removed: any[] = [];
  const updated: Record<string, any> = {};

  const allKeys = new Set([...left.keys(), ...right.keys()]);
  
  for (const k of allKeys) {
    const L = left.get(k) ?? [];
    const R = right.get(k) ?? [];

    if (L.length === 0 && R.length > 0) { 
      added.push(...R); 
      continue; 
    }
    if (R.length === 0 && L.length > 0) { 
      removed.push(...L); 
      continue; 
    }

    // Bucket per hash per eliminare i perfetti uguali (short-circuit)
    const lb = bucketByHash(L, opts);
    const rb = bucketByHash(R, opts);

    // Elimina coppie con stesso hash (nessuna diff)
    for (const h of lb.keys()) {
      const lList = lb.get(h)!;
      const rList = rb.get(h);
      if (!rList) continue;
      
      const min = Math.min(lList.length, rList.length);
      lList.splice(0, min);
      rList.splice(0, min);
      
      if (lList.length === 0) lb.delete(h);
      if (rList.length === 0) rb.delete(h);
    }

    const lRemain = flatten(lb);
    const rRemain = flatten(rb);

    if (lRemain.length === 0 && rRemain.length === 0) continue;

    // Se resta 1:1 → prova "updated" scendendo solo qui
    if (lRemain.length === 1 && rRemain.length === 1) {
      const inner = BigDiff(lRemain[0], rRemain[0], opts);
      if (!isEmptyObject(inner)) {
        updated[k] = inner;
      }
      continue;
    }

    // Ambiguità (duplicati o cardinalità diversa): segnala come removed/added
    if (lRemain.length) removed.push(...lRemain);
    if (rRemain.length) added.push(...rRemain);
  }

  if (!added.length && !removed.length && !Object.keys(updated).length) {
    return {};
  }
  
  const out: any = {};
  if (removed.length) out.removed = removed;
  if (added.length) out.added = added;
  if (Object.keys(updated).length) out.updated = updated;
  return out;
}

// Senza chiave: multinsiemi per hash → added/removed
function diffArraysByHash(lhs: any[], rhs: any[], opts: NormalizedOptions) {
  const lb = bucketByHash(lhs, opts);
  const rb = bucketByHash(rhs, opts);

  const added: any[] = [];
  const removed: any[] = [];

  const all = new Set([...lb.keys(), ...rb.keys()]);
  
  for (const h of all) {
    const L = lb.get(h)?.slice() ?? [];
    const R = rb.get(h)?.slice() ?? [];
    const min = Math.min(L.length, R.length);
    
    if (min > 0) { 
      L.splice(0, min); 
      R.splice(0, min); 
    }
    
    if (L.length) removed.push(...L);
    if (R.length) added.push(...R);
  }

  if (!added.length && !removed.length) return {};
  
  const out: any = {};
  if (removed.length) out.removed = removed;
  if (added.length) out.added = added;
  return out;
}

// ------------------------
// Helpers
// ------------------------

type NormalizedOptions = Required<Pick<DiffOptions,
  'ignoreArrayOrder' | 'treatNullAsUndefined' | 'treatEmptyStringAsUndefined' | 'matchBy' | 'hashFn' | 'shortCircuitWithHash'
>>;

function normalizeOptions(o: DiffOptions): NormalizedOptions {
  return {
    ignoreArrayOrder: !!(o.ignoreArrayOrder),
    treatNullAsUndefined: !!(o.treatNullAsUndefined),
    treatEmptyStringAsUndefined: !!o.treatEmptyStringAsUndefined,
    matchBy: o.matchBy ?? null,
    hashFn: o.hashFn ?? stableStringify,
    shortCircuitWithHash: o.shortCircuitWithHash ?? true
  };
}

// Normalizza null a undefined se richiesto
function normalizeForComparison (value: any, opts: NormalizedOptions): any {
  if (opts.treatNullAsUndefined && value === null) return undefined;
  if (opts.treatEmptyStringAsUndefined && value === '') return undefined;
  return value;
}

// Type guards e utility
function isObject(x: any): x is object {
  return x !== null && typeof x === 'object';
}

function isPlainObject(x: any): x is Record<string, any> {
  return Object.prototype.toString.call(x) === '[object Object]';
}

function isEmptyObject(x: any): boolean {
  return isPlainObject(x) && Object.keys(x).length === 0;
}

function isDate(d: any): d is Date {
  return d instanceof Date || Object.prototype.toString.call(d) === '[object Date]';
}

function properObject(o: any): any {
  return (isObject(o) && !(o as any).hasOwnProperty) ? { ...o } : o;
}

function indexObject(arr: any[]): Record<string, any> {
  const o: Record<string, any> = {};
  for (let i = 0; i < arr.length; i++) {
    o[i] = arr[i];
  }
  return o;
}

function makeKeyFn(matchBy?: DiffOptions['matchBy']): ((x: any) => string) | undefined {
  if (!matchBy) return undefined;
  if (typeof matchBy === 'function') {
    return (x: any) => String(matchBy(x));
  }
  if (typeof matchBy === 'string') {
    return (x: any) => String(getByPath(x, matchBy));
  }
  return undefined;
}

function getByPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
}

function groupByKey(items: any[], keyFn: (x: any) => string): Map<string, any[]> {
  const m = new Map<string, any[]>();
  for (const it of items) {
    const k = keyFn(it);
    const bucket = m.get(k);
    if (bucket) {
      bucket.push(it);
    } else {
      m.set(k, [it]);
    }
  }
  return m;
}

function bucketByHash(items: any[], opts: NormalizedOptions): Map<string, any[]> {
  const m = new Map<string, any[]>();
  for (const it of items) {
    const h = fingerprint(it, opts);
    const bucket = m.get(h);
    if (bucket) {
      bucket.push(it);
    } else {
      m.set(h, [it]);
    }
  }
  return m;
}

function flatten<T>(m: Map<string, T[]>): T[] {
  const out: T[] = [];
  for (const arr of m.values()) {
    out.push(...arr);
  }
  return out;
}

// ------------------------
// Fingerprint (hash deterministico)
// ------------------------

function fingerprint(x: any, opts: NormalizedOptions): string {
  // Se treatNullAsUndefined è attivo, normalizza prima dell'hash
  const value = opts.treatNullAsUndefined ? normalizeForHash(x) : x;
  return opts.hashFn(value);
}

// Normalizza ricorsivamente null a undefined per l'hashing
function normalizeForHash(value: any): any {
  if (value === null) return undefined;
  if (!isObject(value)) return value;
  
  if (Array.isArray(value)) {
    return value.map(normalizeForHash);
  }
  
  const normalized: Record<string, any> = {};
  for (const key of Object.keys(value)) {
    const v = (value as Record<string, any>)[key];
    if (v !== null && v !== undefined) {
      normalized[key] = normalizeForHash(v);
    } else if (v === null) {
      // Omette la chiave se null (trattandola come undefined)
      // Non aggiungiamo la chiave all'oggetto normalizzato
    }
  }
  return normalized;
}

/** JSON deterministico (chiavi ordinate), gestisce Date, funzione, cicli */
function stableStringify(value: any): string {
  const seen = new WeakSet();

  const _s = (v: any): string => {
    if (v === null || typeof v !== 'object') {
      if (typeof v === 'function') return '"[Function]"';
      if (typeof v === 'bigint') return `"${v.toString()}n"`;
      return JSON.stringify(v);
    }
    if (isDate(v)) return `"Date(${(v as Date).valueOf()})"`;
    if (seen.has(v)) return '"[Circular]"';
    seen.add(v);

    if (Array.isArray(v)) {
      // NB: qui NON ordiniamo: l'ordine array viene gestito a livello diff
      return '[' + v.map(_s).join(',') + ']';
    }
    
    const keys = Object.keys(v).sort();
    const body = keys.map(k => JSON.stringify(k) + ':' + _s(v[k])).join(',');
    return '{' + body + '}';
  };

  return _s(value);
}

// ------------------------
// Export aggiuntivi per testing
// ------------------------

export const internals = {
  normalizeOptions,
  normalizeForComparison,
  normalizeForHash,
  stableStringify,
  fingerprint,
  diffArraysByKey,
  diffArraysByHash
};