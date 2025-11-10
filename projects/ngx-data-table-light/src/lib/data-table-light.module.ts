import { NgModule } from '@angular/core';
import { NgxDataTableLightComponent } from './components/data-table-light.component';

/**
 * Optional NgModule for legacy (non-standalone) applications
 * Angular 20 recommends standalone components, but this provides compatibility
 */
@NgModule({
  imports: [NgxDataTableLightComponent],
  exports: [NgxDataTableLightComponent]
})
export class NgxDataTableLightModule { }