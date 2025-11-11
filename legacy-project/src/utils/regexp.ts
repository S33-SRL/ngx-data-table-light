/**
 * Stub per funzioni di validazione regexp
 * Usato solo per compilazione della demo
 */

export const dateValidation = /^\d{2}\/\d{2}\/\d{4}$/;
export const emailAddressValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const fiscalCodeCompanyValidation = /^\d{11}$/;
export const fiscalCodePersonValidation = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i;
export const genericPhoneNumberValidation = /^[\d\s\-\+\(\)]+$/;
export const ibanValidation = /^[A-Z]{2}\d{2}[A-Z0-9]+$/i;
export const provinceValidation = /^[A-Z]{2}$/i;
export const publicAdministrationSDIvalidation = /^[A-Z0-9]{6}$/i;
export const SDIvalidation = /^[A-Z0-9]{7}$/i;
export const vatValidation = /^\d{11}$/;
export const zipCodeValidation = /^\d{5}$/;
