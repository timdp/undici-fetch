const forbiddenHeaderNames = [
	'accept-charset',
	'accept-encoding',
	'access-control-request-headers',
	'access-control-request-method',
	'connection',
	'content-length',
	'cookie',
	'cookie2',
	'data',
	'dnt',
	'expect',
	'host',
	'keep-alive',
	'origin',
	'referer',
	'te',
	'trailer',
	'transfer-encoding',
	'upgrade',
	'via'
]

/**
 * Returns true if the header name is considered forbidden
 * @param {string} name
 */
function isForbiddenHeaderName (name) {
  return (
    forbiddenHeaderNames.indexOf(name) !== -1 ||
    String.prototype.includes.call(name, 'proxy-') ||
    String.prototype.includes.call(name, 'sec-')
  )
}

/**
 * Returns true if the response header name is considered forbidden
 * @param {string} name
 */
function isForbiddenResponseHeaderName (name) {
  return (
    name === 'set-cookie' ||
    name === 'set-cookie2'
  )
}

function validateHeaderName (name) {
  if (!name || name.length === 0) throw TypeError(`Invalid header name ${name}`)

  for (let i = 0, cc = name.charCodeAt(0); i < name.length; i++, cc = name.charCodeAt(i)) {
    if (
    // check most common characters first
      (cc >= 97 && cc <= 122) || // a-z
      (cc >= 65 && cc <= 90) || // A-z
      cc === 45 || // -
      cc === 33 || // !
      (cc >= 35 && cc <= 39) || // # $ % & '
      cc === 42 || // *
      cc === 43 || // +
      cc === 46 || // .
      (cc >= 48 && cc <= 57) || // 0-9
      (cc >= 94 && cc <= 96) || // ^ _ `
      cc === 124 || // |
      cc === 126 // ~
    ) {
      continue
    } else {
      throw TypeError(`Invalid header name ${name}`)
    }
  }
}

function validateHeaderValue (name, value) {
  if (!value || value.length === 0) throw TypeError(`Invalid value ${value} for header ${name}`)

  for (let i = 0, cc = value.charCodeAt(0); i < value.length; i++, cc = value.charCodeAt(i)) {
    if ((cc >= 32 && cc <= 126) || (cc >= 128 && cc <= 255) || cc === 9) {
      continue
    } else {
      throw TypeError(`Invalid value ${value} for header ${name}`)
    }
  }
}

module.exports = {
	isForbiddenHeaderName,
	isForbiddenResponseHeaderName,
	validateHeaderName,
	validateHeaderValue
}