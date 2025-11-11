# Sistema di Button Styling - NgxDataTableLight

Sistema CSS indipendente per i bottoni, senza dipendenza da Bootstrap.

## 📋 Caratteristiche

- ✅ **Indipendente da Bootstrap** - Funziona standalone
- ✅ **Classi di default configurabili** - Definisci lo stile base a livello di schema
- ✅ **Override selettivo** - Ogni bottone può sovrascrivere le classi di default
- ✅ **Stili moderni** - Effetti hover, focus, disabled
- ✅ **Varianti multiple** - Primary, Secondary, Success, Danger, Warning, Info, Light, Dark
- ✅ **Dimensioni** - Small, Normal, Large
- ✅ **Outline variant** - Bottoni con solo bordo

## 🎨 Classi Disponibili

### Classe Base
```css
.dtl-btn - Classe base obbligatoria per tutti i bottoni
```

### Varianti di Colore
```css
.dtl-btn-primary     // Blu
.dtl-btn-secondary   // Grigio
.dtl-btn-success     // Verde
.dtl-btn-danger      // Rosso
.dtl-btn-warning     // Giallo
.dtl-btn-info        // Ciano
.dtl-btn-light       // Bianco
.dtl-btn-dark        // Nero
.dtl-btn-default     // Outline grigio
```

### Varianti Outline
```css
.dtl-btn-outline-primary
.dtl-btn-outline-secondary
.dtl-btn-outline-success
.dtl-btn-outline-danger
.dtl-btn-outline-warning
.dtl-btn-outline-info
```

### Dimensioni
```css
.dtl-btn-sm  // Piccolo
.dtl-btn     // Normale (default)
.dtl-btn-lg  // Grande
```

### Speciali
```css
.dtl-btn-icon  // Bottone solo icona (quadrato)
```

## 🚀 Utilizzo

### 1. Definire le Classi di Default nello Schema

```typescript
const TABLE_SCHEMA: DtlDataSchema = {
  // Classi applicate a TUTTI i bottoni che non hanno classi specifiche
  buttonDefaultClasses: ['dtl-btn', 'dtl-btn-sm', 'dtl-btn-primary'],

  columns: [...],
  buttons: [...]
}
```

### 2. Bottone con Classi di Default

```typescript
{
  name: "view",
  callback: "viewDetails",
  iconClass: ["fa", "fa-eye"],
  // Nessuna classe specificata = usa buttonDefaultClasses
  title: "Visualizza"
}
```
**Risultato**: Usa `['dtl-btn', 'dtl-btn-sm', 'dtl-btn-primary']`

### 3. Bottone con Override Completo

```typescript
{
  name: "delete",
  callback: "deleteItem",
  iconClass: ["fa", "fa-trash"],
  class: ['dtl-btn', 'dtl-btn-sm', 'dtl-btn-danger'], // Override completo
  title: "Elimina"
}
```
**Risultato**: Usa `['dtl-btn', 'dtl-btn-sm', 'dtl-btn-danger']` (ignora le default)

### 4. Bottone con Oggetto di Classi

```typescript
{
  name: "export",
  callback: "exportData",
  iconClass: ["fa", "fa-download"],
  class: {
    'dtl-btn': true,
    'dtl-btn-lg': true,
    'dtl-btn-success': true
  },
  title: "Esporta"
}
```

## 📚 Esempi Completi

### Esempio 1: Tutti i bottoni con lo stesso stile di default

```typescript
const schema: DtlDataSchema = {
  buttonDefaultClasses: ['dtl-btn', 'dtl-btn-sm', 'dtl-btn-primary'],

  buttons: [
    {
      name: "edit",
      callback: "edit",
      iconClass: ["fa", "fa-edit"],
      // Usa default: blu piccolo
    },
    {
      name: "view",
      callback: "view",
      iconClass: ["fa", "fa-eye"],
      // Usa default: blu piccolo
    }
  ]
}
```

### Esempio 2: Mix di default e override

