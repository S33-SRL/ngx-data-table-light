import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDataTableLightComponent, DtlDataSchema } from 'ngx-data-table-light';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

@Component({
  selector: 'app-schema-data-input',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxDataTableLightComponent],
  template: `
    <div class="schema-data-container">
      <h2>Generatore Tabella da Schema e Dati</h2>

      <div class="inputs-container">
        <!-- Schema Input -->
        <div class="input-section">
          <div class="input-header">
            <h3>Schema (DtlDataSchema)</h3>
            <button
              class="btn btn-sm btn-secondary"
              (click)="loadExampleSchema()"
              type="button">
              Carica Esempio
            </button>
          </div>
          <textarea
            [(ngModel)]="schemaInput"
            class="form-control code-input"
            placeholder="Inserisci lo schema JSON qui..."
            rows="15"
            spellcheck="false"></textarea>
        </div>

        <!-- Data Input -->
        <div class="input-section">
          <div class="input-header">
            <h3>Dati (Array)</h3>
            <button
              class="btn btn-sm btn-secondary"
              (click)="loadExampleData()"
              type="button">
              Carica Esempio
            </button>
          </div>
          <textarea
            [(ngModel)]="dataInput"
            class="form-control code-input"
            placeholder="Inserisci i dati JSON qui (array di oggetti)..."
            rows="15"
            spellcheck="false"></textarea>
        </div>
      </div>

      <!-- Validation Button -->
      <div class="validation-section">
        <button
          class="btn btn-primary btn-lg"
          (click)="validateAndGenerate()"
          type="button">
          Valida e Genera Tabella
        </button>
        <button
          class="btn btn-outline-secondary btn-lg ms-3"
          (click)="clearAll()"
          type="button">
          Pulisci Tutto
        </button>
      </div>

      <!-- Validation Results -->
      @if (validationResult()) {
        <div class="validation-results">
          @if (validationResult()!.errors.length > 0) {
            <div class="alert alert-danger">
              <h4>❌ Errori di Validazione:</h4>
              <ul>
                @for (error of validationResult()!.errors; track $index) {
                  <li>{{ error }}</li>
                }
              </ul>
            </div>
          }

          @if (validationResult()!.warnings.length > 0) {
            <div class="alert alert-warning">
              <h4>⚠️ Avvertimenti:</h4>
              <ul>
                @for (warning of validationResult()!.warnings; track $index) {
                  <li>{{ warning }}</li>
                }
              </ul>
            </div>
          }

          @if (validationResult()!.isValid) {
            <div class="alert alert-success">
              <h4>✅ Validazione Completata con Successo!</h4>
              <p>Lo schema e i dati sono compatibili. La tabella è stata generata sotto.</p>
            </div>
          }
        </div>
      }

      <!-- Generated Table -->
      @if (showTable()) {
        <div class="generated-table">
          <h3>Tabella Generata</h3>
          <div class="table-wrapper">
            <ngx-data-table-light
              [dataSource]="parsedData()"
              [tableSchema]="parsedSchema()!"
              (events)="onTableEvent($event)">
            </ngx-data-table-light>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .schema-data-container {
      padding: 20px;
      max-width: 1600px;
      margin: 0 auto;
    }

    h2 {
      margin-bottom: 30px;
      color: #333;
      text-align: center;
    }

    .inputs-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .input-section {
      display: flex;
      flex-direction: column;
    }

    .input-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .input-header h3 {
      margin: 0;
      font-size: 1.2rem;
      color: #555;
    }

    .code-input {
      font-family: 'Courier New', Consolas, monospace;
      font-size: 13px;
      resize: vertical;
      background-color: #f8f9fa;
      border: 2px solid #dee2e6;
      border-radius: 4px;
    }

    .code-input:focus {
      background-color: #fff;
      border-color: #80bdff;
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    .validation-section {
      text-align: center;
      margin: 30px 0;
    }

    .validation-results {
      margin: 20px 0;
    }

    .alert h4 {
      font-size: 1.1rem;
      margin-bottom: 10px;
    }

    .alert ul {
      margin-bottom: 0;
      padding-left: 20px;
    }

    .alert li {
      margin-bottom: 5px;
    }

    .generated-table {
      margin-top: 30px;
      padding-top: 30px;
      border-top: 3px solid #dee2e6;
    }

    .generated-table h3 {
      margin-bottom: 20px;
      color: #333;
    }

    .table-wrapper {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 992px) {
      .inputs-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SchemaDataInputComponent {
  schemaInput = '';
  dataInput = '';

  validationResult = signal<ValidationResult | null>(null);
  parsedSchema = signal<DtlDataSchema | null>(null);
  parsedData = signal<any[]>([]);
  showTable = computed(() =>
    this.validationResult()?.isValid &&
    this.parsedSchema() !== null &&
    this.parsedData().length > 0
  );

  validateAndGenerate() {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Reset state
    this.parsedSchema.set(null);
    this.parsedData.set([]);

    // Validate Schema
    let schema: DtlDataSchema | null = null;
    try {
      if (!this.schemaInput.trim()) {
        errors.push('Lo schema è vuoto. Inserisci un oggetto DtlDataSchema valido.');
      } else {
        schema = JSON.parse(this.schemaInput);

        // Validate schema structure
        if (typeof schema !== 'object' || schema === null) {
          errors.push('Lo schema deve essere un oggetto.');
        } else {
          // Check for columns array
          if (!schema.columns || !Array.isArray(schema.columns)) {
            errors.push('Lo schema deve contenere un array "columns".');
          } else if (schema.columns.length === 0) {
            warnings.push('Lo schema non ha colonne definite.');
          }

          // Validate column fields
          const columnFields = schema.columns
            ?.filter(col => col.field)
            .map(col => col.field) || [];

          if (columnFields.length === 0 && schema.columns && schema.columns.length > 0) {
            warnings.push('Nessuna colonna ha un campo "field" definito.');
          }
        }
      }
    } catch (e: any) {
      errors.push(`Errore nel parsing dello schema: ${e.message}`);
    }

    // Validate Data
    let data: any[] = [];
    try {
      if (!this.dataInput.trim()) {
        errors.push('I dati sono vuoti. Inserisci un array di oggetti.');
      } else {
        data = JSON.parse(this.dataInput);

        if (!Array.isArray(data)) {
          errors.push('I dati devono essere un array.');
        } else if (data.length === 0) {
          warnings.push('L\'array dei dati è vuoto.');
        }
      }
    } catch (e: any) {
      errors.push(`Errore nel parsing dei dati: ${e.message}`);
    }

    // Check compatibility between schema and data
    if (schema && Array.isArray(data) && data.length > 0) {
      const columnFields = schema.columns
        ?.filter(col => col.field)
        .map(col => col.field!) || [];

      const dataFields = Object.keys(data[0] || {});

      if (columnFields.length > 0 && dataFields.length > 0) {
        // Check if schema fields exist in data
        const missingFields = columnFields.filter(field => {
          // Support nested fields like "stakeholders[0].stakeholder.name"
          const baseField = field!.split('[')[0].split('.')[0];
          return !dataFields.includes(baseField);
        });

        if (missingFields.length > 0) {
          warnings.push(
            `Alcuni campi dello schema non sono presenti nei dati: ${missingFields.join(', ')}`
          );
        }

        // Check for unused data fields
        const unusedFields = dataFields.filter(field =>
          !columnFields.some(colField => {
            const baseField = colField!.split('[')[0].split('.')[0];
            return baseField === field;
          })
        );

        if (unusedFields.length > 0) {
          warnings.push(
            `Alcuni campi dei dati non sono usati nello schema: ${unusedFields.slice(0, 5).join(', ')}${unusedFields.length > 5 ? '...' : ''}`
          );
        }
      }
    }

    // Set validation result
    const isValid = errors.length === 0 && schema !== null && Array.isArray(data);

    this.validationResult.set({
      isValid,
      errors,
      warnings
    });

    // If valid, set parsed data for table rendering
    if (isValid) {
      this.parsedSchema.set(schema!);
      this.parsedData.set(data);
    }
  }

  loadExampleSchema() {
    const exampleSchema = {
      tableClass: ["table", "table-bordered", "table-striped"],
      theadStyle: {
        "background-color": "#e6e6e6"
      },
      resizable: true,
      selectRows: "none",
      maxRows: 10,
      maxRowsOptions: [10, 20, 50, 100],
      columns: [
        {
          name: "ID",
          field: "id",
          type: "number",
          canOrder: true,
          canFilter: true
        },
        {
          name: "Nome",
          field: "name",
          type: "string",
          canOrder: true,
          canFilter: true
        },
        {
          name: "Email",
          field: "email",
          type: "string",
          canFilter: true
        },
        {
          name: "Data",
          field: "date",
          type: "date",
          canOrder: true
        },
        {
          name: "Importo",
          field: "amount",
          type: "currency",
          canOrder: true
        }
      ]
    };

    this.schemaInput = JSON.stringify(exampleSchema, null, 2);
  }

  loadExampleData() {
    const exampleData = [
      {
        id: 1,
        name: "Mario Rossi",
        email: "mario.rossi@example.com",
        date: "2025-01-15T10:30:00",
        amount: 1250.50
      },
      {
        id: 2,
        name: "Laura Bianchi",
        email: "laura.bianchi@example.com",
        date: "2025-02-20T14:15:00",
        amount: 890.00
      },
      {
        id: 3,
        name: "Giuseppe Verdi",
        email: "giuseppe.verdi@example.com",
        date: "2025-03-10T09:00:00",
        amount: 2150.75
      },
      {
        id: 4,
        name: "Anna Neri",
        email: "anna.neri@example.com",
        date: "2025-04-05T16:45:00",
        amount: 560.25
      },
      {
        id: 5,
        name: "Francesco Gialli",
        email: "francesco.gialli@example.com",
        date: "2025-05-12T11:20:00",
        amount: 3200.00
      }
    ];

    this.dataInput = JSON.stringify(exampleData, null, 2);
  }

  clearAll() {
    this.schemaInput = '';
    this.dataInput = '';
    this.validationResult.set(null);
    this.parsedSchema.set(null);
    this.parsedData.set([]);
  }

  onTableEvent(event: any) {
    console.log('Table event:', event);
  }
}
