'use strict'

const { METHODS } = require('http')
const Body = require('./body')
const Headers = require('./headers')

/**
 * Normalizes and validates a request method. Defaults to `'GET'` if undefined is passed. Will validate a given method as a string and that it is in Node.js `http.METHODS`. Normalizes by transforming method to uppercase format.
 * @param {unknown} [method]
 */
function normalizeAndValidateRequestMethod (method) {
  if (method === undefined) {
    return 'GET'
  }

  if (typeof method !== 'string') {
    throw TypeError(`Request method: ${method} must be type 'string'`)
  }

  const normalizedMethod = method.toUpperCase()

  if (METHODS.indexOf(normalizedMethod) === -1) {
    throw Error(`Normalized request method: ${normalizedMethod} must be one of \`require('http').METHODS\``)
  }

  return normalizedMethod
}

/**
 * Returns a TypeError describing invalid use of a body on a request. For example a GET request should not have a body.
 * @param {string} method 
 */
function RequestCannotHaveBodyError (method) {
  return TypeError(`${method} Request cannot have a body`)
}

/**
 * Returns an Error when attempting to clone an already-consumed request.
 */
function RequestCloneError () {
  return Error('Cannot clone Request - bodyUsed is true')
}

/**
 * @typedef RequestInit
 * @property {string} [method] - Defaults to 'GET'
 * @property {Headers | import('./headers').HeadersInit} [headers]
 * @property {import('./body').BodyInput} [body]
 */

/**
 * Represents a WHATWG Fetch Spec [Request Class](https://fetch.spec.whatwg.org/#request-class)
 */
class Request extends Body {
  /**
   * @param {Request | string} input
   * @param {RequestInit} [init]
   */
  constructor (input, init = {}) {
    super(init.body)

    if (input instanceof Request) {
      return new Request(input.url, {
        method: input.method,
        headers: input.headers,
        body: input.body,
        ...init
      })
    }

    this.url = new URL(input)

    this.method = normalizeAndValidateRequestMethod(init.method)

    this.headers = init.headers instanceof Headers ? init.headers : new Headers(init.headers)

    if ((this.method === 'GET' || this.method === 'HEAD') && this.body !== null) {
      throw RequestCannotHaveBodyError(this.method)
    }
  }

  /**
   * Returns a new Request instance inheriting from the current instance. Throws an error if the current instance `.bodyUsed` is `true`.
   */
  clone () {
    if (this.bodyUsed) {
      throw RequestCloneError()
    }

    return new Request(this)
  }
}

module.exports = Request