```typescript
const schema: DtlDataSchema = {
  buttonDefaultClasses: ['dtl-btn', 'dtl-btn-sm', 'dtl-btn-secondary'],

  buttons: [
    {
      name: "edit",
      callback: "edit",
      iconClass: ["fa", "fa-edit"],
      // Usa default: grigio piccolo
    },
    {
      name: "delete",
      callback: "delete",
      iconClass: ["fa", "fa-trash"],
      class: ['dtl-btn', 'dtl-btn-sm', 'dtl-btn-danger'],
      // Override: rosso piccolo
    },
    {
      name: "approve",
      callback: "approve",
      iconClass: ["fa", "fa-check"],
      class: ['dtl-btn', 'dtl-btn-lg', 'dtl-btn-success'],
      // Override: verde grande
    }
  ]
}
```

### Esempio 3: Bottoni outline

```typescript
const schema: DtlDataSchema = {
  buttonDefaultClasses: ['dtl-btn', 'dtl-btn-outline-primary'],

  buttons: [
    {
      name: "info",
      callback: "showInfo",
      text: "Info",
      // Usa default: outline blu
    },
    {
      name: "warning",
      callback: "showWarning",
      text: "Attenzione",
      class: ['dtl-btn', 'dtl-btn-outline-warning'],
      // Override: outline giallo
    }
  ]
}
```

## 🎯 Comportamento del Sistema

### Priorità delle Classi

1. **Se il bottone ha `class` definito** → Usa quelle classi (override completo)
2. **Altrimenti, se lo schema ha `buttonDefaultClasses`** → Usa quelle
3. **Altrimenti** → Fallback su `['dtl-btn', 'dtl-btn-sm', 'dtl-btn-primary']`

### Importante: Override è Completo

Quando specifichi `class` su un bottone, **sostituisce completamente** le classi di default.
Non c'è merge, è un override totale.

```typescript
// Schema
buttonDefaultClasses: ['dtl-btn', 'dtl-btn-sm', 'dtl-btn-primary']

// Bottone
{
  name: "test",
  class: ['dtl-btn-danger'] // ❌ MANCA dtl-btn e dtl-btn-sm!
}
```

**Buona pratica**: Includere sempre almeno `dtl-btn` quando fai override.

## 🔧 Personalizzazione CSS

Puoi estendere gli stili in un tuo file SCSS:

```scss
// my-custom-buttons.scss

// Nuovo colore personalizzato
.dtl-btn-custom {
  color: #fff;
  background-color: #ff6b6b;
  border-color: #ff6b6b;

  &:hover:not(:disabled) {
    background-color: #ff5252;
    border-color: #ff4444;
  }
}

// Dimensione extra small
.dtl-btn-xs {
  padding: 0.125rem 0.25rem;
  font-size: 0.65rem;
  border-radius: 0.15rem;
}
```

Poi usalo nello schema:

```typescript
buttonDefaultClasses: ['dtl-btn', 'dtl-btn-xs', 'dtl-btn-custom']
```

## 💡 Tips

1. **Consistenza**: Usa `buttonDefaultClasses` per uno stile uniforme
2. **Semantica**: Usa i colori in modo semantico (danger per delete, success per save, etc.)
3. **Accessibilità**: Usa sempre `title` per aiutare screen readers
4. **Performance**: Le classi sono più performanti dei style inline
5. **Maintenance**: Centralizza gli stili nei CSS invece di inline styles

## 🆚 Bootstrap vs DTL

Se hai Bootstrap nel progetto, puoi continuare ad usare le sue classi:

```typescript
// Con Bootstrap
buttonDefaultClasses: ['btn', 'btn-sm', 'btn-primary']

// Con DTL (senza Bootstrap)
buttonDefaultClasses: ['dtl-btn', 'dtl-btn-sm', 'dtl-btn-primary']

// Mix (funziona ma non raccomandato)
buttonDefaultClasses: ['dtl-btn', 'btn-sm', 'dtl-btn-primary']
```

## 📦 Compatibilità

- ✅ Angular 20+
- ✅ Zoneless
- ✅ Standalone components
- ✅ SSR compatible
- ✅ IE11+ (con polyfills)
