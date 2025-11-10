
export class CsvConfigConsts {

    filename: string= "fileincsv"
    fieldSeparator: string = ';';
    quoteStrings: string = '"';
    decimalseparator: string = '.';
    showLabels: boolean  = false;
    showTitle:boolean = false
    title: string = "My Report";
    useBom: boolean = false;
    headers: string[] | undefined;
    keys: string[] | undefined;
    removeNewLines: boolean  = false;
}

export class JsonService {

    private EOL = '\r\n';
    private BOM = '\ufeff';

    public options: CsvConfigConsts;

    constructor(){
        this.options = new CsvConfigConsts();
    }
   

    generateCsv(data: Array<any>) {
        
        let csv = '';
        if (this.options.useBom) {
            csv += this.BOM;
        }
        if (this.options.showTitle) {
            csv += this.options.title + '\r\n\n';
        }
        csv += this.getHeaders(data ||[]);
        csv += this.getBody(data || []);
        if (csv === '') {
            //console.log('Invalid data');
            return;
        }
        //let /** @type {?} */ blob = new Blob([csv], { type: 'text/csv;charset=utf8;' });
        // if (navigator.msSaveBlob) {
        //     let /** @type {?} */ filename = this.options.filename.replace(/ /g, '_') + '.csv';
        //     navigator.msSaveBlob(blob, filename);
        // }
        // else {
        //     let /** @type {?} */ uri = 'data:attachment/csv;charset=utf-8,' + encodeURI(this.csv);
        //     let /** @type {?} */ link = document.createElement('a');
        //     link.href = URL.createObjectURL(blob);
        //     link.setAttribute('visibility', 'hidden');
        //     link.download = this.filename.replace(/ /g, '_') + '.csv';
        //     document.body.appendChild(link);
        //     link.click();
        //     document.body.removeChild(link);
        // }

        return csv;
    }

    getHeaders(data: Array<any>): string {
        let result = '';
        if ((this.options.headers?.length||0) > 0) {
            let /** @type {?} */ row = '';
            for (let /** @type {?} */ column of (this.options.headers || [])) {
                row += column + this.options.fieldSeparator;
            }
            row = row.slice(0, -1);
            result += row + this.EOL;
        }
        return result;
    }

    getBody(data: Array<any>): string {
        let result = '';
        for (let /** @type {?} */ dataRow of data) {
            let /** @type {?} */ row = '';
            if (this.isEmptyObject(dataRow) && this.options.removeNewLines) {
                continue;
            }
            if (typeof this.options.keys !== 'undefined' && this.options.keys.length) {
                for (let /** @type {?} */ key of this.options.keys) {
                    row += this.formartData(dataRow[key]) + this.options.fieldSeparator;
                }
                row = row.slice(0, -1);
                result += row + this.EOL;
            }
            else {
                for (let /** @type {?} */ key in dataRow) {
                    if (dataRow[key]) {
                        row += this.formartData(dataRow[key]) + this.options.fieldSeparator;
                    }
                }
                result += row + this.EOL;
            }
        }
        return result;
    }

    formartData(data:any) {
        if (this.options.decimalseparator === 'locale' && this.isFloat(data)) {
            return data.toLocaleString();
        }
        if (this.options.decimalseparator !== '.' && this.isFloat(data)) {
            return data.toString().replace('.', this.options.decimalseparator);
        }
        if (typeof data === 'string') {
            data = data.replace(/"/g, '""');
            if (this.options.quoteStrings || data.indexOf(',') > -1 || data.indexOf("\n") > -1 || data.indexOf("\r") > -1) {
                data = this.options.quoteStrings + data + this.options.quoteStrings;
            }
            return data;
        }
        if (typeof data === 'boolean') {
            return data ? 'TRUE' : 'FALSE';
        }
        return data;
    }

    isEmptyObject(obj:any) {
        return (obj && (Object.keys(obj).length === 0));
    }
    
    isFloat(input: any) {
        return +input === input && (!isFinite(input) || Boolean(input % 1));
    }
    
    toObject(val: any) {
        if (val === null || val === undefined) {
            throw new TypeError('Object.assign cannot be called with null or undefined');
        }
        return Object(val);
    }
    
    objectAssign(target:any, ...source: any[]) {
        let /** @type {?} */ from;
        let /** @type {?} */ to = this.toObject(target);
        let /** @type {?} */ symbols;
        let /** @type {?} */ hasOwnProperty = Object.prototype.hasOwnProperty;
        let /** @type {?} */ propIsEnumerable = Object.prototype.propertyIsEnumerable;
        for (let /** @type {?} */ s = 1; s < arguments.length; s++) {
            from = Object(arguments[s]);
            for (let /** @type {?} */ key in from) {
                if (hasOwnProperty.call(from, key)) {
                    to[key] = from[key];
                }
            }

            //

            if (!!(/** @type {?} */ (Object)).getOwnPropertySymbols) {
                symbols = (/** @type {?} */ (Object)).getOwnPropertySymbols(from);
                for (let /** @type {?} */ symbol of symbols) {
                    if (propIsEnumerable.call(from, symbol)) {
                        to[symbol] = from[symbol];
                    }
                }
            }
        }
        return to;
    }
}