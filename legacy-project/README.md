# Legacy DataTable Project

Questa cartella contiene il progetto legacy del componente DataTable per permettere confronti e analisi delle differenze con la nuova versione DataTableLight.

## Struttura

```
legacy-project/
├── src/                    # Codice sorgente del vecchio progetto
│   ├── data-table-light/  # Componente DataTable legacy
│   └── functions/         # Funzioni di supporto utilizzate dal componente
└── docs/                  # Documentazione originale (se disponibile)
```

## Contenuto Attuale

### src/data-table-light/
Contiene la versione legacy del componente DataTable

### src/functions/
Contiene le funzioni di supporto e utility utilizzate dal componente legacy, incluso probabilmente il sistema di templating

## Note per il confronto

### Differenze principali da analizzare:
1. **Sistema di templating**: Il vecchio progetto usa funzioni custom per il templating
2. **Struttura dei modelli**: Confrontare le interfacce e i tipi
3. **Performance**: Valutare miglioramenti nel virtual scrolling
4. **Funzionalità**: Identificare feature mancanti o diverse
5. **API**: Differenze nell'interfaccia pubblica

## Sistema di Templating Legacy

### Funzioni in src/functions/:
Documentare qui le funzioni principali trovate e il loro utilizzo:
- Funzione 1: [descrizione]
- Funzione 2: [descrizione]
- Sistema di interpolazione: [come funziona]

### Sintassi del templating legacy:
```
// Esempi della vecchia sintassi (DA COMPLETARE)
{{variabile}}           -> Interpolazione semplice
{{obj.property}}        -> Path nidificati
// altri esempi...
```

## Dipendenze del progetto legacy

```json
{
  "dependencies": {
    // DA COMPLETARE analizzando il codice legacy
    "angular": "versione?",
    // altre dipendenze...
  }
}
```

## Analisi del Codice Legacy

### Componenti principali:
- [ ] Identificare il componente principale
- [ ] Mappare i servizi utilizzati
- [ ] Documentare le direttive custom
- [ ] Analizzare il sistema di templating

### Funzionalità supportate:
- [ ] Tipi di colonna
- [ ] Sistema di filtri
- [ ] Ordinamento
- [ ] Paginazione
- [ ] Virtual scrolling
- [ ] Export
- [ ] Footer
- [ ] Template personalizzati