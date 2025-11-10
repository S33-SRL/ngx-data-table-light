/**
 * WRAPPER per il componente legacy DataTableLight
 *
 * Questo file serve solo per correggere i riferimenti e permettere
 * l'utilizzo del componente legacy nella demo senza modificare il codice originale.
 *
 * Il componente originale resta intatto in data-table-light.component.ts
 */

import { CurrencyPipe, NgClass, NgStyle, NgTemplateOutlet, DecimalPipe, DatePipe } from "@angular/common";
import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild, afterRender } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownButtonItem, NgbDropdownItem, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { UiScrollModule } from 'ngx-ui-scroll';

// Import locali corretti per il legacy
import { InterpolateService } from "../functions/iterpolate-service";
import { CsvConfigConsts, JsonService } from "../functions/json-to-csv-service";
import { deepClone, isEmptyObjectJson, newGuid, replaceAll } from "../functions/share-functions";

// Import dei modelli legacy
import { DtlColumnSchema } from "./models/DtlColumnSchema";
import { DtlDataSchema } from "./models/DtlDataSchema";
import { DtlFunctions } from "./models/DtlFunctions";
import { DtlExportButtonSchema } from "./models/DtlExportButtonSchema";
import { DtlFooterRow } from "./models/DtlFooterRow";

// Componenti mancanti che dobbiamo gestire
// import { SafePipe } from "../../pipes/safe.pipe";
// import { CheckListSelectorComponent } from "../check-list-selector/check-list-selector/check-list-selector.component";
// import { CheckListSelectorItem } from "../check-list-selector/models/check-list-selector-item";

// Note: Il componente legacy originale resta in data-table-light.component.ts
// Questo è solo un wrapper per correggere i riferimenti

export {
    DtlColumnSchema,
    DtlDataSchema,
    DtlFunctions,
    DtlExportButtonSchema,
    DtlFooterRow
};

// Per ora esportiamo solo i modelli per analisi
// Il componente completo richiederà ulteriori dipendenze