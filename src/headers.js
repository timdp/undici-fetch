'use strict'

const { types } = require('util')

const { normalizeAndValidateHeaderName, normalizeAndValidateHeaderArguments } = require('./utils')

const kHeaders = Symbol('headers')

/**
 * @typedef {[string, string][] | Record<string, string>} HeadersInit
 */

/**
 * Represents a WHATWG Fetch Spec [Header class](https://fetch.spec.whatwg.org/#headers-class)
 */
class Headers {
  /**
   * @param {HeadersInit} init Initial header list to be cloned into the new instance
   */
  constructor (init) {
    this[kHeaders] = new Map()

    if (init) {
      if (Array.isArray(init)) {
        for (let i = 0, header = init[0]; i < init.length; i++, header = init[i]) {
          if (header.length !== 2) throw TypeError('header entry must be of length two')
          this.append(header[0], header[1])
        }
      } else if (typeof init === 'object' && !types.isBoxedPrimitive(init)) {
        for (const [name, value] of Object.entries(init)) {
          this.append(name, value)
        }
      }
    }
  }

  /**
   * Adds an entry to the instance
   * @param {string} name 
   * @param {string} value 
   */
  append (name, value) {
    const [normalizedHeaderName, normalizedHeaderValue] = normalizeAndValidateHeaderArguments(name, value)

    const existingHeaderValue = Map.prototype.get.call(this[kHeaders], normalizedHeaderName)
    if (existingHeaderValue) {
      Map.prototype.set.call(this[kHeaders], normalizedHeaderName, existingHeaderValue.concat([normalizedHeaderValue]))
    } else {
      Map.prototype.set.call(this[kHeaders], normalizedHeaderName, [normalizedHeaderValue])
    }
  }

  /**
   * Removes an entry from the instance
   * @param {string} name 
   */
  delete (name) {
    const normalizedHeaderName = normalizeAndValidateHeaderName(name)

    Map.prototype.delete.call(this[kHeaders], normalizedHeaderName)
  }

  /**
   * Retrieves an entry from the instance. For headers with multiple values, they are returned in a string joined by `', '` characters.
   * 
   * For example if the header entry `'foo'` had values `'fuzz'` and `'buzz'`, calling `get('foo')` will return `'fuzz, buzz'`.
   * @param {string} name
   * @returns {string | null}
   */
  get (name) {
    const normalizedHeaderName = normalizeAndValidateHeaderName(name)

    const values = Map.prototype.get.call(this[kHeaders], normalizedHeaderName)
    return values === undefined ? null : values.join(', ')
  }

  /**
   * Checks for the existence of an entry in the instance
   * @param {string} name 
   * @returns {boolean}
   */
  has (name) {
    const normalizedHeaderName = normalizeAndValidateHeaderName(name)

    return Map.prototype.has.call(this[kHeaders], normalizedHeaderName)
  }

  /**
   * Overrides an entry on the instance. Use [append]{@link Headers.append} for non-destructive operation.
   * @param {*} name 
   * @param {*} value 
   */
  set (name, value) {
    const [normalizedHeaderName, normalizedHeaderValue] = normalizeAndValidateHeaderArguments(name, value)

    Map.prototype.set.call(this[kHeaders], normalizedHeaderName, [normalizedHeaderValue])
  }

  /**
   * @returns {[string, string[]]}
   */
  * [Symbol.iterator] () {
    for (const header of this[kHeaders]) {
      yield header
    }
  }
}

module.exports = Headers
