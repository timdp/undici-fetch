'use strict'

const { types } = require('util')
const {
  isForbiddenHeaderName,
  isForbiddenResponseHeaderName,
  validateHeaderName,
  validateHeaderValue
} = require('./headersUtils')

const hasOwnProperty = Object.prototype.hasOwnProperty

function normalize (header) {
  return header.trim()
}

const kHeadersList = Symbol('headers list')

class Headers {
  constructor (init) {
    this[kHeadersList] = {}
    this.guard = 'none'
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

  append (_name, _value) {
    validateHeaderName(_name)
    const name = _name.toLowerCase()
    validateHeaderValue(name, _value)
    const value = normalize(_value)

    if (this.guard === 'immutable') {
      throw TypeError('headers instance is immutable')
    } else if (this.guard === 'request' && isForbiddenHeaderName(name)) {
      return
    } else if (this.guard === 'response' && isForbiddenResponseHeaderName(name)) {
      return
    }

    if (hasOwnProperty.call(this[kHeadersList], name)) {
      this[kHeadersList][name].push(value)
    } else {
      this[kHeadersList][name] = [value]
    }
  }

  delete (_name) {
    const name = _name.toLowerCase()
    validateHeaderName(name)

    if (this.guard === 'immutable') {
      throw TypeError('headers instance is immutable')
    } else if (this.guard === 'request' && isForbiddenHeaderName(name)) {
      return
    } else if (this.guard === 'response' && isForbiddenResponseHeaderName(name)) {
      return
    }

    if (!hasOwnProperty.call(this.headersList, name)) {
      return
    }

    delete this[kHeadersList][name]
  }

  get (_name) {
    const name = _name.toLowerCase()
    validateHeaderName(name)

    const values = this[kHeadersList][name]
    return values === undefined ? null : values.join(', ')
  }

  has (_name) {
    const name = _name.toLowerCase()
    validateHeaderName(name)

    return hasOwnProperty.call(this.headersList, name)
  }

  set (_name, _value) {
    const name = _name.toLowerCase()
    validateHeaderName(name)
    const value = normalize(_value)
    validateHeaderValue(value)

    if (this.guard === 'immutable') {
      throw TypeError('headers instance is immutable')
    } else if (this.guard === 'request' && isForbiddenHeaderName(name)) {
      return
    } else if (this.guard === 'response' && isForbiddenResponseHeaderName(name)) {
      return
    }

    this[kHeadersList][name] = value
  }

  * [Symbol.iterator] () {
    for (const header of Object.entries(this[kHeadersList])) {
      yield header
    }
  }
}

module.exports = Headers
