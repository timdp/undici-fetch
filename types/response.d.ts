export = Response;
/**
 * Represents a WHATWG Fetch Spec [Response Class](https://fetch.spec.whatwg.org/#response-class)
 */
declare class Response extends Body {
    /**
     * Generates a Response instance with `type` set to `'error'` and a `body` set to `null`.
     */
    static error(): Response;
    /**
     * Generates a redirect Response instance with a `'location'` header
     * @param {string} url
     * @param {number} status Must be 301, 302, 303, 307, or 308
     */
    static redirect(url: string, status: number): Response;
    /**
     * @typedef ResponseInit
     * @property {number} [status]
     * @property {string} [statusText]
     * @property {Headers | import('./headers').HeadersInit} [headers]
     *
     * @param {import('./body').BodyInput} body
     * @param {ResponseInit} [init]
     */
    constructor(body: import('./body').BodyInput, init?: {
        status?: number | undefined;
        statusText?: string | undefined;
        headers?: Record<string, string> | [string, string][] | Headers | undefined;
    } | undefined);
    headers: Headers;
    ok: boolean;
    status: number;
    statusText: string;
    type: string;
    /**
     * Returns a new Response instance inheriting from the current instance. Throws an error if the current instance `.bodyUsed` is `true`.
     */
    clone(): Response;
}
import Body = require("./body");
import Headers = require("./headers");
