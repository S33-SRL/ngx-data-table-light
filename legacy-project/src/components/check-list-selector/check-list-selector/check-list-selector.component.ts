import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CheckListSelectorItem } from '../models/check-list-selector-item';

/**
 * Componente per selezione multipla con checklist
 * Usato per selezionare colonne da esportare
 */
@Component({
  selector: 'app-check-list-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ title }}</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <div class="form-check" *ngFor="let item of items">
        <input
          class="form-check-input"
          type="checkbox"
          [(ngModel)]="item.selected"
          [id]="'check-' + item.value"
        />
        <label class="form-check-label" [for]="'check-' + item.value">
          {{ item.displayText }}
        </label>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">
        Annulla
      </button>
      <button type="button" class="btn btn-primary" (click)="confirm()">
        Conferma
      </button>
    </div>
  `,
  styles: [`
    .form-check {
      margin-bottom: 8px;
    }
  `]
})
export class CheckListSelectorComponent {
  @Input() title = 'Seleziona';
  @Input() items: CheckListSelectorItem[] = [];

  constructor(public activeModal: NgbActiveModal) {}

  confirm(): void {
    const selected = this.items.filter(item => item.selected);
    this.activeModal.close(selected);
  }
}
