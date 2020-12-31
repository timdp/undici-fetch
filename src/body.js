'use strict'

const { isReadable } = require('./utils')

const kBody = Symbol('body')
const kBodyUsed = Symbol('bodyUsed')

/** 
 * @typedef {import('stream').Readable} Readable 
 * @typedef {Readable | null} BodyInput
 * */


/**
 * Represents a WHATWG Fetch Spec [Body Mixin](https://fetch.spec.whatwg.org/#body-mixin)
 */
class Body {
  /**
   * @param {BodyInput} input
   */
  constructor (input = null) {
    if (input != null && !isReadable(input)) {
      throw Error('body must be undefined, null, or a readable stream')
    }

    this[kBody] = input
    this[kBodyUsed] = false
  }

  get body () {
    return this[kBody]
  }

  get bodyUsed () {
    return this[kBodyUsed]
  }

  async arrayBuffer () {
    if (this[kBody] == null) return null

    const acc = []
    for await (const chunk of this[kBody]) {
      if (!this[kBodyUsed]) this[kBodyUsed] = true
      acc.push(chunk)
    }
    return Buffer.concat(acc)
  }

  async blob () {
    // discuss later
    throw Error('Body.blob() is not supported yet by undici-fetch')
  }

  async formData () {
    // discuss later
    throw Error('Body.formData() is not supported yet by undici-fetch')
  }

  /**
   * @returns {Promise<unknown | null>}
   */
  async json () {
    return JSON.parse(await this.text())
  }

  async text () {
    if (this[kBody] == null) return null

    this[kBody].setEncoding('utf8')
    let res = ''
    for await (const chunk of this[kBody]) {
      if (!this[kBodyUsed]) this[kBodyUsed] = true
      res += chunk
    }
    return res
  }
}

module.exports = Body
