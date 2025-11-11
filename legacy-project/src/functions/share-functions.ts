import { AbstractControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { InputSchemaModel } from "../utils/input-schema.models";
import {
  dateValidation,
  emailAddressValidation,
  fiscalCodeCompanyValidation,
  fiscalCodePersonValidation,
  genericPhoneNumberValidation,
  ibanValidation,
  provinceValidation,
  publicAdministrationSDIvalidation,
  SDIvalidation,
  vatValidation,
  zipCodeValidation,
} from "../utils/regexp";
import { BigDiff, DiffOptions } from "./diffFunction_optimized";

export function roundValue(value:any, decimals:any) {
  return Number(Math.round(Number(value + "e" + decimals)) + "e-" + decimals);
}

export function resetFormValidation(form: FormGroup) {
  form.markAsPristine();
  form.markAsUntouched();
}

export function setFormDate(date: string | number | Date) {
  if (date === "") {
    return "";
  }
  if (date === null) {
    return null;
  }

  //--METODO 1: casino con i fusi orari
  //const currentDate = new Date(date);
  //return  currentDate.toISOString().substring(0, 10);

  //--METODO 2: considera i fusi orari e funziona bene per gli impianti, non vorrei aver rotto qualcosa sulla data dei documenti
  let realDate = new Date(date);
  let time = realDate.getTime();
  const offsetTime = Math.abs(realDate.getTimezoneOffset() * 60000);
  let final = realDate.getTimezoneOffset() <= 0 ? time + offsetTime : time - offsetTime;
  let iso = new Date(final).toISOString();
  return iso.substring(0, 10);
}

export function getQueryParamsStringFromModel(model: any): string {
  if (!model) return "";

  let queryParams = "";
  for (const prop of Object.getOwnPropertyNames(model)) {
    const value = model[prop];
    if (
      (value && typeof value !== "boolean") ||
      (typeof value === "boolean" && value !== undefined && value !== null)
    ) {
      queryParams += `&${prop}=${escape(value)}`;
    }
  }

  return queryParams;
}


export function isEquivalent(a:any, b:any): boolean {
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);

  if (aProps.length !== bProps.length) {
    return false;
  }

  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i];
    if (propName !== "identity" && propName !== "identity") {
      if (a[propName] !== b[propName]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Estrae un oggetto "pulito" dal source usando la struttura del model come template
 * 
 * @param source Oggetto sorgente (es. DTO da API)
 * @param model Oggetto modello che definisce la struttura desiderata
 * @returns Oggetto con solo le proprietà presenti nel model
 */
export function mapDataFromModel(source: any, model: any): any {
  const result: any = {};
  
  if (model) {
    Object.keys(model).forEach((key) => {
      result[key] = source ? source[key] || null : null;
    });
  }
  
  return result;
}

export function mapFormWith2Values(form: FormGroup, values: any) {
  Object.keys(form.controls).forEach((key) => {
    if (values[key]) form.get(key)?.patchValue(values[key], { emitEvent: false });
  });
}

export function mapForm3WithValues(form: FormGroup, values: any, emitEvent: boolean = false) {
  if (!values) return;
  var model = form.getRawValue();
  Object.keys(model).forEach((key) => {
    let data =
      model[key] == null ||
      typeof model[key] === "object" ||
      typeof model[key] === "boolean" ||
      typeof model[key] === "number"
        ? null
        : ""; //null
    if (values[key] != null && values[key] != undefined) data = values[key];
    form.get(key)?.patchValue(data, { emitEvent: emitEvent });
  });
}

/**
 * Mappa i valori dall'oggetto source alla form, applicando default appropriati
 * 
 * VERSIONE 4 - STANDARD AZIENDALE
 * Gestisce tutti i tipi di dati correttamente
 * 
 * @param form FormGroup target
 * @param values Oggetto sorgente con i valori
 * @param emitEvent Se emettere eventi di cambio
 */
export function mapForm4WithValues(form: FormGroup, values: any, emitEvent: boolean = false): void {
  if (!values) return;
  const model = form.getRawValue();
  Object.keys(model).forEach((key) => {
    let data: any;
    // Determina il default appropriato basato sul tipo del modello
    if (model[key] == null) {
      data = null;
    } else if (typeof model[key] === "boolean") {
      data = null;
    } else if (typeof model[key] === "number") {
      data = null;
    } else if (Array.isArray(model[key])) {
      data = []; // Array vuoto come default
    } else if (typeof model[key] === "object") {
      data = null;
    } else {
      data = ""; // String vuota per campi testo
    }
    // Applica il valore se presente e valido
    if (values[key] != null && values[key] != undefined) {
      data = values[key];
    }
    form.get(key)?.patchValue(data, { emitEvent : emitEvent });
  });
}

export function doFormActions(form: FormGroup, inputValues: any) {
  if (!inputValues) return;
  inputValues.forEach( (value:any) => {
    switch (value.action) {
      case "copy":
        {
          let source = value?.options?.source;
          let destination = value?.options?.destination;
          if(!source || !destination) return;
          
          let force = value?.options?.force ?? false;
          if (force || !form.get(destination)?.value) {
            let data = form.get(source)?.value;
            form.get(destination)?.patchValue(data, { emitEvent: false });
          }
        }
        break;
    }
  });
}

export function mapFormWithValues_(form: FormGroup, values: any) {
  if (!values) return;
  var model = form.getRawValue();
  var result:any = {};
  Object.keys(model).forEach((key) => {
    result[key] = values[key] != null ? values[key] : null;
  });
  ////console.log("mapFormWithValues -> result",result)
  form.setValue(result, { emitEvent: false });
}

export function mapFormWithValues(form: FormGroup, values: any) {
  if (!values) return;
  var model = form.getRawValue();
  var result: any = {};
  Object.keys(model).forEach((key) => {
    let data =
      model[key] == null ||
      typeof model[key] === "object" ||
      typeof model[key] === "boolean" ||
      typeof model[key] === "number"
        ? null
        : ""; //null
    if (values[key] != null && values[key] != undefined) result[key] = values[key];
    else {
      result[key] = null;
    }
  });
  form.setValue(result, { emitEvent: false });
}

export function isEqual(k1: any, k2: any) {
  if (!k1 || !k2) {
    if (!k1 && !k2) return true;
    return false;
  }
  let sk1 = JSON.stringify(k1);
  let sk2 = JSON.stringify(k2);
  return sk1 === sk2;
}

/**
 * Versione ottimizzata di isEqual per oggetti DTO specifici
 * 
 * @param a Primo oggetto
 * @param b Secondo oggetto
 * @param criticalFields Array di campi critici da confrontare sempre
 * @returns true se gli oggetti sono uguali
 */
export function fastDtoEquals<T>(a: T, b: T, criticalFields: (keyof T)[]): boolean {
  if (a === b) return true;
  if (!a || !b) return !a && !b;
  
  // Confronto rapido sui campi critici
  for (const field of criticalFields) {
    if (a[field] !== b[field]) return false;
  }
  
  // Se i campi critici sono uguali, confronto completo con lodash
  return isEqual(a, b);
}

export function stringEquals(
  s1: string,
  s2: string,
  caseSensitive: boolean = true,
  removeEmptySpaces: boolean = false
): boolean {
  if (!s1 && !s2) return true;
  if (!s1 || !s2) return false;

  if (!caseSensitive) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  }
  if (removeEmptySpaces) {
    s1 = s1.trim();
    s2 = s2.trim();
  }

  return s1 == s2;
}

export const isDate = (d:Date) => d instanceof Date;
export const isEmpty = (o:any) => Object.keys(o).length === 0;

export const isObject = (o:any) => o != null && typeof o === "object";
export const properObject = (o:any) => (isObject(o) && !o.hasOwnProperty ? { ...o } : o);

export function Diff(lhs:any, rhs:any):any {
  if (lhs === rhs) return {}; // equal return no diff
  if (lhs === null) return rhs; // lhs is null  so rhs is totali diff
  if (rhs === null) return lhs; // rhs is null  so rhs is totali diff
  if (!isObject(lhs) || !isObject(rhs)) return rhs; // return updated rhs

  const l = properObject(lhs);
  const r = properObject(rhs);

  const deletedValues = Object.keys(l).reduce((acc, key) => {
    return r.hasOwnProperty(key) ? acc : { ...acc, [key]: undefined };
  }, {});

  if (isDate(l) || isDate(r)) {
    if (l.valueOf() == r.valueOf()) return {};
    return r;
  }

  return Object.keys(r).reduce((acc, key) => {
    if (!l.hasOwnProperty(key)) return { ...acc, [key]: r[key] }; // return added r key

    const difference = Diff(l[key], r[key]);

    if (isObject(difference) && isEmpty(difference) && !isDate(difference)) return acc; // return no diff

    return { ...acc, [key]: difference }; // return updated key
  }, deletedValues);
}

export function newGuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function elaborateJSON(payload: string | null, beautify: boolean = false): string | null {
  if (!payload) return payload;
  var obj = JSON.parse(payload);
  let json = null;
  if (beautify) json = JSON.stringify(obj, undefined, 4);
  //beautify JSON
  else json = JSON.stringify(obj); //shrink JSON
  return json;
}

export function getFieldValue(formValue: any, field: string): any {
  let val = null;
  if (formValue !== null && formValue !== undefined && field) {
    val = formValue[field];
  }
  return val;
}

export function fromContext(data: any, key: string): any {
  if (!data) return null;
  let prefix = key;
  let dotIndex = key.indexOf(".");
  let arrayIndexStart = key.indexOf("[");
  let arrayIndexEnd = key.indexOf("]");

  if (dotIndex >= 0) {
    prefix = key.substr(0, dotIndex);
  } else if (arrayIndexStart >= 0 && arrayIndexEnd > 0) {
    prefix = key.substr(0, arrayIndexStart);
  }

  let result = null;
  if (arrayIndexStart > 0 && arrayIndexStart < dotIndex) {
    result = fromContext(data, prefix);
  } else {
    result = data[prefix];
  }
  if (dotIndex >= 0 && result) {
    result = fromContext(result, key.substr(dotIndex + 1));
  } else if (arrayIndexStart >= 0 && arrayIndexEnd > 0 && result) {
    if (Array.isArray(result)) {
      let lenght = arrayIndexEnd - arrayIndexStart;
      let position = key.substr(arrayIndexStart + 1, lenght - 1);
      switch (position) {
        case "first":
          {
            result = result[0];
          }
          break;
        case "last":
          {
            result = result[(<Array<any>>result).length - 1];
          }
          break;
        default:
          {
            let index = +position;
            if (index >= 0) {
              result = result[index];
            } else {
              result = null;
            }
          }
          break;
      }
    } else {
      result = null;
    }
  }
  return result;
}

export function parserWithFunction(data: any, key: string): string {
  // ////console.log("parserWithFunction data ->",data);
  // ////console.log("parserWithFunction key ->",key);

  let result: any = null;
  let colonsIndexStart = key.indexOf("|");
  if (colonsIndexStart >= 0) {
    switch (key.substr(0, colonsIndexStart).toLowerCase()) {
      case "exist":
        {
          let paramsStr = key.substr(colonsIndexStart + 1, key.length - colonsIndexStart);
          let params = paramsStr.split(",");
          if ((params.length = 3)) {
            let value = fromContext(data, params[0]);
            let strData = "";
            if (value) {
              strData = params[1];
            } else {
              strData = params[2];
            }
            if (strData[0] == '"' || strData[0] == "'") {
              result = parserString(strData.substr(1, strData.length - 2), data);
            } else {
              result = fromContext(data, strData);
            }
          }
        }
        break;
    }
  } else {
    result = fromContext(data, key);
  }
  return result;
}

export function parserString(str:any, data:any): any {
  return str.replace(/\{ *([\w_.:,'|\-\[\]]+) *\}/g, (str:any, key:any) => {
    let value = parserWithFunction(data, key);
    if (value === undefined || value === null) {
      value = "";
    } else if (typeof value === "function") {
      //value = value(data);
    }
    return value;
  });
}

export function deepClone<T>(data: T): T | null {
  if (data === null || data === undefined) return null;
  return JSON.parse(JSON.stringify(data));
}

/**
 * Crea un deep clone sicuro per DTO usando structuredClone con fallback
 * 
 * @param obj Oggetto da clonare
 * @returns Clone profondo dell'oggetto
 */
export function safeClone<T>(obj: T): T {
  if (!obj) return obj;
  
  try {
    // Usa structuredClone se disponibile (browser moderni)
    if (typeof structuredClone === 'function') {
      return structuredClone(obj);
    }
    
    // Fallback JSON per compatibilità
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.warn('Errore durante il clone:', error);
    return obj;
  }
}

export function log(title: string, data: any) {
  //console.log(title, deepClone(data));
}

export function logError(title: string, data: any) {
  console.error(title, deepClone(data));
}

export function logWarn(title: string, data: any) {
  console.warn(title, deepClone(data));
}

export function arrayFirst(array: any[]) {
  if (!array) return null;
  if (!Array.isArray(array)) return null;
  return array[0];
}

export function arrayLast(array : any[]) {
  if (!array) return null;
  if (!Array.isArray(array)) return null;
  if (!(array.length > 0)) return null;
  return array[array.length - 1];
}

export function arrayFirstByField(array: any[] | any, key: string | any, fieldName: string | any) {
  if (!array) return null;
  if (!Array.isArray(array)) return null;
  let i = 0;
  while (array[i]) {
    if (array[i][fieldName] == key) return array[i];
    i++;
  }
  return null;
}

export async function asyncForEach(array: any[] , callback:any) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export function dateRangeOverlaps(date1_start: Date | any, date1_end: Date | any, date2_start: Date, date2_end: Date): boolean {
  // Se tutto null o tutto uguale restituisco l'intersezione
  if (date1_start == date2_start && date1_end == date2_end) {
    return true;
  }

  // Se entrambe le date di uno dei due range sono null o undefined mentre l'altro range ha almeno una delle due date come limite non ho l'intersezione
  // perchè ho un range con inizio e/o fine e uno generico da utilizzare quando il primo non risulta valido
  if (
    (!date1_start && !date1_end && (date2_start || date2_end)) ||
    (!date2_start && !date2_end && (date1_start || date1_end))
  ) {
    return false;
  }

  // Metto un min value e un max value di default per le date non popolate per facilitare il controllo successivo
  date1_start = setTimeToZero(date1_start || new Date(0));
  date1_end = setTimeToZero(date1_end || new Date(8000000000000000));
  date2_start = setTimeToZero(date2_start || new Date(0));
  date2_end = setTimeToZero(date2_end || new Date(8000000000000000));

  // Controllo che non ci siano intersezioni e che nessuno dei due intervalli sia compreso nell'altro
  return (
    (date1_start <= date2_start && date2_start <= date1_end) ||
    (date1_start <= date2_end && date2_end <= date1_end) ||
    (date2_start <= date1_start && date1_start <= date2_end) ||
    (date2_start <= date1_end && date1_end <= date2_end)
  );
}

export function setTimeToZero(date: Date): Date {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

export function mapObjectToQueryParameters(obj: any): string {
  let params = "";
  let first = true;
  Object.keys(obj).forEach((k) => {
    if (obj[k]) {
      if (first) first = false;
      else params += "&";
      params += `${k}=${obj[k]}`;
    }
  });
  return params;
}

export function cleanFormDataBySchemaChange(form: FormGroup, oldSchema: any, newSchema: any, defaultValues: any) {
  ////console.log('cleanFormDataBySchemaChange', oldSchema, newSchema);
  if (!form || !oldSchema) return;
  for (let key in form.controls) {
    if (!oldSchema[key] || !oldSchema[key].visible) continue;
    if (!newSchema || !newSchema[key] || !newSchema[key].visible) {
      let def = defaultValues && defaultValues[key] !== undefined ? defaultValues[key] : null;
      //let def = (defaultValues && defaultValues[key] !== undefined) ? defaultValues[key] : (form.get(key).value && typeof form.get(key).value === 'string' ? '' : null);
      const controlValue = form.get('value');
      if (!controlValue || !Array.isArray(controlValue))
        form.get(key)?.setValue(def);
      ////console.log('cleanFormDataBySchemaChange - setto default', key, def,form.get(key).value);
    }
  }
}

export function mapFormValidationDynamic(form: FormGroup, schema: any) {
  // //console.log("FORM SCHEMA", schema);
  if (!form || !schema) return;

  for (let key in form.controls) {
    controlMapValidationDynamically(form, schema, key);
  }

  let validatorFunctions = Array<ValidatorFn>();
  //console.log("MainFormSchema", schema["mainForm"]);
  //Add validation logic function
  form.clearValidators();
  if (schema["mainForm"]?.validationTypes?.length > 0) {
    let identifier = newGuid();
    schema["mainForm"]?.validationTypes.forEach((validatorFunction:any) => {
      switch (validatorFunction) {
        case "BypassVat":
          validatorFunctions.push(BypassVat(schema, identifier));
          break;
        case "BypassFiscalCode":
            validatorFunctions.push(BypassFiscalCode(schema, identifier));
            break;
        case "OneContactDetailRequired":
          validatorFunctions.push(OneContactDetailRequired(schema, identifier));
          break;
      }
    });

    form.setValidators(validatorFunctions);

    // form.setValidators(OnlyNumbersAndLetterValidator(null,"a"));
  }

  form.updateValueAndValidity();
}

export function controlMapValidationDynamically(
  form: FormGroup,
  schema: any,
  key: string,
  skipRequired: Boolean = false,
  skipPattern: boolean = false
) {
  let validators = [];
  let s: InputSchemaModel = schema[key];

  if (s?.['required'] && !skipRequired) validators.push(Validators.required);

  if ((s?.validationTypes?.length || 0) > 0 && !skipPattern) {
    (s.validationTypes || []).forEach((x) => {
      let type: string = x.type.toLowerCase();
      switch (type) {
        case "sdi":
          validators.push(Validators.pattern(SDIvalidation));
          break;
        case "pasdi":
          validators.push(Validators.pattern(publicAdministrationSDIvalidation));
          break;
        case "vat":
          validators.push(Validators.pattern(vatValidation));
          break;
        case "fiscalcodecompany":
          validators.push(Validators.pattern(fiscalCodeCompanyValidation));
          break;
        case "fiscalcodeperson":
          validators.push(Validators.pattern(fiscalCodePersonValidation));
          break;
        case "email":
          //validators.push(Validators.email);
          validators.push(Validators.pattern(emailAddressValidation));
          break;
        case "genericphonenumber":
          validators.push(Validators.pattern(genericPhoneNumberValidation));
          break;
        case "zipcode":
          validators.push(Validators.pattern(zipCodeValidation));
          break;
        case "province":
          validators.push(Validators.pattern(provinceValidation));
          break;
        case "iban":
          validators.push(Validators.pattern(ibanValidation));
          break;
        case "date":
          validators.push(Validators.pattern(dateValidation));
          break;
      }
    });
  }

  if(form){
    if (validators.length > 0) {
      // //console.log("mapFormValidationDynamic control validators", key, validators, form.get(key));
      form.get(key)?.setValidators(validators);
    } else {
      form.get(key)?.clearValidators();
    }
    form.get(key)?.updateValueAndValidity();
  }  
}

export function OnlyNumbersAndLetterValidator(regexPattern: RegExp, propertyName: string): ValidatorFn {
  //return (currentControl: AbstractControl): { [key: string]: any } => {
  return (currentControl: AbstractControl): any => {
    if (!regexPattern.test(currentControl.value)) {
      let temp:any = {};
      temp[propertyName] = true;
      return temp;
    }
  };
}

var globalVariablesContainer:any = {};
// var globalFormDataMemory = null;
// var glboalFiscalCodeMemory = null;
// var vatNumberValidatorChanged = false;
// var globalCountry = null;
// var isResetVatAndFIscalCode = true;
export function BypassVat(schema: any, identifier: string): ValidatorFn {
  if (!globalVariablesContainer[identifier]) {
    globalVariablesContainer[identifier] = {
      creationDate: new Date(),
      vatNumberValidatorChanged: false,
      isResetVatAndFIscalCode: true,
      inhertiBillingChange: false,
    };
  }

  return (form: FormGroup |any ): { [key: string]: any } | ValidatorFn | null   => {
    let formData = form.getRawValue();
    let variables = globalVariablesContainer[identifier];
    if (isEqual(formData, variables.globalFormDataMemoryBypassVat)) return null;

    variables.globalFormDataMemoryBypassVat = formData;

    let vatControl = form.get("vatNumber");
    let fiscalCodeControl = form.get("fiscalCode");
    let emailControl = form.get("email");
    
    // IF BILLING IS TO THE HOLDER COMPANY VAT,FISCALCODE AND EMAIL ARE NOT REQUIRED
    // //console.log("BypassVat -- FORMDATA", formData);
    if (formData.inheritBilling) {
      if (!variables.inhertiBillingChange || !isEqual(variables.globalCountryBilling, formData?.address?.country)) {
        fiscalCodeControl?.clearValidators();
        controlMapValidationDynamically(form, schema, "fiscalCode", true);
        emailControl?.clearValidators();
        controlMapValidationDynamically(form, schema, "email", true);
        variables.inhertiBillingChange = true;

        // IF NATIONALITY IS NOT ITALIAN DISABLE ALL VALIDATORS FOR VAT
        // IF IS ITALIAN LEAVE PATTERN VALIDATOR
        variables.globalCountryBilling = formData?.address?.country;
        if (formData?.address?.country && formData.address.country.toUpperCase() != "IT") {
          vatControl?.clearValidators();
          vatControl?.updateValueAndValidity();
          ////console.log("BypassVat -- BILLING - VAT CLEAR ALL");
        } else {
          vatControl?.clearValidators();
          controlMapValidationDynamically(form, schema, "vatNumber", true, false);
          ////console.log("BypassVat -- BILLING - VAT ITALIAN STYLE");
        }

        //console.log("BypassVat -- INHERIT BILLING CASE - REMOVE VALIDATORS");
      }
      return null;
    } else {
      if (variables.inhertiBillingChange) {
        vatControl?.clearValidators();
        controlMapValidationDynamically(form, schema, "vatNumber");
        fiscalCodeControl?.clearValidators();
        controlMapValidationDynamically(form, schema, "fiscalCode");
        emailControl?.clearValidators();
        controlMapValidationDynamically(form, schema, "email");
        variables.inhertiBillingChange = false;
        //console.log("BypassVat -- INHERIT VALIDATORS - RE ADDING VALLIDATORS");
      }
    }

    // IF NATION IS NOT ITALIAN REMOVE VAT AND FISCAL CODE
    // (VAT IS ONLY REQUIRED  BUT WITHOUT THE PATTERN)
    //  //console.log("COUNTRY", formData?.address, variables.globalCountry);
    if (formData?.address?.country && formData.address.country.toUpperCase() != "IT") {
      variables.isResetVatAndFIscalCode = false;
      if (!isEqual(variables.globalCountry, formData?.address?.country)) {
        vatControl?.clearValidators();
        controlMapValidationDynamically(form, schema, "vatNumber", false, true);
        fiscalCodeControl?.clearValidators();
        fiscalCodeControl?.updateValueAndValidity();
        //console.log("BypassVat -- TOGLI I CONTROLLI PIVA E CODFISCALE");
        variables.globalCountry = formData?.address?.country;
      }
    } else {
      if (!variables.isResetVatAndFIscalCode) {
        vatControl?.clearValidators();
        controlMapValidationDynamically(form, schema, "vatNumber");
        fiscalCodeControl?.clearValidators();
        controlMapValidationDynamically(form, schema, "fiscalCode");
        variables.isResetVatAndFIscalCode = true;
        //console.log("BypassVat -- PIVA E CODFISCALE VALIDAZIONE RIMESSA");
      }
    }

    if (isEqual(fiscalCodeControl?.value, variables.glboalFiscalCodeMemory)) return null;

    variables.glboalFiscalCodeMemory = fiscalCodeControl?.value;

    if (!vatControl || !fiscalCodeControl) return null;
    if (fiscalCodeControl.valid) {
      let startsWithnumbersRegExp = new RegExp("^[0-9]");
      if (startsWithnumbersRegExp.test(formData.fiscalCode)) {
        // disable VAT required control
        vatControl.clearValidators();
        controlMapValidationDynamically(form, schema, "vatNumber", true);
        //vatControl.updateValueAndValidity();
        variables.vatNumberValidatorChanged = true;
        //console.log("BypassVat -- REMOVE REQUIRED VAT");
      } else {
        if (variables.vatNumberValidatorChanged) {
          controlMapValidationDynamically(form, schema, "vatNumber");
          vatControl.updateValueAndValidity();
          variables.vatNumberValidatorChanged = false;
          //console.log("BypassVat -- SET REQUIRED VAT");
        }
      }
    } else {
      if (variables.vatNumberValidatorChanged) {
        controlMapValidationDynamically(form, schema, "vatNumber");
        vatControl.updateValueAndValidity();
        variables.vatNumberValidatorChanged = false;
        //console.log("BypassVat -- SET REQUIRED VAT");
      }
    }

    return null;
  };
}

export function BypassFiscalCode(schema: any, identifier: string): ValidatorFn {
  if (!globalVariablesContainer[identifier]) {
    globalVariablesContainer[identifier] = {
      creationDate: new Date(),
      vatNumberValidatorChanged: false,
      isResetVatAndFIscalCode: true,
      inhertiBillingChange: false,
    };
  }

  return (form: FormGroup |any ): { [key: string]: any } | ValidatorFn | null   => {
    let formData = form.getRawValue();
    let variables = globalVariablesContainer[identifier];
    if (isEqual(formData, variables.BypassFiscalCode)) return null;

    variables.BypassFiscalCode = formData;

    let fiscalCodeControl = form.get("fiscalCode");
    let emailControl = form.get("email");
    
    // IF BILLING IS TO THE HOLDER COMPANY VAT,FISCALCODE AND EMAIL ARE NOT REQUIRED
    if (formData.inheritBilling) {
      if (!variables.inhertiBillingChange || !isEqual(variables.globalCountryBilling, formData?.address?.country)) {
        emailControl?.clearValidators();
        controlMapValidationDynamically(form, schema, "email", true);
        variables.inhertiBillingChange = true;

        // IF NATIONALITY IS NOT ITALIAN DISABLE ALL VALIDATORS FOR VAT
        // IF IS ITALIAN LEAVE PATTERN VALIDATOR
        variables.globalCountryBilling = formData?.address?.country;
        if (formData?.address?.country && formData.address.country.toUpperCase() != "IT") {
          fiscalCodeControl?.clearValidators();
          fiscalCodeControl?.updateValueAndValidity();
          ////console.log("BypassFiscalCode -- BILLING - VAT CLEAR ALL");
        } else {
          fiscalCodeControl?.clearValidators();
          controlMapValidationDynamically(form, schema, "fiscalCode", true, false);
          ////console.log("BypassFiscalCode -- BILLING - VAT ITALIAN STYLE");
        }

        //console.log("BypassFiscalCode -- INHERIT BILLING CASE - REMOVE VALIDATORS");
      }
      return null;
    } else {      
      if (variables.inhertiBillingChange) {
        fiscalCodeControl?.clearValidators();
        controlMapValidationDynamically(form, schema, "fiscalCode");
        emailControl?.clearValidators();
        controlMapValidationDynamically(form, schema, "email");
        variables.inhertiBillingChange = false;
      }
    }

    // IF NATION IS NOT ITALIAN REMOVE FISCAL CODE
    // (VAT IS ONLY REQUIRED  BUT WITHOUT THE PATTERN)
    //  //console.log("COUNTRY", formData?.address, variables.globalCountry);
    if (formData?.address?.country && formData.address.country.toUpperCase() != "IT") {
      variables.isResetVatAndFIscalCode = false;
      if (!isEqual(variables.globalCountry, formData?.address?.country)) {
        fiscalCodeControl?.clearValidators();
        controlMapValidationDynamically(form, schema, "fiscalCode", false, true);
        variables.globalCountry = formData?.address?.country;
      }
    } else {
      if (!variables.isResetVatAndFIscalCode) {
        fiscalCodeControl?.clearValidators();
        controlMapValidationDynamically(form, schema, "fiscalCode");
        variables.isResetVatAndFIscalCode = true;
        //console.log("BypassVat -- PIVA E CODFISCALE VALIDAZIONE RIMESSA");
      }
    }

    if (isEqual(fiscalCodeControl?.value, variables.glboalFiscalCodeMemory)) return null;

    variables.glboalFiscalCodeMemory = fiscalCodeControl?.value;

    if (!fiscalCodeControl) return null;
        
    return null;
  };
}

export function OneContactDetailRequired(schema: any, identifier: string): ValidatorFn {
  if (!globalVariablesContainer[identifier]) {
    globalVariablesContainer[identifier] = {
      creationDate: new Date(),
    };
  }
  return (form: FormGroup | any): { [key: string]: any } | null  => {
    let formData = form.getRawValue();
    let variables = globalVariablesContainer[identifier];
    if (
      variables.globalFormDataMemoryOneContactDetailRequired?.phone === formData.phone &&
      variables.globalFormDataMemoryOneContactDetailRequired?.mobilePhone === formData.mobilePhone &&
      variables.globalFormDataMemoryOneContactDetailRequired?.email === formData.email
    ) {
      return null;
    }

    variables.globalFormDataMemoryOneContactDetailRequired = formData;
    let phoneControl = form.get("phone");
    let mobilePhoneControl = form.get("mobilePhone");
    let emailControl = form.get("email");
    if (formData.phone && phoneControl?.valid) {
      controlMapValidationDynamically(form, schema, "mobilePhone", true);
      controlMapValidationDynamically(form, schema, "email", true);
    } else if (formData.mobilePhone && mobilePhoneControl?.valid) {
      controlMapValidationDynamically(form, schema, "phone", true);
      controlMapValidationDynamically(form, schema, "email", true);
    } else if (formData.email && emailControl?.valid) {
      controlMapValidationDynamically(form, schema, "mobilePhone", true);
      controlMapValidationDynamically(form, schema, "phone", true);
    } else {
      controlMapValidationDynamically(form, schema, "email");
      controlMapValidationDynamically(form, schema, "mobilePhone");
      controlMapValidationDynamically(form, schema, "phone");
    }

    return null;
  };
}

export function escapeRegExp(string:string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function replaceAll(str:string, find:string, replace:string) {
  if (!str) return str;
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

export function RemoveRequiredValidator(control: AbstractControl, schema: any) {}

export function removeEmptyProperty(obj:any) {
  if (typeof obj === "object" && obj !== null) {
    for (var propName in obj) {
      //console.log("propName " + propName + " " + typeof obj[propName], obj[propName]);
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] == "" || isEmptyObjectJson(obj[propName])) {
        //console.log("DELETE PROPERTY [1]", obj[propName]);
        delete obj[propName];
      } else if (isEmptyObjectJson(obj)) {
        //console.log("DELETE PROPERTY [2]", typeof obj,Object.keys(obj[propName])?.length,obj[propName]);
        delete obj[propName];
      } else removeEmptyProperty(obj[propName]);
    }
  }
}

export function isEmptyObjectJson(obj:any) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
}

export const isEmptyValues = (o:any) => !Object.keys(o).find(x=> o[x] !== null && o[x] !== undefined);
export function isEmptyNastedValues(obj:any, ignoreEmptyString = false) {
   let noEmptyItems = Object.keys(obj).filter(x=> obj[x] !== null && obj[x] !== undefined && !(ignoreEmptyString && obj[x] === ''));
   if(noEmptyItems.length>0){
    let i=0;
    while(noEmptyItems[i]){
        let x = noEmptyItems[i];
        if(typeof obj[x] === "object"){
          let nasterd = isEmptyNastedValues(obj[x])
          if(!nasterd) return false;
        } 
        else if(Array.isArray(obj[x])){
          if(obj[x].length != 0){
            obj[x].forEach((k:any) =>{
              let nasterd = isEmptyNastedValues(k)
              if(!nasterd) return false;
              return true;
            })
          }
        }
        else {
          return obj[x]===null || obj[x]===undefined ;
        }
        i++;
      }    
   }
   return true;
}

export function setFormTree(form:any, path:string, value:any){
  let arr = path.split(".");
  let f = form;
  for (let i = 0; i < arr.length; i++) {
    f = f.get(arr[i]);
  }
  f.setValue(value);
}

export function getValueItemFromPath(obj:any, path:string){
  if(!obj || !path) return null;
  let arr = path.split(".");
  let f = obj;
  for (let i = 0; i < arr.length; i++) {
    f = f[arr[i]];
    if(!f) break;
  }
  return f;
}

export function capitalizeWord(str:string):string | null {
  if(!str) return null;
  if(typeof str != 'string' ) return null;
  const arr = str.split(" ");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  const str2 = arr.join(" ");
  return str2;
}

export function isDirtyFunction(data:any, old:any, ignore = false){
  let diff1 = Diff(old, data);
  let diff2 = Diff(data, old);
  let value1 = !isEmptyNastedValues(diff1, ignore);
  let value2 = !isEmptyNastedValues(diff2, ignore);
  return value1 || value2;
}

export function isBigDirtyFunction(data:any, old:any, options:DiffOptions = {}){
  // console.log("isBigDirtyFunction", {old, data});
  let diff1 = BigDiff(old, data, options);
  let diff2 = BigDiff(data, old, options);
  let value1 = !isEmptyNastedValues(diff1, false);
  let value2 = !isEmptyNastedValues(diff2, false);
  console.log("isBigDirtyFunction", diff1, diff2, value1 || value2);
  return value1 || value2;
}

export function deepMerge(lhs: any, rhs: any): any {
  if (lhs === rhs) return lhs;

  if (lhs == null) return rhs;
  if (rhs == null) return lhs;

  const lhsIsObj = isObject(lhs);
  const rhsIsObj = isObject(rhs);

  if (lhsIsObj !== rhsIsObj) return rhs;

  if (!lhsIsObj && !rhsIsObj) return rhs;

  for (const key of Object.keys(rhs)) {
    if (rhs[key] === undefined) continue;
    lhs[key] = key in lhs ? deepMerge(lhs[key], rhs[key]) : rhs[key];
  }

  return lhs;
}

export function sortLike<T>(reference: T[], target: T[], key: keyof T): T[] {
  // Creo una mappa value -> posizione dal reference
  const orderMap = new Map(
    reference.map((item, index) => [item[key], index])
  );

  return [...target].sort((a, b) => {
    const indexA = orderMap.has(a[key]) ? orderMap.get(a[key])! : Infinity;
    const indexB = orderMap.has(b[key]) ? orderMap.get(b[key])! : Infinity;
    return indexA - indexB;
  });
}