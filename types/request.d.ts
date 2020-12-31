/// <reference types="node" />
export = Request;
/**
 * @typedef RequestInit
 * @property {string} [method] - Defaults to 'GET'
 * @property {Headers | import('./headers').HeadersInit} [headers]
 * @property {import('./body').BodyInput} [body]
 */
/**
 * Represents a WHATWG Fetch Spec [Request Class](https://fetch.spec.whatwg.org/#request-class)
 */
declare class Request extends Body {
    /**
     * @param {Request | string} input
     * @param {RequestInit} [init]
     */
    constructor(input: Request | string, init?: RequestInit | undefined);
    url: URL | undefined;
    method: string | undefined;
    headers: Headers | undefined;
    /**
     * Returns a new Request instance inheriting from the current instance. Throws an error if the current instance `.bodyUsed` is `true`.
     */
    clone(): import("./request");
}
declare namespace Request {
    export { RequestInit };
}
import Body = require("./body");
import Headers = require("./headers");
type RequestInit = {
    /**
     * - Defaults to 'GET'
     */
    method?: string | undefined;
    headers?: Record<string, string> | [string, string][] | Headers | undefined;
    body?: import("stream").Readable | null | undefined;
};
