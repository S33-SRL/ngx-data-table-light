/**
 * Custom template functions for NgxDataTableLight
 * These functions can be used in templates with @ syntax
 */

/**
 * Converts a value to a number
 * Usage: {@Number|{value}}
 */
export function Number(params: any[]): number | null {
  if (!params || params.length < 1) return null;
  const value = params[0];
  if (value === null || value === undefined) return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
}

/**
 * Formats an address object as HTML
 * Usage: {#@toAddress|} (DataAware function - receives the whole row data)
 *
 * This is a DataAware function (#@) which receives:
 * - otherData: additional context data
 * - data: the current row data
 * - params: any additional parameters
 */
export function toAddress(otherData: any, data: any, params: any[]): string {
  if (!data || !data.address) return '';

  const addr = data.address;
  const parts: string[] = [];

  // Street and number
  if (addr.street) {
    let line = addr.street;
    if (addr.streetNumber) line += ` ${addr.streetNumber}`;
    parts.push(line);
  }

  // City and province
  if (addr.city) {
    let line = addr.city;
    if (addr.province) line += ` (${addr.province})`;
    parts.push(line);
  }

  // ZIP code
  if (addr.zipCode) {
    parts.push(`CAP: ${addr.zipCode}`);
  }

  // Country
  if (addr.country) {
    parts.push(addr.country);
  }

  return parts.join('<br/>');
}

/**
 * All custom functions that should be registered with the templater
 */
export const CUSTOM_FUNCTIONS = {
  Number,
  toAddress
};
