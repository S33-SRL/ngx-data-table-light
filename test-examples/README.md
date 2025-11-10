# Test Examples - DataTableLight

Organizzazione logica degli esempi per DataTableLight dove ogni esempio contiene schema e dati accoppiati.

## 📂 Struttura

```
test-examples/
├── firstExample/           # Esempio principale completo
│   ├── schema.ts          # Configurazione tabella
│   ├── data.ts            # Dataset associato
│   ├── index.ts           # Export e metadati
│   └── README.md          # Documentazione esempio
│
├── extras/                # Esempi aggiuntivi specifici
│   ├── simple-table/      # Tabella base minimale
│   ├── advanced-features/ # Funzionalità avanzate
│   ├── large-dataset/     # Test con molti dati
│   ├── virtual-scroll/    # Virtual scrolling
│   ├── export-test/       # Test export Excel/CSV
│   └── custom-templates/  # Template personalizzati
│
├── comparisons/           # Confronti legacy vs nuovo
│   ├── features/          # Confronto funzionalità
│   ├── performance/       # Test performance
│   └── migration/         # Guide migrazione
│
├── screenshots/           # Screenshot per confronti
│
└── custom/               # (Future) Area per test personalizzati utente
```

## 🎯 Logica di Organizzazione

### Principio: Schema + Data = Esempio Completo
Ogni esempio è **autocontenuto** con:
- `schema.ts` o `index.ts` - Configurazione della tabella
- `data.ts` o nel file stesso - Dataset correlato
- `README.md` (opzionale) - Documentazione specifica

### firstExample/
L'esempio principale che mostra tutte le funzionalità base in un contesto realistico (gestione ordini).

### extras/
Esempi focalizzati su funzionalità specifiche:
- **simple-table**: Tabella minima per test base
- **virtual-scroll**: Performance con 10k+ righe
- **export-test**: Test export in vari formati
- **custom-templates**: Template HTML complessi
- Altri esempi specifici...

## 📋 Come Usare gli Esempi

### 1. Nella Demo App

```typescript
// projects/dtl-demo-app/src/app/app.ts

// Importare l'esempio principale
import { TABLE_SCHEMA, SAMPLE_DATA } from '../../../../test-examples/firstExample';

// O un esempio specifico
import { SCHEMA, DATA } from '../../../../test-examples/extras/virtual-scroll';

export class App {
    // Usare schema e data insieme
    tableSchema = signal<DtlDataSchema>(TABLE_SCHEMA);
    sampleData = signal(SAMPLE_DATA);
}
```

### 2. Selector per Esempi (Futuro)

Implementare un selettore nella demo app:

```typescript
// Lista esempi disponibili
const EXAMPLES = [
    { id: 'first', name: 'First Example', path: 'firstExample' },
    { id: 'simple', name: 'Simple Table', path: 'extras/simple-table' },
    { id: 'virtual', name: 'Virtual Scroll', path: 'extras/virtual-scroll' },
    // ...
];

// Caricamento dinamico
async loadExample(examplePath: string) {
    const module = await import(`../../../../test-examples/${examplePath}`);
    this.tableSchema.set(module.SCHEMA || module.TABLE_SCHEMA);
    this.sampleData.set(module.DATA || module.SAMPLE_DATA);
}
```

### 3. Test Personalizzati (Futuro)

Area per permettere all'utente di inserire schema e dati custom:

```typescript
// Area custom per test utente
customSchema = signal<DtlDataSchema>({});
customData = signal<any[]>([]);

// Upload file JSON
uploadSchema(file: File) {
    // Parse e carica schema custom
}

uploadData(file: File) {
    // Parse e carica dati custom
}
```

## 📊 Esempi Disponibili

### ✅ Implementati

| Nome | Path | Descrizione | Righe | Complessità |
|------|------|-------------|-------|-------------|
| First Example | `firstExample/` | Esempio completo ordini | 50 | Media |
| Simple Table | `extras/simple-table/` | Tabella base | 5 | Base |
| Virtual Scroll | `extras/virtual-scroll/` | Performance test | 10000 | Avanzata |

### 🔄 Da Implementare

| Nome | Path | Descrizione | Priorità |
|------|------|-------------|----------|
| Advanced Features | `extras/advanced-features/` | Footer, calcoli, template | Alta |
| Large Dataset | `extras/large-dataset/` | 100k righe | Media |
| Export Test | `extras/export-test/` | Excel, CSV, preset | Alta |
| Custom Templates | `extras/custom-templates/` | HTML complessi | Media |

## 🔍 Test e Confronti

### Performance Metrics
Per ogni esempio documentare:
- Tempo rendering iniziale
- FPS durante scroll
- Memory usage
- Tempo export (se applicabile)

### Confronto con Legacy
In `comparisons/` documentare:
- Differenze di configurazione
- Mappatura proprietà
- Performance comparata
- Problemi di migrazione

## 🚀 Prossimi Step

1. **Completare esempi extras**
   - Advanced features con footer e calcoli
   - Export con vari preset
   - Template HTML complessi

2. **Implementare selector nella demo**
   - Dropdown per scegliere esempio
   - Info panel con descrizione
   - Metriche performance live

3. **Area test custom**
   - Upload schema JSON
   - Upload data CSV/JSON
   - Editor inline per modifiche

4. **Confronto con legacy**
   - Analizzare codice in `legacy-project/`
   - Creare esempi equivalenti
   - Documentare differenze

## 📝 Note per Sviluppo

### Convenzioni
- Ogni esempio DEVE avere schema e data accoppiati
- Usare `index.ts` per export e metadati
- Includere `INFO` object con descrizione
- Documentare features dimostrate

### Testing
- Testare ogni esempio nella demo app
- Verificare performance con dataset grandi
- Controllare export funzioni correttamente
- Validare responsive design

---

Questa struttura permette di:
- ✅ Mantenere schema e dati sempre accoppiati
- ✅ Facilitare l'aggiunta di nuovi esempi
- ✅ Permettere selezione dinamica nella demo
- ✅ Supportare test personalizzati utente