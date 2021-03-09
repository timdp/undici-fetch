// 2.1 https://fetch.spec.whatwg.org/#url

const localSchemes = new Set([ 'about', 'blob', 'data' ])
function isLocalScheme (scheme) {
	return localSchemes.has(scheme)
}
function isLocalURL (url) {
	return isLocalScheme(url.scheme)
}
const HTTPSchemes = new Set([ 'http', 'https' ])
function isHTTPScheme (scheme) {
	return HTTPSchemes.has(scheme)
}
function isFetchScheme (scheme) {
	return isLocalScheme(scheme) || scheme === 'file' || isHTTPScheme(scheme)
}

// 2.2 https://fetch.spec.whatwg.org/#http

const HTTPTabOrSpace = new Set([ 0x0009, 0x0020 ])
const HTTPWhitespace =  new Set([ 0x000A, 0x000D, ...HTTPTabOrSpace ])
const HTTPNewlineByte =  new Set([ 0x0A, 0x0D ])
const HTTPTabOrSpaceByte =  new Set([ 0x09, 0x20 ])
const HTTPWhitespaceByte =  new Set([ ...HTTPNewlineByte, ...HTTPTabOrSpace ])

function collectAnHTTPQuotedString () { /* TODO */}

// function collectAnHTTPQuotedString (input, position, extractValueFlag) {
//     let positionStart = position
//     let value = ''

//     assert(input.codePointAt(position) === 0x0022, new Error('First character in input must be U+0022 (")'))

//     position++
//     while (true) {
//         let codePoint = input.codePointAt(position)
//         while ( position < input.length && (codePoint !== 0x0022 || codePoint !== 0x005C)) {
//             value += String.fromCodePoint(codePoint)
//             position++
//             codePoint = input.codePointAt(position)
//         }

//         if (position >= input.length) {
//             break
//         }

//         const quoteOrBackslash = input.codePointAt(position)

//         position++

//         if (quoteOrBackslash === 0x005C) {
//             if (position >= input.length) {
//                 value += String.fromCodePoint(0x005C)
//                 break
//             }
//             value += input.charAt(position)
//             position++
//         } else {
//             assert(quoteOrBackslash === 0x0022, new Error('quoteOrBackslash expected to be "'))
//             break
//         }
//     }

//     console.log(position)

//     if (extractValueFlag) {
//         return value
//     }

//     return input.substring(positionStart, position+1)
// }

// const collectAnHTTPQuotedStringTests = [
//     ["\"\\", "\"\\", "\\", 2],
//     ["\"Hello\" World", "\"Hello\"", "Hello", 7],
//     ["\"Hello \\\\ World\\\"\"", "\"Hello \\\\ World\\\"\"", "Hello \\ World\"", 18]
// ]

// function testCollectAnHTTPQuotedString (tests) {
//     const results = []
//     for (const [input, expectedOutput, expectedExtractValueOutput, finalPosValue] of tests) {
//         results.push({
//             input,
//             output: {
//                 expected: expectedOutput,
//                 actual: collectAnHTTPQuotedString(input, 0)
//             },
//             extractValueOutput: {
//                 expected: expectedExtractValueOutput,
//                 actual: collectAnHTTPQuotedString(input, 0, true)
//             }
//         })
//     }
//     console.table(results)
// }

// testCollectAnHTTPQuotedString(collectAnHTTPQuotedStringTests)

// 2.2.1 https://fetch.spec.whatwg.org/#methods

const CORSSafelistedMethods = new Set(['GET', 'HEAD', 'POST'])

function isCORSSafelistedMethod (method) {
	return CORSSafelistedMethods.has(method)
}

const forbiddenMethods = new Set(['CONNECT', 'TRACE', 'TRACK'])

function isForbiddenMethod (method) {
	return forbiddenMethods.has(method.toUpperCase())
}

const normalizedMethods = new Set([...CORSSafelistedMethods, 'DELETE', 'OPTIONS', 'PUT'])
function normalizeMethod (method) {
	const normalizedMethod = method.toUpperCase()
	return normalizeMethod.has(normalizedMethod)? normalizeMethod : method
}

