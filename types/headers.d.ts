export = Headers;
/**
 * @typedef {[string, string][] | Record<string, string>} HeadersInit
 */
/**
 * Represents a WHATWG Fetch Spec [Header class](https://fetch.spec.whatwg.org/#headers-class)
 */
declare class Headers {
    /**
     * @param {HeadersInit} init Initial header list to be cloned into the new instance
     */
    constructor(init: HeadersInit);
    /**
     * Adds an entry to the instance
     * @param {string} name
     * @param {string} value
     */
    append(name: string, value: string): void;
    /**
     * Removes an entry from the instance
     * @param {string} name
     */
    delete(name: string): void;
    /**
     * Retrieves an entry from the instance. For headers with multiple values, they are returned in a string joined by `', '` characters.
     *
     * For example if the header entry `'foo'` had values `'fuzz'` and `'buzz'`, calling `get('foo')` will return `'fuzz, buzz'`.
     * @param {string} name
     * @returns {string | null}
     */
    get(name: string): string | null;
    /**
     * Checks for the existence of an entry in the instance
     * @param {string} name
     * @returns {boolean}
     */
    has(name: string): boolean;
    /**
     * Overrides an entry on the instance. Use [append]{@link Headers.append} for non-destructive operation.
     * @param {*} name
     * @param {*} value
     */
    set(name: any, value: any): void;
    /**
     * @returns {[string, string[]]}
     */
    [Symbol.iterator](): [string, string[]];
}
declare namespace Headers {
    export { HeadersInit };
}
type HeadersInit = Record<string, string> | [string, string][];
