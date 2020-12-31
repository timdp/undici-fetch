/**
 * Guard for checking if obj is a Node.js Readable stream
 * @param {unknown} obj
 * @returns {obj is import('stream').Readable}
 */
export function isReadable(obj: unknown): obj is stream.Readable;
/**
 * Returns a custom TypeError for a invalid header name
 * @param {string} name
 */
export function HeaderNameValidationError(name: string): TypeError;
/**
 * Returns a custom TypeError for a invalid header value
 * @param {string} name
 * @param {string} value
 */
export function HeaderValueValidationError(name: string, value: string): TypeError;
/**
 * Validates a header name based on the Fetch Spec concept [Header Name](https://fetch.spec.whatwg.org/#concept-header-name)
 * @param {string} name
 */
export function validateHeaderName(name: string): void;
/**
 * Validates a header value based on the Fetch Spec concept [Header Value](https://fetch.spec.whatwg.org/#concept-header-value)
 * @param {string} name
 * @param {string} value
 */
export function validateHeaderValue(name: string, value: string): void;
/**
 * Normalizes and validates a header name by calling `.toLowerCase()` and [validateHeaderName]{@link validateHeaderName}
 * @param {string} name
 * @returns {string}
 */
export function normalizeAndValidateHeaderName(name: string): string;
/**
 * Normalizes and validates a header value by calling `.trim()` and [validateHeaderValue]{@link validateHeaderValue}
 * @param {string} name
 * @param {string} value
 * @returns {string}
 */
export function normalizeAndValidateHeaderValue(name: string, value: string): string;
/**
 * Utility function for normalizing and validating a header entry.
 * @param {string} name
 * @param {string} value
 * @returns {[string, string]} [normalizedName, normalizedValue]
 */
export function normalizeAndValidateHeaderArguments(name: string, value: string): [string, string];
import stream = require("node/stream");
