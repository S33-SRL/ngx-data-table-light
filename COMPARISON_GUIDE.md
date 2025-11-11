# Guida al Confronto Legacy vs NgxDataTableLight

## Panoramica

Questa guida documenta il processo di confronto tra il sistema legacy e il nuovo NgxDataTableLight, facilitando la migrazione e l'identificazione delle differenze.

## Struttura del Progetto per Confronto

```
ngx-data-table-light-workspace/
│
├── projects/ngx-data-table-light/      # NUOVO sistema (NgxDataTableLight)
│   └── src/lib/                    # Codice sorgente nuovo componente
│
├── projects/dtl-demo-app/          # APPLICAZIONE DEMO per test
│   └── src/app/                    # App per testare entrambi i sistemi
│
├── legacy-project/                 # VECCHIO sistema
│   └── src/
│       ├── ngx-data-table-light/       # Componente DataTable legacy
│       └── functions/              # Funzioni di supporto e templating
│
└── test-examples/                  # ESEMPI e TEST di confronto
    ├── schemas/                    # Tutti gli schemi di test
    │   ├── current-demo/          # Schemi attualmente in uso
    │   ├── basic/                 # Test funzionalità base
    │   ├── advanced/              # Test funzionalità avanzate
    │   └── legacy-format/         # Schemi formato legacy
    ├── data/                      # Dataset per test
    ├── comparisons/               # Risultati confronti
    └── screenshots/               # Confronto visuale
```

## Workflow di Test

### 1. Preparazione
- Gli schemi e i dati vengono preparati in `test-examples/`
- Sia schemi legacy che nuovi vengono documentati

### 2. Esecuzione
- Tutti i test vengono eseguiti nella **demo app principale**
- La demo app può caricare schemi da `test-examples/`
- Non è necessario un ambiente separato per il legacy

### 3. Confronto
- I risultati vengono documentati in `test-examples/comparisons/`
- Screenshot salvati per confronto visuale

## Come Procedere

### 1. Analizzare il Progetto Legacy

Nella cartella `legacy-project/src/`:
- **ngx-data-table-light/**: Componente legacy
- **functions/**: Sistema di templating e utility

Documentare:
- Struttura dei componenti
- API pubblica
- Sistema di templating utilizzato
- Dipendenze esterne

### 2. Preparare Test Cases

In `test-examples/schemas/`:

#### Per ogni funzionalità da testare:
1. Creare schema nel nuovo formato in `basic/` o `advanced/`
2. Se disponibile, salvare schema legacy equivalente in `legacy-format/`
3. Preparare dataset appropriato in `data/`
4. Documentare test case

### 3. Testare nella Demo App

```typescript
// projects/dtl-demo-app/src/app/app.ts

// Importare schema di test
import { TEST_SCHEMA } from '../../../../test-examples/schemas/basic/test-case.ts';

// Usare nella demo
tableSchema = signal<DtlDataSchema>(TEST_SCHEMA);
```

### 4. Documentare Risultati

In `test-examples/comparisons/`:
- Creare file markdown per ogni funzionalità testata
- Includere screenshot se rilevante
- Documentare differenze e problemi

## Sistema di Templating - Analisi

### Legacy System (in legacy-project/src/functions/)
- **Libreria/Sistema**: [Da identificare analizzando il codice]
- **Sintassi**: [Da documentare]
- **Funzioni disponibili**: [Da elencare]

### Nuovo Sistema (NgxDataTableLight)
- **Sistema**: Templating integrato custom
- **Sintassi**: `{field}`, `{@Function|params}`
- **Funzioni**: Predefinite e estendibili via DtlFunctions

### Mappatura Sintassi

| Funzionalità | Legacy | NgxDataTableLight | Note |
|--------------|--------|----------------|------|
| Interpolazione | `{{var}}` | `{var}` | Cambio delimitatori |
| Path nidificati | `{{obj.prop}}` | `{obj.prop}` | Simile |
| Funzioni | ? | `{@Func\|{param}}` | Da verificare |
| Condizionali | ? | `{@If\|condition\|true\|false}` | Da verificare |

## Checklist di Confronto

### Analisi Codice Legacy ✅
- [x] Codice legacy inserito in `legacy-project/src/`
- [ ] Analizzare struttura componenti
- [ ] Identificare sistema di templating
- [ ] Mappare funzionalità supportate
- [ ] Documentare API pubblica

### Preparazione Test
- [x] Schema corrente copiato in `test-examples/schemas/current-demo/`
- [ ] Creare test cases base
- [ ] Creare test cases avanzati
- [ ] Preparare dataset di varie dimensioni

### Test Funzionali
- [ ] Rendering base
- [ ] Tipi di colonna
- [ ] Filtri e ordinamento
- [ ] Paginazione
- [ ] Virtual scrolling
- [ ] Export
- [ ] Template personalizzati
- [ ] Footer e calcoli

### Test Performance
- [ ] Tempo caricamento (100, 1k, 10k righe)
- [ ] Scroll performance
- [ ] Memory usage
- [ ] Export performance

### Documentazione
- [ ] Differenze API
- [ ] Guida migrazione
- [ ] Script conversione schemi
- [ ] Best practices

## Template per Test Case

### File: `test-examples/schemas/[category]/[feature].ts`

```typescript
export const FEATURE_TEST_SCHEMA: DtlDataSchema = {
  // Schema configurazione
};

export const FEATURE_TEST_DATA = [
  // Dati di test
];

export const FEATURE_TEST_NOTES = {
  description: "Cosa testa questo schema",
  legacy_equivalent: "Come era fatto nel legacy",
  differences: ["Diff 1", "Diff 2"],
  migration_notes: "Come migrare"
};
```

## Script Utili

### Confronto rapido delle API

```bash
# Lista metodi pubblici legacy
grep -r "public" legacy-project/src/ngx-data-table-light/

# Lista metodi pubblici nuovo
grep -r "@Input\|@Output" projects/ngx-data-table-light/src/lib/components/
```

### Analisi funzioni templating legacy

```bash
# Trova utilizzi di templating nel legacy
grep -r "{{" legacy-project/src/
```

## Prossimi Passi Immediati

1. **Analizzare `legacy-project/src/functions/`**
   - Identificare il sistema di templating
   - Elencare le funzioni disponibili
   - Capire la sintassi utilizzata

2. **Creare primo test case completo**
   - Schema semplice ma rappresentativo
   - Dataset di test appropriato
   - Documentazione delle differenze

3. **Testare nella demo app**
   - Verificare che lo schema funzioni
   - Identificare feature mancanti
   - Documentare problemi

4. **Iniziare documentazione migrazione**
   - Mappatura proprietà
   - Conversione sintassi template
   - Guida step-by-step

---

Una volta completata l'analisi del codice legacy, potremo:
- Creare script automatici di conversione
- Identificare gap funzionali
- Ottimizzare il nuovo sistema
- Preparare una guida di migrazione completa