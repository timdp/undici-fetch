'use strict'

const stream = require('stream')

/**
 * Guard for checking if obj is a Node.js Readable stream
 * @param {unknown} obj 
 * @returns {obj is import('stream').Readable}
 */
function isReadable (obj) {
  return obj instanceof stream.Stream && typeof obj._read === 'function' && typeof obj._readableState === 'object'
}

/**
 * Returns a custom TypeError for a invalid header name
 * @param {string} name 
 */
function HeaderNameValidationError (name) {
  return TypeError(`Invalid Header name: ${name}`)
}

/**
 * Returns a custom TypeError for a invalid header value
 * @param {string} name 
 * @param {string} value 
 */
function HeaderValueValidationError (name, value) {
  return TypeError(`Invalid Header value: ${value} for Header name: ${name}`)
}

/**
 * Validates a header name based on the Fetch Spec concept [Header Name](https://fetch.spec.whatwg.org/#concept-header-name)
 * @param {string} name 
 */
function validateHeaderName (name) {
  if (!name || name.length === 0) throw HeaderNameValidationError(name)

  for (let i = 0, cc = name.charCodeAt(0); i < name.length; i++, cc = name.charCodeAt(i)) {
    /* istanbul ignore else */
    if (
      // check most common characters first
      (cc >= 94 && cc <= 122) || // ^ _ ` a-z
      (cc >= 65 && cc <= 90) || // A-z
      cc === 45 || // -
      cc === 33 || // !
      (cc >= 35 && cc <= 39) || // # $ % & '
      cc === 42 || // *
      cc === 43 || // +
      cc === 46 || // .
      (cc >= 48 && cc <= 57) || // 0-9
      cc === 124 || // |
      cc === 126 // ~
    ) {
      continue
    } else {
      throw HeaderNameValidationError(name)
    }
  }
}

/**
 * Validates a header value based on the Fetch Spec concept [Header Value](https://fetch.spec.whatwg.org/#concept-header-value)
 * @param {string} name 
 * @param {string} value 
 */
function validateHeaderValue (name, value) {
  if (!value || value.length === 0) throw HeaderValueValidationError(name, value)

  for (let i = 0, cc = value.charCodeAt(0); i < value.length; i++, cc = value.charCodeAt(i)) {
    /* istanbul ignore else */
    if ((cc >= 32 && cc <= 126) || (cc >= 128 && cc <= 255) || cc === 9) {
      continue
    } else {
      throw HeaderValueValidationError(name, value)
    }
  }
}

/**
 * Normalizes and validates a header name by calling `.toLowerCase()` and [validateHeaderName]{@link validateHeaderName}
 * @param {string} name 
 * @returns {string}
 */
function normalizeAndValidateHeaderName (name) {
  const normalizedHeaderName = name.toLowerCase()
  validateHeaderName(normalizedHeaderName)
  return normalizedHeaderName
}

/**
 * Normalizes and validates a header value by calling `.trim()` and [validateHeaderValue]{@link validateHeaderValue}
 * @param {string} name 
 * @param {string} value 
 * @returns {string}
 */
function normalizeAndValidateHeaderValue (name, value) {
  const normalizedHeaderValue = value.trim()
  validateHeaderValue(name, normalizedHeaderValue)
  return normalizedHeaderValue
}

/**
 * Utility function for normalizing and validating a header entry.
 * @param {string} name 
 * @param {string} value 
 * @returns {[string, string]} [normalizedName, normalizedValue]
 */
function normalizeAndValidateHeaderArguments (name, value) {
  return [normalizeAndValidateHeaderName(name), normalizeAndValidateHeaderValue(name, value)]
}

module.exports = {
  isReadable,
  HeaderNameValidationError,
  HeaderValueValidationError,
  validateHeaderName,
  validateHeaderValue,
  normalizeAndValidateHeaderName,
  normalizeAndValidateHeaderValue,
  normalizeAndValidateHeaderArguments
}