// 2.2.2 https://fetch.spec.whatwg.org/#terminology-headers

class HeadersList {
	constructor () {
		this.headers = new Map()
	}

	// https://fetch.spec.whatwg.org/#concept-header-list-get-structured-header
	getStructuredFieldValue (name, type) {
		assert(
			type === 'dictionary' || type === 'list' || type === 'item',
			new Error('type must be one of "dictionary", "list", or "item"')
		)
		const value = this.get(name)
		if (value === null) {
			return null
		}
		const result = parseStructuredFields(value, type)
		return !result ? null : result
	}

	// https://fetch.spec.whatwg.org/#concept-header-list-set-structured-header
	setStructureFieldValue (name, structuredValue) {
		const serializedValue = serializeStructuredField(structuredValue)
		this.set(name, serializedValue)
	}

	// https://fetch.spec.whatwg.org/#header-list-contains
	contains (name) {
		return this.headers.has(name.toLowerCase())
	}

	// https://fetch.spec.whatwg.org/#concept-header-list-get-decode-split
	get (name) {
		name = name.toLowerCase()
		const headers = this.headers.get(name)
		return headers === undefined ? null : headers.join(', ')
	}

	// https://fetch.spec.whatwg.org/#concept-header-list-get-decode-split
	getDecodeAndSplit (name) {
		const initialValue = this.get(name)
		if (initialValue === null) {
			return null
		}
		const input = isomorphicDecode(initialValue)
		let position = 0
		let values = []
		let value = ''
		while (position < input.length) {
			const codePoint = input.codePointFrom(position)
			while (position < input.length && (codePoint !== 0x0022 || codePoint !== 0x002C)) {
				value += codePoint
				position++
			}
			if (position < input.length) {
				if (codePoint === 0x0022) {
					value += collectAnHTTPQuotedString(input, position)
					if (position < input.length) {
						continue
					}
				}
			} else {
				assert(codePoint === 0x002C, new Error('expected a U+002c (,) character'))
				position++
			}
			// TODO: 3. Remove all HTTP tab or space from the start and end of value.
			values.push(value)
			value = ''
		}
		return values
	}

	// https://fetch.spec.whatwg.org/#concept-header-list-append
	append(name, value) {
		name = name.toLowerCase()
		const header = this.headers.get(name)
		if (header === undefined) {
			this.headers.set(name, [value])
		} else {
			header.push(value)
		}
	}

	// https://fetch.spec.whatwg.org/#concept-header-list-delete
	delete (name) {
		name = name.toLowerCase()
		this.headers.delete(name)
	}

	// https://fetch.spec.whatwg.org/#concept-header-list-set
	set (name, value) {
		name = name.toLowerCase()
		this.headers.set(name, [value])
	}

	// https://fetch.spec.whatwg.org/#concept-header-list-combine
	combine (name, value) {
		name = name.toLowerCase()
		const header = this.headers.get(name)
		if (header === undefined) {
			this.headers.set(name, [value])
		} else {
			header[0] += `, ${value}`
		}
	}
	
	// https://fetch.spec.whatwg.org/#convert-header-names-to-a-sorted-lowercase-set
	convertHeaderNamesToSortedLowercaseSet () {
		const names = Array.from(this.headers.keys())
		const headerNames = names.map(name => name.toLowerCase())
		return headerNames.sort()
	}

	// https://fetch.spec.whatwg.org/#concept-header-list-sort-and-combine
	sortAndCombine () {
		const names = this.convertHeaderNamesToSortedLowercaseSet()
		const headers = names.map(name => {
			const value = this.get(name)
			assert(value !== null, new Error('value should not be null'))
			return [name, value]
		})
		return headers 
	} 
}

// https://tools.ietf.org/html/draft-ietf-httpbis-header-structure#section-4.2
function parseStructuredFields () { /* TODO */ }
// https://tools.ietf.org/html/draft-ietf-httpbis-header-structure#section-4.1
function serializeStructuredField () { /* TODO */ }
//https://infra.spec.whatwg.org/#isomorphic-decode
function isomorphicDecode () { /* TODO */ }

// util

function assert (condition, error) {
	if (!condition) {
		throw error
	}
}