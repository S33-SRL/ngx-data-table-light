import { CurrencyPipe, NgClass, NgStyle, NgTemplateOutlet, DecimalPipe, DatePipe } from "@angular/common";
// import { ConstantPool } from "@angular/compiler";
import { afterRender, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownButtonItem, NgbDropdownItem, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { InterpolateService } from "app/shared/functions/iterpolate-service";
import { CsvConfigConsts, JsonService } from "app/shared/functions/json-to-csv-service";
import { deepClone, isEmptyObjectJson, newGuid, replaceAll } from "app/shared/functions/share-functions";

import { DtlColumnSchema } from "./models/DtlColumnSchema";
import { DtlDataSchema } from "./models/DtlDataSchema";
import { DtlFunctions } from "./models/DtlFunctions";
import { DtlExportButtonSchema } from "./models/DtlExportButtonSchema";
//@ts-ignore
import ExcelExport from 'export-xlsx';
//@ts-ignore
import { defaultDataType } from 'export-xlsx';
import BigNumber from 'bignumber.js';
import { environment } from "environments/environment";
import { Datasource, UiScrollModule } from 'ngx-ui-scroll';
import moment from "moment";
import { SafePipe } from "../../pipes/safe.pipe";
import { CheckListSelectorComponent } from "../check-list-selector/check-list-selector/check-list-selector.component";
import { CheckListSelectorItem } from "../check-list-selector/models/check-list-selector-item";
import { DtlFooterRow } from "./models/DtlFooterRow";
import { debounceTime, Subject } from "rxjs";

@Component({
    selector: "app-data-table-light-legacy",  // Rinominato per evitare conflitti
    templateUrl: "./data-table-light.component.html",
    styleUrls: ["./data-table-light.component.scss", "./data-table-light-customization.scss"],
    standalone: true,
    imports: [
    NgClass,
    NgStyle,
    FormsModule,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownButtonItem,
    NgbDropdownItem,
    UiScrollModule,
    NgTemplateOutlet,
    NgSelectModule,
    DecimalPipe,
    CurrencyPipe,
    DatePipe,
    SafePipe,
    CheckListSelectorComponent
],
})
export class DataTableLightComponent implements OnInit, OnDestroy {

  @ViewChild('tableContainer', { static: false }) tableContainerRef!: ElementRef;

  @Input() devMode: boolean = environment.datagridDevMode || false;
  @Input() tabTitle: string | undefined;
  source: Array<any> = [];

  maxBottonsWidth: number = 0;
  width: number = 0;

  footerCollapsed: boolean = false;
  footerProcessedRows: any[] = [];
  footerBoxesProcessed: any[] = [];

  private global_last_tooltip_user :any;
  private interpolate;
  public setInterpolateFunction(func: any) {
    this.interpolate.setFunctions(func);
  }

  public resetFooter(){
    this.footerHeightComputed = false; 
  }

  public maxRowsoptionModel: any;

  initRow(index: number, rowData: any, oldRow: any = null,otherData:any = null) {
    this.interpolate.cleanCache();
    let row = oldRow || { _mainIndex_: rowData._mainIndex_ };
    row._index_ = index;
    row["_source"] = rowData;
    // elaborate column data interpolation
    this.schema?.columns?.forEach((col) => {
      if(col.field){
        if (col.fieldPath) {
          row[col.field] = this.interpolate.parserStringNasted(col.fieldPath, rowData,otherData);
        } else {
          row[col.field] = rowData[col.field];
        }  
      }
      
      if (col.sortField) {
        row[col.sortField] = col.sortFieldPath ? this.interpolate.parserStringNasted(col.sortFieldPath, rowData,otherData) : rowData[col.sortField];
      }

      if (col.type == "check" && (col.horizontalAlign === null || col.horizontalAlign === undefined || col.horizontalAlign === "")) 
        col.horizontalAlign = "center";
    });

    return row;
  }

  updateListData(sourceArray: any[], updatedSchema: boolean = false) {
    let sourderData: any[] = [...sourceArray];

    this.ProcessHeader();

    if (this.schema?.columns) {
      let rows:any = [];
      let index = 0;
      sourderData.forEach((rowData) => {
        let row = this.initRow(index++, rowData, null, this.schema?.otherData);
        rows.push(row);
      });
      this.filteredRows = rows;
    } else {
      this.filteredRows = sourderData;
    }

    if (this.filteredRows) {
      if (this.schema &&  !isEmptyObjectJson(this.schema.filters)) {
        this.filteredRows = this.filteredRows.filter((elemento) => {
          return this.filterSorce(elemento);
        });
      }
      if (updatedSchema) {
        this.lastOrder = {field: null, descending: false};  // Pulisco ordinamento schema precedente reinizializzando valori iniziali
        if (this.schema?.defaultOrderField) {
          if (this.schema.defaultOrderField[0] == "-") {
            this.lastOrder.descending = false;
            this.ChangeOrderBy(this.schema.defaultOrderField.replace("-", ""), false);
          } else {
            this.ChangeOrderBy(this.schema.defaultOrderField.replace("+", ""), true);
          }
        } else {
          this.paginateTables();
          this.processFooter();
          this.processFooterBoxes();
        }
      } else {
        if (this.lastOrder.field) {  // Se cambia il source riapplico ordinamento corrente
          this.lastOrder.descending = !this.lastOrder.descending;
          this.ChangeOrderBy(this.lastOrder.field, false);
        } else {
          this.paginateTables();
          this.processFooter();
          this.processFooterBoxes();
        }
      }
    }

    this.ChangeSelectedMultiRow();
  }

  @Input() set dataSource(val: Array<any>) {
    var i = 0;
    this.source = val
      ? val.map((x) => {
          let row = { _mainIndex_: i++, ...x };
          return row;
        })
      : [];

    if (this.schema?.columns) this.updateListData(this.source);
  }

  schema: DtlDataSchema | undefined | null= null;
  @Input() set tableSchema(base: DtlDataSchema) {
    let value = { ...base };
    if (value?.columns) {
      let widths = this.getSchemaWidths(value);
      value.theadStyle = {
        ...value.theadStyle,
        ...{ display: "grid", "grid-template-columns": widths.tempCol },
      };

      value.tbodyStyle = {
        ...value.tbodyStyle,
        ...{ display: "grid", "grid-template-columns": widths.tempCol },
      };

      /*Override di Filippo: se possibile, preferisco che la griglia diventi scrollabile piuttosto che esca dallo schermo*/
      widths.minWidth = 200; // Commentare se non vi va a genio
      value.tableStyle = {
        ...{ "min-width": `${widths.minWidth}px` },
        ...value.tableStyle,
      };
    }
    //console.log("table schema", value);
    this.schema = { ...value, filters: {} };
    
    if (this.schema?.virtualScroll && this.schema) {
      this.schema.maxRows = null;
    }
    else if (this.schema?.maxRowsOptions) {
      if(this.schema.maxRowsOptions.indexOf(this.schema.maxRows)>0)
      {
        this.maxRowsoptionModel = this.schema.maxRows;
      }
      else {
        this.maxRowsoptionModel = this.schema.maxRowsOptions[0];
        this.schema.maxRows = this.schema.maxRowsOptions[0];
      }
    }

    this.ProcessHeader();
    if (this.source) {
      this.updateListData(this.source, true);
    }
  }
  private getSchemaWidths(value: DtlDataSchema): {minWidth: number, tempCol: string | undefined | null} {
    let i = 0;
    let keys = Object.keys(value?.columns ||{});
    let values = [];
    let minWidth: any = 0;
    while (keys[i] && value?.columns) {
      let n : any | number= keys[i] || "";
      if (!value?.columns[n]?.hide) {
        let width = value?.columns[n]?.width || 100;
        if (width) {
          if (typeof width != "string") {
            if (typeof width === 'number') {
              width = `${width}px`;
              minWidth += width;
            } else {
              let min: string;
              let minNumber: number;
              if (typeof width.min === 'number') {
                min = `${width.min}px`;
                minNumber = width.min;
              } else {
                min = width.min;
                minNumber = <any>width.min.replace("px", "") * 1;
              }
              let max = typeof width.max === 'number' ? `${width.max}px` : width.max;
              width = `minmax(${min},${max})`;
              minWidth += minNumber;
            }
          } else {
            minWidth += <any>width.replace("px", "") * 1;
          }
        } else {
          width = "1fr";
          minWidth += 100;
        }

        values.push(width);
      }
      i++;
    }

    if(this.maxBottonsWidth && this.maxBottonsWidth > 0){
      let finalMmaxBottonsWidth = this.maxBottonsWidth + 27;
          values.push(`${finalMmaxBottonsWidth}px`);
          minWidth += finalMmaxBottonsWidth + 20;
    }
    else{
      if (value.buttons && value.buttons.length > 0) {
        let w = 0;
        value.buttons.forEach((x) => {
          w += x.width || 50;
        });
        if (w > 0) {
          w = w + 15;
          values.push(`${w}px`);
          minWidth += w + 20;
        } else {
          values.push("80px");
          minWidth += 80;
        }
      }
      else if(value?.exportButtons){
        values.push("80px");
        minWidth += 80;
      }
    }

    let tempCol = values.length == 0 ? null : values.join(" ");
    return {minWidth, tempCol};
  }

  @Input() functions: DtlFunctions | undefined | null = null;
  @Output() events = new EventEmitter<any>();

  private _shwrows: Array<any> = [];
  public set showedRows(val: any[]) {
    this._shwrows = val || [];
    (<any>this.virtualScrollDataSource.adapter).reload();
  }
  public get showedRows() { return this._shwrows; }
  public filteredRows: Array<any> = [];
  public virtualScrollDataSource = new Datasource<any>({
    get: (index: any, count:any, success:any) => {
      const data = [];
      for (let i = index; i <= index + count - 1; i++) {
        if (this.showedRows[i])
          data.push(this.showedRows[i]);
      }
      ////console.log('Get righe dataSource bro', data);
      success(data);
      let container = document.getElementById(this.tableBodyContainerID);
      this.setHeaderPadding = container && container.scrollHeight > container.getBoundingClientRect().height;
    },
    settings: {
      startIndex: 0,
      minIndex: 0,
      bufferSize: 10
    }
  });
  public currentPage: number = 1;
  public totalRows: number = 0;
  public totalPages: number = 0;
  public pagerPages: Array<any> = [];
  public lastOrder: any = { field: null, descending: false };

  public selectAll: boolean = false;

  public tooltipID: string;
  public tableHeaderID: string;
  public tableContainerID: string;
  public tableBodyContainerID: string;
  public tableFooterContainerID: string;
  public tableFooterRowsContainerID: string;
  public tableFooterBoxesContainerID: string;
  public setHeaderPadding: boolean | undefined | null;
  private boundScrollHandler: any;

  private renderComplete$ = new Subject<void>();
  private footerHeightComputed: boolean = false;

  constructor(currencyPipe: CurrencyPipe, private modalService: NgbModal) {
    this.interpolate = new InterpolateService(currencyPipe);
    this.tooltipID = newGuid();
    this.tableHeaderID = newGuid();
    this.tableContainerID = newGuid();
    this.tableBodyContainerID = newGuid();
    this.tableFooterContainerID = newGuid();
    this.tableFooterRowsContainerID = newGuid();
    this.tableFooterBoxesContainerID = newGuid();

    afterRender(() => {
      if(!this.footerHeightComputed && (this.schema?.footerRows || this.schema?.footerBoxes)){
        this.renderComplete$.next();
      }
    })
    
    this.renderComplete$.pipe(
      debounceTime(10)
    ).subscribe(() => {
      this.calculeteFooterHeight();
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const containerEl = this.tableContainerRef?.nativeElement;
    if (containerEl) {
      this.boundScrollHandler = this.onTableScroll.bind(this);
      containerEl.addEventListener('scroll', this.boundScrollHandler);
    }
  }

  ngOnDestroy(): void {
    const containerEl = this.tableContainerRef?.nativeElement;
    if (containerEl && this.boundScrollHandler) {
      containerEl.removeEventListener('scroll', this.boundScrollHandler);
    }
  }

  @HostListener("click", ["$event"])
    onClick(e: any) {
    let customerClick = e.target.getAttribute("(click)");
    if(!customerClick) customerClick = e.target.parentNode.getAttribute("(click)");
    e.preventDefault();
    if (!!customerClick)
    {
      if(typeof customerClick == 'string'){
        let array = customerClick.split(',');
        if(array.length==2){
          let item = this.source[(<any>array[0])*1]["_source"] || this.source[(<any>array[0])*1];
          this.CallbackEvents(array[1],'row', item);
        }
      }

    }
  }

  private initColumns(rows: Array<any>): Array<DtlColumnSchema> {
    var result: Array<DtlColumnSchema> = [];
    if (rows) {
      let keys = Object.keys(rows[0]);
      let k = 0;
      while (keys[k]) {
        result.push(<DtlColumnSchema>{
          name: keys[k],
          field: keys[k],
          canOrder: false,
          canFilter: false,
        });
        k++;
      }
    }
    return result;
  }

  private filterSorce(el:any) {
    if (!this.schema?.columns) return false;
    let f = 0;
    if(!this.schema!.filters) return false;
    while (this.schema.columns[f]) {
      if(this.schema.columns[f].canFilter && this.schema?.columns[f]?.field) 
      {
        let fieldName : string= this.schema.columns[f].field as string;
        //let field : string =  this.schema!.columns[f]!.field as string;
        
        if (
          fieldName &&
          this.schema.filters[fieldName + "Filter"] &&
          this.schema.filters[fieldName + "Filter"] != ""
        ) {
          
          let fiedFilter = this.schema.filters[fieldName + "Filter"];
  
          let fieldType = this.schema.columns[f].filterForcedType || typeof el[fieldName];
  
          switch (fieldType) {
            case "number":
              {
                if (el[fieldName] != fiedFilter) return false;
              }
              break;
            default: {
              if (
                (el[fieldName] + "")
                  .toLowerCase()
                  .indexOf((this.schema.filters[fieldName + "Filter"] + "").toLowerCase()) === -1
              )
                return false;
            }
          }
        }
      }      
      f++;
    }
    return true;
  }

  filterInputChange(inputEvent:any, fielName : any) {
    this.ChangeFilter(inputEvent?.target?.value, fielName);
  }

  public ChangeFilter(event:any, fielName:any) {
    if (fielName) {
      if (!this.schema) return;
      if (!this.schema.filters) this.schema.filters = {};
      this.schema.filters[fielName + "Filter"] = event.srcElement?.value;
    }
    
    this.updateListData(this.source);
    // //console.log("ChangeFilter filteredRows",filtered);

    // this.filteredRows = filtered;
    // this.paginateTables();
  }

  public CleanFilter() {
    let f = 0;
    let keys = Object.keys(this.schema?.filters);

    while (keys[f]) {
      this.schema!.filters[keys[f]] = null;
      f++;
    }
    this.schema!.filters = {};
    this.updateListData(this.source);
  }

  private orderFunction(a:any, b:any, name:string): number {
    let result = 0;
    let notA: boolean = (a[name] === null || a[name] === undefined || a[name]==="");
    let notB: boolean = (b[name] === null || b[name] === undefined || b[name]==="");
    if (notA && notB)
      result = 0;
    else if (notA && !notB) 
      result = -1;
    else if (!notA && notB)
      result = 1;
    else {
      switch (typeof a[name]) {
        case "boolean":
          result = (a[name] ? 1 : 0) - (b[name] ? 1 : 0);
          break;
        case "bigint":
        case "number":
          result = new BigNumber(Number(a[name])).minus(Number(b[name])).toNumber();
          break;
        case "string":
          if ((a[name] || "").toLowerCase() < (b[name] || "").toLowerCase()) {
            result = -1;
          } else if ((a[name] || "").toLowerCase() > (b[name] || "").toLowerCase()) {
            result = 1;
          } else 
            result = 0;
          break;
        case "object":
          if (a[name] instanceof Date) {
            result = new Date(a[name]).getTime() - new Date(b[name]).getTime();
          }
          break;
        default:
          result = 0;
          break;
      }
    }

    return result;
  }

  public ChangeOrderBy(name: string | undefined, ordered: boolean) {
    if (!name) return;
    this.filteredRows.sort((a, b) => {
      return this.orderFunction(a, b, name);
    });

    if (name == this.lastOrder.field) {
      if (!ordered && !this.lastOrder.descending) {
        this.lastOrder.descending = true;
        this.filteredRows.reverse();
      } else {
        this.lastOrder.descending = false;
      }
    } else {
      this.lastOrder.field = name;
      this.lastOrder.descending = false;
    }

    this.paginateTables();
  }


  private clearRowDetail(){
    if(!!this.showedRows && this.showedRows.length>0){
      let i = 0;
      while(this.showedRows[i]){
        if(!!this.showedRows[i].rowDeatailTemplate) delete this.showedRows[i].rowDeatailTemplate;
        i++;
      }
    }
  }


  private displayRowDetail( row: any){
    let exist = !!row.rowDeatailTemplate;
    this.clearRowDetail();
    this.interpolate.cleanCache();
    if(!exist){
      row.rowDeatailTemplate = this.interpolate.parserStringNasted(
        this.schema?.rowDeatailTemplate as string,
        row["_source"],
        this.schema?.otherData
      );
    }    
  }

  public ButtonClick(callback: any, row: any,$event:any) {
    
    if( (this.schema?.callbackRowsDetail || 'dglRowdetail') == callback && !!this.schema?.rowDeatailTemplate){
      //console.log("ButtonClick callback",callback,this.schema.rowDeatailTemplate);
      this.displayRowDetail(row);
    }

    this.CallbackEvents(callback, "row", row);

    $event.stopPropagation();
  }

  public ExportButtonClick(exportButton: DtlExportButtonSchema) {
    if (exportButton.ExportAction) return exportButton.ExportAction;
    else {
      switch (exportButton.Type) {
        case "CSV":
          return this.getExportExcel(exportButton.allowColumnsSelection);
          // return this.getCsv();

          case "Excel":
            return this.getExportExcel(exportButton.allowColumnsSelection); 

        default:
          //console.log("Export Type Not Implemented");
      }
    }
  }

  public ChangeSelectionShowedRows(select: boolean) {
    let r = 0;
    while (this.showedRows[r]) {
      var row = this.showedRows[r];

      if (!row.trClass) {
        row.trClass = {};
      }

      row.trClass[this.schema?.selectRowClass || "dglRowSelected"] = select;
      row.dglRowSelected = select;
      r++;
    }
  }

  private _lastSelectedRow: any;
  public ClickRow(row: any, cantSelect: boolean, event: MouseEvent) {
    //console.log("$event", event, this.schema);
    if (cantSelect) return;
    if (this.schema?.selectRows && this.schema.selectRows.toLowerCase() == "single") {
      this.ChangeSelectionShowedRows(false);
      if (!row.trClass) {
        row.trClass = {};
      }

      row.trClass[this.schema.selectRowClass || "dglRowSelected"] = true;
      row.dglRowSelected = true;

      this.CallbackEvents(this.schema.callbackSelectRow || "dglRowSelected", "row", row);
    } else if (this.schema?.selectRows?.toLowerCase() == "multi") {
      if (!event.ctrlKey && !event.shiftKey) {
        this.ChangeSelectionShowedRows(false);
        if (!row.trClass) {
          row.trClass = {};
        }

        row.trClass[this.schema.selectRowClass || "dglRowSelected"] = true;
        row.dglRowSelected = true;
      } else if (event.ctrlKey) {
        row.dglRowSelected = !row.dglRowSelected;
        if (!row.trClass) {
          row.trClass = {};
        }
        row.trClass[this.schema.selectRowClass || "dglRowSelected"] = row.dglRowSelected;
      } else if (event.shiftKey) {
        if (row._index_ || row._index_ === 0) {
          let minIndex:any, maxIndex:any;
          if (this._lastSelectedRow && (this._lastSelectedRow._index_ || this._lastSelectedRow._index_ === 0)) {
            if (this._lastSelectedRow._index_ < row._index_) {
              minIndex = this._lastSelectedRow._index_;
              maxIndex = row._index_;
            } else {
              minIndex = row._index_;
              maxIndex = this._lastSelectedRow._index_;
            }
          } else minIndex = maxIndex = row._index_;

          let toSelectRows = this.filteredRows.filter((r) => r._index_ >= minIndex && r._index_ <= maxIndex);
          let i = 0;
          while (toSelectRows[i]) {
            if (!toSelectRows[i].trClass) toSelectRows[i].trClass = {};

            toSelectRows[i].trClass[this.schema.selectRowClass || "dglRowSelected"] = true;
            toSelectRows[i].dglRowSelected = true;
            i++;
          }
        }
      }
      this._lastSelectedRow = row;
      this.ChangeSelectedMultiRow();
    }
  }

  public DoubleClickRow(row: any, event: MouseEvent) {
    //console.log("$event", event);
    this.CallbackEvents(this.schema?.callbackDoubleClickRow || "dglDoubleClickRow", "row", row);
  }

  public ChangeSelectRow(row: any) {
    if (!row.trClass) {
      row.trClass = {};
    }

    row.trClass[this.schema?.selectRowClass || "dglRowSelected"] = row.dglRowSelected;

    this.ChangeSelectedMultiRow();
  }

  public ChangeSelectAllRows(selectAllRow: boolean) {
    this.ChangeSelectionShowedRows(selectAllRow);
    this.ChangeSelectedMultiRow();
  }

  public ChangeSelectedMultiRow() {
    let r = 0;
    let selRows: any[] = [];

    while (this.showedRows[r]) {
      if (this.showedRows[r].dglRowSelected) {
        selRows.push(this.showedRows[r]);
      }
      r++;
    }

    this.CallbackEvents(this.schema?.callbackSelectRows || "dglRowsSelected", "rows", selRows);
  }

  private CallbackEvents(callbackName: string, itemName: string, item: any) {
    //console.log("CallbackEvents " + callbackName + " " + itemName, item);
    let itemCall:any = { callback: callbackName };
    let data = deepClone(item);
    if (item._index_ !== undefined && data._index_ !== null) {
      itemCall["index"] = data._index_;
      delete data._index_;
    }

    if (data) {
      if (itemName == "row") {
        data = data["_source"] || data;
      }
      //console.log("DATA ", data);

      if (itemName == "rows") {
        var r = 0;
        while (data[r]) {
          data[r] = data[r]["_source"] || data[r];
          delete data[r]._index_;
          r++;
        }
      }
    }

    itemCall[itemName] = data;

    this.events.emit(itemCall);
  }

  private completeFunction(thema:string | undefined,addValue:any):string{
    if(!thema) return "";
    let copia = thema + "";
    if(thema.indexOf('(click)=')){
      copia = replaceAll(copia, "(click)=\"","(click)=\""+addValue+",");
      copia = replaceAll(copia, "(click)='","(click)='"+addValue+",");
    }
    return copia ;
  }

  private paginateTables() {
    if (this.filteredRows) {
      this.totalRows = this.filteredRows.length;

      if (this.schema?.maxRows) {
        this.totalPages = Math.floor((this.totalRows - 1) / this.schema.maxRows) + 1;
        this.SetShowedPage(1);
      } else {
        this.totalPages = 0;
        this.filteredRows = <Array<any>>this.ProcessTemplate(this.filteredRows);
        this.showedRows = this.filteredRows;
        this.clearRowDetail();
      }
      this.CallbackEvents(this.schema?.callbackChangedRowsCount || "dglChangedRowsCount", "rows", this.totalRows);
    } else {
      this.totalPages = 0;
      this.totalRows = 0;
      this.showedRows = [];
    }
  }

  private SetShowedPage(pageNumber: number, withoutCallBack: boolean = false) {
    this.currentPage = pageNumber;
    this.pagerPages = this.getPagesArray(
      pageNumber,
      this.totalPages,
      this.schema?.pagerMaxSize || 5,
      this.schema?.pagerRotate
    );

    let start = (pageNumber - 1) * (this.schema?.maxRows || 10);

    var partialtable = this.filteredRows.slice(start, start + (this.schema?.maxRows||10));
    partialtable = <Array<any>>this.ProcessTemplate(partialtable);
    this.showedRows = partialtable;
    this.clearRowDetail();
    if (!withoutCallBack) {
      this.CallbackEvents(this.schema?.callbackSelectedPageChange || "dglSelectedPageChange", "page", pageNumber);
    }

    // //console.log("PAGER_PAGERS_###", this.pagerPages);
  }

  private GetColumnByField(fieldName: string) {
    let c = 0;
    if(!this.schema?.columns || ( this.schema?.columns?.length ||0) == 0 ) return null;
    while (this.schema!.columns[c]) {
      if (this.schema.columns[c].field == fieldName) return this.schema.columns[c];
      c++;
    }
    return null;
  }

  private ProcessHeader() {
    // //console.log("ProcessHeader !!!!!! ",this.schema.columns,this.schema?.otherData);
    if (this.schema?.columns) {
      this.schema.columns.forEach((col) => {
        col.nameRendered = col.name;
        if (col.name && col.name.indexOf("{") > -1) {
          col.nameRendered = this.interpolate.parserStringNasted(col.name, this.schema?.otherData);
        }
      });
    }
  }
  // Funzione contenitore che elabora tutte le righe della tabella
  // @param tab: Array<any> - array di oggetti da renderizzare
  // Il design della tabella è definito dallo schema presente come input del componente angular 
  // lo schema definisce l'inpostazione generale della datatable
  // in piu esiste uno schema per ogni colonna e uno schema per i bottoni
  // Lo schema definisce anche eventuali filtri e template per le righe
  // Loschema impone come dovranno essere visibili i dati all'interno della tabella
  // anche in assenza di dati correlati in ogni singola riga della tabella il dato deve mantenere l'integrità dello schema
  //processo che interpreta i dati i modelli presenti nel datatable schema con gli oggetti presenti in riga e applica eventuali template
  
  private ProcessTemplate(tab: Array<any>): Array<any> {
 // Viene verificato se il datatable ha delle colonne e se la tabella ha delle righe
    // infine viene verificato se eseistono delle configurazioni per le tabelle
    if (!tab || tab.length === 0 || !this.schema?.columns) {
      return tab;
    }

    // Per ogni riga viene eseguita la pulizia della cache una volta sola
    tab.forEach(row => {
      this.interpolate.cleanCache();
      this.applyColumnTemplates(row);
      this.applyButtonTemplates(row);
      this.applyRowOptions(row);
    });

    this.calculateWidths();
    return tab;
  }

  // Funzione per applicare i template delle colonne alla riga
  private applyColumnTemplates(row: any): void {
    this.schema?.columns?.forEach(col => {
      // Se la colonna ha un template, è di tipo "button" oppure possiede tooltip
      if (col.template || col.type === "button" || col.tooltip) {
        // Se è presente un template, applica la trasformazione
        if (col.template) {
          const templateWithFunction = this.completeFunction(col.template, row._mainIndex_);
          row[col.field + "Tmp"] = this.interpolate.parserStringNasted(
            templateWithFunction,
            row["_source"],
            this.schema?.otherData
          );
        }
        // Se non c'è il template ma è presente la configurazione per i bottoni (buttonConfig)
        else if (col.buttonConfig) {
          if (col.buttonConfig?.color) {
            row[col.field + "ClrTmp"] = this.interpolate.parserStringNasted(
              col.buttonConfig.color,
              row["_source"],
              this.schema?.otherData
            );
          }
          if (col.buttonConfig?.templateHide) {
            row[col.field + "HideTmp"] = this.interpolate.parserStringNasted(
              col.buttonConfig.templateHide,
              row["_source"],
              this.schema?.otherData
            );
          }
          if (col.buttonConfig?.templateDisable) {
            row[col.field + "DisTmp"] = this.interpolate.parserStringNasted(
              col.buttonConfig.templateDisable,
              row["_source"],
              this.schema?.otherData
            );
          }
        }
        // Se è presente un tooltip, applica il relativo template
        if (col.tooltip) {
          row[col.field + "Tooltip"] = this.interpolate.parserStringNasted(
            col.tooltip as string,
            row["_source"],
            this.schema?.otherData
          );
          row[col.field + "_tooltipvisible"] = false;
        }
      }
    });
  }

  // Funzione per applicare i template relativi ai bottoni alla riga
  private applyButtonTemplates(row: any): void {
    if (this.schema?.buttons && this.schema.buttons.length > 0) {
      let rowButtonLength = 0;
      this.schema.buttons.forEach(btn => {
        // Se è definito un template per il bottone
        if (btn.template) {
          row[btn.name + "Tmp"] = this.interpolate.parserStringNasted(
            btn.template as string,
            row["_source"],
            this.schema?.otherData
          );
        }
        // Se è definito il colore per il bottone
        if (btn.color) {
          row[btn.name + "ClrTmp"] = this.interpolate.parserStringNasted(
            btn.color,
            row["_source"],
            this.schema?.otherData
          );
        }
        // Se è definito il template per la disabilitazione del bottone
        if (btn.templateDisable) {
          row[btn.name + "DisTmp"] = this.interpolate.parserStringNasted(
            btn.templateDisable,
            row["_source"],
            this.schema?.otherData
          );
        }
        // Se è definito il template per la visibilità del bottone
        if (btn.templateHide) {
          row[btn.name + "HideTmp"] = this.interpolate.parserStringNasted(
            btn.templateHide,
            row["_source"],
            this.schema?.otherData
          );
        }

        if(!btn.templateHide || !row[btn.name + "HideTmp"] || row[btn.name+'HideTmp']=='false')
          rowButtonLength += (btn.width ?? 50);
      });
      // Gestione del template per la disabilitazione della selezione della riga
      if (this.schema.selectRowTemplateDisable) {
        row["selectRowTemplateDisableProcDisTmp"] = this.interpolate.parserStringNasted(
          this.schema.selectRowTemplateDisable,
          row["_source"],
          this.schema?.otherData
        );
      }

      if(this.maxBottonsWidth < rowButtonLength) this.maxBottonsWidth = rowButtonLength;
    }
  }

  // Funzione per applicare le opzioni della riga (classe, stile, disabilitazione, visibilità)
  private applyRowOptions(row: any): void {
    if (this.schema?.rowOptions) {
      if (this.schema.rowOptions.class) {
        row["rowClass"] = this.interpolate.parserStringNasted(
          this.schema.rowOptions.class,
          row["_source"],
          this.schema?.otherData
        );
      }
      if (this.schema.rowOptions.style) {
        row["rowStyle"] = this.interpolate.parserStringNasted(
          this.schema.rowOptions.style,
          row["_source"],
          this.schema?.otherData
        );
      }
      if (this.schema.rowOptions.disable) {
        row["rowDisabled"] = this.interpolate.parserStringNasted(
          this.schema.rowOptions.disable,
          row["_source"],
          this.schema?.otherData
        );
      }
      if (this.schema.rowOptions.visible) {
        row["rowVisible"] = this.interpolate.parserStringNasted(
          this.schema.rowOptions.visible,
          row["_source"],
          this.schema?.otherData
        );
      }
    }
  }

  public exportSchema(){
    let strJsonSchema = JSON.stringify(this.schema);
    let /** @type {?} */ blob = new Blob([strJsonSchema], { type: "application/json;" });

    let /** @type {?} */ uri = "data:attachment/csv;charset=utf-8," + encodeURI(strJsonSchema);
    let /** @type {?} */ link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("visibility", "hidden");
    link.download = "DtlJsonSchemas.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // if (navigator.msSaveBlob) {
    //   let /** @type {?} */ filename = options.filename.replace(/ /g, "_") + ".csv";
    //   navigator.msSaveBlob(blob, filename);
    // } else {
    //   let /** @type {?} */ uri = "data:attachment/csv;charset=utf-8," + encodeURI(csv);
    //   let /** @type {?} */ link = document.createElement("a");
    //   link.href = URL.createObjectURL(blob);
    //   link.setAttribute("visibility", "hidden");
    //   link.download = (this.schema.csvFileName || options.filename).replace(/ /g, "_") + ".csv";
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // }
  }

  public selectPage(page: number) {
    this.SetShowedPage(page);
  }

  public decreasePage() {
    if (this.currentPage > 1) {
      this.SetShowedPage(this.currentPage - 1);
    }
  }

  public increasePage() {
    if (this.currentPage < this.totalPages) {
      this.SetShowedPage(this.currentPage + 1);
    }
  }

  public getText(key: string) {
    if (this.schema?.texts) {
      let t = 0;
      while (this.schema.texts[0]) {
        if (this.schema.texts[0].key === key) return this.schema.texts[0].Text;
      }
    }
    return null;
  }

  public getCsv() {
    let jsonService = new JsonService();
    let options: CsvConfigConsts = new CsvConfigConsts();

    if (this.schema?.exportSchema && this.schema.exportSchema.exportColumns) {
      options.headers = this.schema.exportSchema.exportColumns.map((x) => x.name);
      options.keys = this.schema.exportSchema.exportColumns.map((x) => x.field);
    } else {
      options.headers = this.schema!.columns!.map((x) => x.name) as string[];
      options.keys = this.schema!.columns!.map((x) => x.field) as string[];
    }
    let rows = this.filteredRows.map((x) => {
      let row = deepClone(x);
      //console.log("EXPORT ROW PRE INTERPOLATION vs priginalOriginal", row, x);
      if (this.schema?.exportSchema) row = this.initExportRow(row,this.schema?.otherData);

      // //console.log("EXPORT ROW INIT",row);
      delete row._source;
      return row;
    });

    jsonService.options = options;
    let csv : any = jsonService.generateCsv(rows);
    // consolce.log("getCsv",csv);

    let /** @type {?} */ blob = new Blob([csv], { type: "text/csv;charset=utf8;" });
    if ((<any>navigator).msSaveBlob) {
      let /** @type {?} */ filename = options.filename.replace(/ /g, "_") + ".csv";
      (<any>navigator).msSaveBlob(blob, filename);
    } else {
      let /** @type {?} */ uri = "data:attachment/csv;charset=utf-8," + encodeURI(csv);
      let /** @type {?} */ link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("visibility", "hidden");
      link.download = (this.schema?.csvFileName || options.filename).replace(/ /g, "_") + ".csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  initExportRow(rowData: any,otherData:any) {
    this.interpolate.cleanCache();
    let row = rowData;
    // row['_source'] = rowData._source;
    this.schema?.exportSchema?.exportColumns.forEach((col) => {
      if (col.fieldPath) {
        // //console.log("[EXPORT BUTTON INIT ROW] Pre Interpolation",row[col.field],col.fieldPath,rowData);
        row[col.field] = this.interpolate.parserStringNasted(col.fieldPath, rowData._source, otherData);
        //console.log("[EXPORT BUTTON INIT ROW] POST Interpolation", row[col.field]);
      } else {
        row[col.field] = rowData._source[col.field];
      }

      if (col.type) {
        switch (col.type) {
          case "number":
            row[col.field] = row[col.field] * 1;
            break;

          case "date":
            row[col.field] = row[col.field] + "";
            break;

          case "string":
            row[col.field] = row[col.field] + "";
            break;
        }
      }
    });
    return row;
  }

  public async getExportExcel(allowColumnsSelection?: boolean)
  {
    // DEFINIZIONE HEADERS
    let headerDefinition = new Array();

    if (this.schema?.exportSchema?.exportColumns) {
      // headerDefinition = this.schema.exportSchema.map((x) => x.name)
      this.schema.exportSchema.exportColumns.forEach(x=> {
        let type = defaultDataType.string;
        switch(x.type)
        {
          case "number":
            type = defaultDataType.number;
            break;
          case "date":
            type= defaultDataType.date;
            break;
        }
        headerDefinition.push({
              name: x.name,
              key: x.field,
              dataType: type,
              width: x.width?? 25
              // hierarchy: true,
              // checkable: true,

        });
      });
    } else {
      // headerDefinition = this.schema.columns.map((x) => x.name);
      this.schema!.columns?.forEach(x=> {
        let type = defaultDataType.string;
        switch(x.type)
        {
          case "number":
            type = defaultDataType.number;
            break;
          case "date":
            type= defaultDataType.date;
            break;
        }

        headerDefinition.push({
          name: x.name,
          key: x.field,
          dataType: type,
          width: 25,
          // hierarchy: true,
          // checkable: true,
        });
      });
    }

    // Selezione colonne da esportare
    await new Promise((resolve, reject) => {
      if (this.schema?.exportSchema?.allowColumnsSelection ?? allowColumnsSelection) {
        const modalRef = this.modalService.open(CheckListSelectorComponent, {size: 'sm', backdrop: 'static'});
        modalRef.componentInstance.title = 'Seleziona colonne';
        modalRef.componentInstance.items = headerDefinition.map(h => {
          let item: CheckListSelectorItem = {value: h.key, displayText: h.name, selected: true};
          return item;
        });
        modalRef.result.then((selected: CheckListSelectorItem[]) => {
          if (selected?.length)
            headerDefinition = headerDefinition.filter(h => selected.some(x => x.value === h.key));
          resolve(null);
        }).catch(reason => resolve(null));
      }
      else
        resolve(null);
    });

    let exportSettings = {
      // Table settings
      fileName: this.schema?.exportSchema?.filename ?? "Export",
      workSheets: [
        {
          sheetName: this.schema?.exportSchema?.sheetname ?? "sheet",
          startingRowNumber: 2,
          gapBetweenTwoTables: 2,

          tableSettings: {
            data: {
              importable: true,
              // tableTitle: "xxx",
              headerDefinition: headerDefinition,
            },
          },
        },
      ],
    };

    
    // prepare export data
    let rows = this.filteredRows.map((x) => {
      let row = deepClone(x);
      if (this.schema?.exportSchema) row = this.initExportRow(row,this.schema?.otherData);

       delete row._source;
      
      headerDefinition.forEach(x=> {
        // if(!row.hasOwnProperty(x.key)) {
        //     row[x.key]="";
        //     // //console.log("ADDED PROPERTY",x.key, row);
        // }
        if(x.dataType==defaultDataType.date && row[x.key])
        {
          //row[x.key] = new Date(row[x.key]);
          row[x.key] = moment(row[x.key]).format('DD/MM/YYYY');
        }
      });
      
      return row;
    });

    let dataDefinition = [{ data: rows }];

    //console.log("EXPORT EXCEL - settings - data",exportSettings, dataDefinition);
    const excelExport = new ExcelExport();
    excelExport.downloadExcel(exportSettings, dataDefinition);

  }
  public getPagesArray(currentPage:any, totalPages:any, maxSize:any, rotate:any) {
    var pages = [];

    // Default page limits
    var startPage = 1,
      endPage = totalPages;
    var isMaxSized = maxSize && maxSize < totalPages;

    // recompute if maxSize
    if (isMaxSized) {
      if (rotate) {
        // Current page is displayed in the middle of the visible ones
        startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
        endPage = startPage + maxSize - 1;

        // Adjust if limit is exceeded
        if (endPage > totalPages) {
          endPage = totalPages;
          startPage = endPage - maxSize + 1;
        }
      } else {
        // Visible pages are paginated with maxSize
        startPage = (Math.ceil(currentPage / maxSize) - 1) * maxSize + 1;

        // Adjust last page if limit is exceeded
        endPage = Math.min(startPage + maxSize - 1, totalPages);
      }
    }

    // Add page number links
    for (var number = startPage; number <= endPage; number++) {
      var page = this.makePage(number, number, number === currentPage);
      pages.push(page);
    }

    // Add links to move between page sets
    if (isMaxSized && !rotate) {
      if (startPage > 1) {
        var previousPageSet = this.makePage(startPage - 1, "...", false);
        pages.unshift(previousPageSet);
      }

      if (endPage < totalPages) {
        var nextPageSet = this.makePage(endPage + 1, "...", false);
        pages.push(nextPageSet);
      }
    }

    // //console.log("PAGES ARRAY", pages);
    return pages;
  }

  private makePage(number:any, text:any, isActive:any) {
    return {
      number: number,
      text: text,
      active: isActive,
    };
  }

  openColumnsSelection() {
    if (!this.schema?.columns?.length) return;

    const modalRef = this.modalService.open(CheckListSelectorComponent, {size: 'sm', backdrop: 'static'});
    modalRef.componentInstance.title = 'Seleziona colonne';
    modalRef.componentInstance.items = this.schema.columns.map(c => {
      let item: CheckListSelectorItem = {value: c.field, displayText: c.name || c.field || '', selected: !c.hide};
      return item;
    });
    modalRef.result.then((selected: CheckListSelectorItem[]) => {
      if (selected?.length && this.schema) {
        this.schema?.columns?.forEach(c => c.hide = !selected.find(x => x.value === c.field));
        // Devo sistemare la grafica dopo aver mostrato o nascosto le colonne
        let widths = this.getSchemaWidths(this.schema);
        this.schema.theadStyle = {
          ...this.schema.theadStyle,
          ...{ display: "grid", "grid-template-columns": widths.tempCol },
        };

        this.schema.tbodyStyle = {
          ...this.schema.tbodyStyle,
          ...{ display: "grid", "grid-template-columns": widths.tempCol },
        };
      }
    }).catch();
  }

  public updateElement(index: number, newVal: any) {
    //console.log("updateElement newVal", newVal);
    //console.log("updateElement source", this.source);

    let row = this.source.find((x) => x._mainIndex_ == index);
    //console.log("updateElement 1", row);
    if (row) {
      row = this.initRow(index, newVal, row,this.schema?.otherData);
    }
    let i = 0;
    //console.log("updateElement 2", row);
    while (this.filteredRows[i]) {
      if (this.filteredRows[i]._index_ == index) {
        this.filteredRows[i] = row;
        break;
      }
      i++;
    }

    i = 0;

    while (this.showedRows[i]) {
      if (this.showedRows[i]._index_ == index) {
        let partialtable = [];
        partialtable.push(row);
        partialtable = <Array<any>>this.ProcessTemplate(partialtable);
        this.showedRows[i] = partialtable[0];
        //console.log("updateElement 3", this.showedRows[i]);
        if (this.virtualScrollDataSource) {
          (<any>this.virtualScrollDataSource.adapter).replace({items: [this.showedRows[i]], predicate: (x:any) => x.$index === i});
          //this.virtualScrollDataSource.adapter.reload(i);
        }
        break;
      }
      i++;
    }

  }

  public cellMouseEnterEvent(row: any, col: DtlColumnSchema, $event: any) {
    if ((col.tooltipTrigger == "hover" || !col.tooltipTrigger) && row[col.field + "Tooltip"]) {
      this.showTooltip(row, col, $event);
    }
  }

  public cellMouseLeaveEvent(row: any, col: DtlColumnSchema) {
    if ((col.tooltipTrigger == "hover" || !col.tooltipTrigger) && row[col.field + "Tooltip"]) {
      this.hideTooltip();
    }
  }

  public cellClickEvent(row: any, col: DtlColumnSchema, $event: any) {
    let myTag = this.getTooltipTag(row, col);

    if (col.tooltipTrigger == "click" && row[col.field + "Tooltip"]) {
      if (this.global_last_tooltip_user != myTag) {
        this.showTooltip(row, col, $event);
        this.global_last_tooltip_user = myTag;
      } else this.hideTooltip();
    }
  }

  public showTooltip(row: any, col: DtlColumnSchema, $event: any) {
    let x = 0;
    let y = 0;
    let callingElement = $event.target as HTMLElement;

    if(!col.field || !row[col.field]) return;

    if (!callingElement) return;

    let container = document.getElementById(this.tableContainerID);
    let header = document.getElementById(this.tableHeaderID)?.getBoundingClientRect();
    if (!container) return;

    y = callingElement.offsetTop;
    x = callingElement.offsetLeft;

    if (this.schema?.virtualScroll) {
      let firstVisible = (<any>this.virtualScrollDataSource?.adapter)?.firstVisible?.element;
      if (firstVisible) {
        y -= firstVisible.offsetTop;
        let firstVisibleRect = firstVisible.getBoundingClientRect();
        if (header && firstVisibleRect.top < header.top + header.height) {
          y += firstVisibleRect.top - (header.top + header.height);
        }
        if (header) {
          y += header.height;
        }
      }
    }

    // Fix x location
    if (container.scrollLeft > 0) {
      x -= container.scrollLeft;
    }

    let tooltip: any = document.getElementById(this.tooltipID);
    tooltip.innerHTML = row[col.field + "Tooltip"];
    tooltip.removeAttribute("hidden");

    // Calcola bounding rect
    const rect = callingElement.getBoundingClientRect();
    const tableRect = container.getBoundingClientRect();

    // Posizionamento orizzontale iniziale centrato
    x = x + callingElement.offsetWidth;

    // Rimuovi classi esistenti
    tooltip.classList.remove("top", "bottom", "left", "right");

    // ➤ Calcolo verticale con classi
    const tableMidY = tableRect.top + tableRect.height / 2;
    if (rect.top < tableMidY) {
      y = y + callingElement.offsetHeight + 5;
      tooltip.classList.add("bottom");
    } else {
      y = y - tooltip.offsetHeight - 5;
      tooltip.classList.add("top");
    }

    // ➤ Posizione provvisoria
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;

    // ➤ Dopo aver impostato posizione, controlla overflow orizzontale
    const tooltipRect = tooltip.getBoundingClientRect();

    if (tooltipRect.right > tableRect.right) {
      tooltip.classList.add("left"); // sposterai con CSS
    }else{
      tooltip.classList.add("right");
      x = x - rect.width;
    }

    // log classi aggiuntive
    // console.log(tooltip.classList);

    // Riposizionamento opzionale via JS se vuoi fisico (non solo classe):
    x = Math.max(tableRect.left, Math.min(tableRect.right - tooltip.offsetWidth, x));
    tooltip.style.left = `${x}px`;
  }


  public hideTooltip() {
    let tooltip :any = document.getElementById(this.tooltipID);
    // tooltip.style.visibility = "hidden";
    tooltip.setAttribute("hidden", "true");
    this.global_last_tooltip_user = "";
  }

  private getTooltipTag(row: any, col: DtlColumnSchema) {
    return this.tooltipID + "_" + row._index_ + "_" + col.field;
  }

  maxRowsOptionChange(maxRows:any, withoutCallBack = false) {
    if (isNaN(maxRows)) {
      if (maxRows.toLowerCase() == "tutto" || maxRows.toLowerCase() == "all") {
        if(!!this.schema)
          this.schema.maxRows = this.source.length;
      } 
      else console.error("DTL pagination - selected option not found");
    } else {
      if(!!this.schema)
      this.schema.maxRows = maxRows;
    }
    if (!withoutCallBack) {
      this.CallbackEvents(this.schema!.callbackRowsOptionChange || "dglRowsOptionChange", "maxRows", this.schema!.maxRows);
    }
    this.paginateTables();
  }
  
  @HostListener("mousedown", ["$event"])
  onMouseDown(e:any) {  // Purtroppo è l'unico modo in cui sono riuscito a triggerare il mousedown
    if (this.schema?.resizable && e.target?.className.includes('resize-handle')) {
      let colIndex = e.target.parentElement.id?.replace('column_', '');
      let col = (<any>this.schema)!.columns[colIndex];
      if (col.canResize != false)
        this.resizeHandleMouseDown(e, col);
    }
  }

  //#region resize
  private headerBeingResized: any;
  private colBeginResized: DtlColumnSchema | null = null;
  resizeHandleMouseDown(e:any, col: DtlColumnSchema) {
    e.preventDefault();
    ////console.log('mousedown', e, col);
    this.headerBeingResized = e.target.parentNode;
    this.colBeginResized = col;
    window.addEventListener('mousemove', this.onResizerMouseMove);
    window.addEventListener('mouseup', this.onResizerMouseUp);
    this.headerBeingResized.classList.add('header--being-resized');
  }

  onResizerMouseUp = () => {
    ////console.log('mouseup');
    window.removeEventListener('mousemove', this.onResizerMouseMove);
    window.removeEventListener('mouseup', this.onResizerMouseUp);
    this.headerBeingResized.classList.remove('header--being-resized');
    this.headerBeingResized = null;
    this.colBeginResized = null;
  };

  onResizerMouseMove = (e:any) => requestAnimationFrame(() => {
    if (!this.headerBeingResized || !this.colBeginResized || !this.schema?.resizable) return;
    e.preventDefault();
    
    // Calculate the desired width
    let horizontalScrollOffset = document.documentElement.scrollLeft;
    ////console.log('mousemove', e, horizontalScrollOffset, this.headerBeingResized.offsetLeft, this.headerBeingResized.getBoundingClientRect());
    let width = (horizontalScrollOffset + e.clientX) - this.headerBeingResized.getBoundingClientRect().x;
    this.colBeginResized.width = Math.max(width, 50) + 'px';  // Almeno 50px
    this.calculateWidths();
  });
  //#endregion

  calculateWidths() {
    if (!this.schema) return;
    let widths = this.getSchemaWidths(this.schema);
    this.schema.theadStyle = {
      ...this.schema.theadStyle,
      ...{ display: "grid", "grid-template-columns": widths.tempCol },
    };

    this.schema.tbodyStyle = {
      ...this.schema.tbodyStyle,
      ...{ display: "grid", "grid-template-columns": widths.tempCol },
    };
  }

  calculeteFooterHeight() {
    let container = document.getElementById(this.tableContainerID);
    let footerContainer = document.getElementById(this.tableFooterContainerID);
    if(!container || !footerContainer) return;
    
    footerContainer.style.display = "block";
    // console.log("this.schema", this.schema);
    // console.log("this.schema?.footerRows", this.schema?.footerRows);
    // console.log("this.schema?.footerBoxes", this.schema?.footerBoxes);
    
    this.footerHeightComputed = true;
    if(this.schema?.footerRows || this.schema?.footerBoxes){
      let containerRows = document.getElementById(this.tableFooterRowsContainerID);
      let containerBoxes = document.getElementById(this.tableFooterBoxesContainerID);

      if(containerRows){
        if(this.schema?.footerRows){
          containerRows.style.display = "block";
        }else{
          containerRows.style.display = "none";
        }
      }

      if(containerBoxes){
        if(this.schema?.footerBoxes){
          containerBoxes.style.display = "flex";
        }else{
          containerBoxes.style.display = "none";
        }
      }

      let heightFooter = footerContainer.getBoundingClientRect().height;      
      let totalHeight = 50 + heightFooter;
      container.style.height = "calc(100% - " + totalHeight + "px)";
    }else{
      container.style.height = "calc(100% - 50px)";
      if(footerContainer) footerContainer.style.display = "none";
      return
    }
  }

  private processFooter() {
  if (!this.schema?.footerRows || !this.filteredRows) {
    this.footerProcessedRows = [];
    return;
  }

  this.footerProcessedRows = this.schema.footerRows.map(footerRow => ({
    ...footerRow,
    gridTemplate: this.getFooterGridTemplate(footerRow),
    columns: footerRow.columns.map(col => {
      let processedValue = '';
      const context = {
        rows: this.filteredRows,
        totalRows: this.totalRows,
        selectedRows: this.filteredRows.filter(r => r.dglRowSelected)
      };
      
      if (col.template) {
        this.interpolate.cleanCache();
        processedValue = this.interpolate.parserStringNasted(col.template, context, this.schema?.otherData);
      } else if (col.value) {
        processedValue = col.value;
      }
      
      return { ...col, processedValue };
    })
  }));
}

private processFooterBoxes() {
  if (!this.schema?.footerBoxes) {
    this.footerBoxesProcessed = [];
    return;
  }

  const context = {
    rows: this.filteredRows,
    totalRows: this.totalRows,
    selectedRows: this.filteredRows.filter(r => r.dglRowSelected)
  };

  this.footerBoxesProcessed = this.schema.footerBoxes.map(box => {
    let processedValue = box.value || '';
    if (box.template) {
      this.interpolate.cleanCache();
      processedValue = this.interpolate.parserStringNasted(box.template, context, this.schema?.otherData);
    }
    return { ...box, processedValue };
  });
}

private getFooterGridTemplate(footerRow: DtlFooterRow): string {
  const totalCols = this.schema?.columns?.filter(c => !c.hide).length || 0;
  const hasButtons = (this.schema?.buttons?.length || 0) > 0 || (this.schema?.exportButtons?.length || 0) > 0;
  return hasButtons ? `repeat(${totalCols + 1}, 1fr)` : `repeat(${totalCols}, 1fr)`;
}

  onTableScroll(event: Event): void {
    // Esempio: nascondi tooltip se scrolli
    const tooltip = document.getElementById(this.tooltipID);
    if (tooltip) {
      tooltip.setAttribute('hidden', 'true');
    }
  }
}

