const tap = require('tap')
const Headers = require('../src/headers')

tap.test('Headers initialization', t => {
	t.plan(3)

	t.test('allows undefined', t => {
		t.plan(1)

		t.notThrow(() => new Headers())
	})

	t.test('with array of header entries', t => {
		t.plan(2)
		t.test('fails with odd length init child', t => {
			t.plan(1)
			const init = [['undici', 'fetch'], ['fetch']]
			t.throw(() => new Headers(init), TypeError('header entry must be of length two'))
		})

		t.test('allows even length init', t => {
			t.plan(1)
			const init = [['undici', 'fetch'], ['fetch', 'undici']]
			t.notThrow(() => new Headers(init))
		})
	})

	t.test('with object of header entries', t => {
		t.plan(1)
		const init = {
			'undici': 'fetch',
			'fetch': 'undici'
		}
		t.notThrow(() => new Headers(init))
	})
})

tap.test('Headers.append', t => {
	t.plan(2)

	t.test('throws error if guard is immutable', t => {
		t.plan(1)
		const headers = new Headers()
		headers.guard = 'immutable'
		t.throw(() => headers.append('undici', 'fetch'), TypeError('headers instance is immutable'))
	})

	t.test('normalizes and validates entry', t => {
		t.plan(22)

		const headers = new Headers()

		let name = 'UNDICI', value = 'FETCH'
		t.notThrow(() => headers.append(name, value))
		t.strictEqual(headers.get(name), value)

		t.throw(() => headers.append(), TypeError(`Invalid header name `), 'throws on undefined header name')
		t.throw(() => headers.append(''), TypeError(`Invalid header name `), 'throws on empty header name')
		t.throw(() => headers.append('undici-fetch'), TypeError('Invalid value  for header undici-fetch'), 'throws on undefined header value')
		t.throw(() => headers.append('undici-fetch', ''), TypeError('Invalid value  for header undici-fetch'), 'throws on empty header value')

		// 16 invalid characters - there are many others but this should cover all characters found on an US keyboard.
		// imo the validation functions are based on another spec and should be tested independently from this project and then dependended on.
		const invalidChars = ['@', '(', ')', ':', ';', ',', '<', '>', '/', '\\', '?', '[', ']', '{', '}', '=']
		for (const char of invalidChars) {
			t.throw(() => headers.append(char), TypeError(`Invalid header name ${char}`), `throws on invalid header name character ${char}`)
		}
	})

	t.test('returns without modifying list if guard is request and header name is forbidden', t => {
		t.plan(40)

		const headers = new Headers()
		headers.guard = 'request'

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

		for (const forbiddenHeaderName in forbiddenHeaderNames) {
			console.log(forbiddenHeaderName)
			t.notThrow(() => headers.append(forbiddenHeaderName, 'valid-value'))
			t.ok(!headers.has(forbiddenHeaderName))
		}
	})
})