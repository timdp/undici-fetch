/// <reference types="node" />
export = Body;
/**
 * @typedef {import('stream').Readable} Readable
 * @typedef {Readable | null} BodyInput
 * */
/**
 * Represents a WHATWG Fetch Spec [Body Mixin](https://fetch.spec.whatwg.org/#body-mixin)
 */
declare class Body {
    /**
     * @param {BodyInput} input
     */
    constructor(input?: BodyInput);
    get body(): BodyInput;
    get bodyUsed(): boolean;
    arrayBuffer(): Promise<Buffer | null>;
    blob(): Promise<void>;
    formData(): Promise<void>;
    /**
     * @returns {Promise<unknown | null>}
     */
    json(): Promise<unknown | null>;
    text(): Promise<string | null>;
}
declare namespace Body {
    export { Readable, BodyInput };
}
type BodyInput = import("stream").Readable | null;
type Readable = import("stream").Readable;
